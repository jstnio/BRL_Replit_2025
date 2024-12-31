import { Router } from "express";
import passport from "passport";
import { db } from "@db";
import { users, insertUserSchema } from "@db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const router = Router();

// Register new user
router.post("/api/auth/register", async (req, res) => {
  try {
    const result = insertUserSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
    }

    const { username, password } = result.data;
    
    // Check if username already exists
    const [existingUser] = await db.select().from(users).where(eq(users.username, username));
    
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({ username, password: hashedPassword })
      .returning();

    res.status(201).json({ message: "User created successfully", id: newUser.id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in successfully" });
});

// Logout
router.post("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Get current user
router.get("/api/auth/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

export default router;
