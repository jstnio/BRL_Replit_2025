import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "./auth";
import authRoutes from "./routes/auth";

// Create memory store for sessions
const MemoryStoreSession = MemoryStore(session);

export function registerRoutes(app: Express): Server {
  // Session configuration
  app.use(
    session({
      secret: "your-secret-key", // In production, use environment variable
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // Prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Register authentication routes
  app.use(authRoutes);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}