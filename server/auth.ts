import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type Express, type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "@db";
import { users, roles } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// extend express user object with our schema
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      roleId: number;
      role: {
        name: string;
        description: string | null;
      } | null;
    }
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID || "brl-global-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: app.get("env") === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Get user with their role information
        const [user] = await db
          .select({
            id: users.id,
            username: users.username,
            password: users.password,
            email: users.email,
            roleId: users.roleId,
            role: {
              name: roles.name,
              description: roles.description,
            },
          })
          .from(users)
          .leftJoin(roles, eq(users.roleId, roles.id))
          .where(eq(users.username, username))
          .limit(1);

        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }

        // Remove password from user object before serializing
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          roleId: users.roleId,
          role: {
            name: roles.name,
            description: roles.description,
          },
        })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email, role = "customer" } = req.body;

      // Validate required fields
      if (!username || !password || !email) {
        return res.status(400).send("Missing required fields");
      }

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      // Get role ID
      const [userRole] = await db
        .select()
        .from(roles)
        .where(eq(roles.name, role))
        .limit(1);

      if (!userRole) {
        return res.status(400).send("Invalid role");
      }

      // Hash password with bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          email,
          roleId: userRole.id,
        })
        .returning();

      res.json({
        message: "Registration successful",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).send(info?.message || "Login failed");
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.json({
          message: "Logged in successfully",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send("Logout failed");
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(req.user);
  });

  return {
    isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
      if (req.isAuthenticated()) {
        return next();
      }
      res.status(401).send("Not authenticated");
    },
    hasRole: (roleNames: string[]) => {
      return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.role) {
          return res.status(403).send("Forbidden");
        }

        if (roleNames.includes(req.user.role.name)) {
          return next();
        }

        res.status(403).send("Forbidden");
      };
    },
  };
}