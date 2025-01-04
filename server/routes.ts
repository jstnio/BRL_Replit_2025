import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { airlines, airports } from "@db/schema";
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

  // Airports CRUD endpoints
  app.get("/api/admin/airports", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allAirports = await db.select().from(airports);
      res.json(allAirports);
    } catch (error) {
      console.error("Error fetching airports:", error);
      res.status(500).json({ error: "Failed to fetch airports" });
    }
  });

  app.post("/api/admin/airports", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating airport with data:", req.body);
      const [airport] = await db.insert(airports).values(req.body).returning();
      console.log("Created airport:", airport);
      res.json(airport);
    } catch (error) {
      console.error("Error creating airport:", error);
      res.status(500).json({ error: "Failed to create airport", details: error.message });
    }
  });

  app.put("/api/admin/airports/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [airport] = await db
        .update(airports)
        .set(req.body)
        .where(eq(airports.id, parseInt(req.params.id)))
        .returning();
      res.json(airport);
    } catch (error) {
      console.error("Error updating airport:", error);
      res.status(500).json({ error: "Failed to update airport" });
    }
  });

  app.delete("/api/admin/airports/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [airport] = await db
        .delete(airports)
        .where(eq(airports.id, parseInt(req.params.id)))
        .returning();
      res.json(airport);
    } catch (error) {
      console.error("Error deleting airport:", error);
      res.status(500).json({ error: "Failed to delete airport" });
    }
  });

  return httpServer;
}