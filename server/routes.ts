import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express): Server {
  // Initialize authentication and get middleware helpers
  const { isAuthenticated, hasRole } = setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // Protected routes example:
  // app.get("/api/admin", isAuthenticated, hasRole(["admin"]), (req, res) => { ... });
  // app.get("/api/customer", isAuthenticated, hasRole(["customer"]), (req, res) => { ... });

  return httpServer;
}