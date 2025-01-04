import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { airlines } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Initialize authentication and get middleware helpers
  const { isAuthenticated, hasRole } = setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // Airlines CRUD endpoints
  app.get("/api/admin/airlines", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allAirlines = await db.select().from(airlines);
      res.json(allAirlines);
    } catch (error) {
      console.error("Error fetching airlines:", error);
      res.status(500).json({ error: "Failed to fetch airlines" });
    }
  });

  app.post("/api/admin/airlines", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating airline with data:", req.body);
      const [airline] = await db.insert(airlines).values(req.body).returning();
      console.log("Created airline:", airline);
      res.json(airline);
    } catch (error) {
      console.error("Error creating airline:", error);
      res.status(500).json({ error: "Failed to create airline", details: error.message });
    }
  });

  app.put("/api/admin/airlines/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [airline] = await db
        .update(airlines)
        .set(req.body)
        .where(eq(airlines.id, parseInt(req.params.id)))
        .returning();
      res.json(airline);
    } catch (error) {
      console.error("Error updating airline:", error);
      res.status(500).json({ error: "Failed to update airline" });
    }
  });

  app.delete("/api/admin/airlines/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [airline] = await db
        .delete(airlines)
        .where(eq(airlines.id, parseInt(req.params.id)))
        .returning();
      res.json(airline);
    } catch (error) {
      console.error("Error deleting airline:", error);
      res.status(500).json({ error: "Failed to delete airline" });
    }
  });

  return httpServer;
}