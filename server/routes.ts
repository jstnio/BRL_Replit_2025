import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { airlines, airports, oceanCarriers, documents, shipments, ports } from "@db/schema";
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

  // Ocean Carriers CRUD endpoints
  app.get("/api/admin/ocean-carriers", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allCarriers = await db.select().from(oceanCarriers);
      res.json(allCarriers);
    } catch (error) {
      console.error("Error fetching ocean carriers:", error);
      res.status(500).json({ error: "Failed to fetch ocean carriers" });
    }
  });

  app.post("/api/admin/ocean-carriers", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating ocean carrier with data:", req.body);
      const [carrier] = await db.insert(oceanCarriers).values(req.body).returning();
      console.log("Created ocean carrier:", carrier);
      res.json(carrier);
    } catch (error) {
      console.error("Error creating ocean carrier:", error);
      res.status(500).json({ error: "Failed to create ocean carrier", details: error.message });
    }
  });

  app.put("/api/admin/ocean-carriers/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [carrier] = await db
        .update(oceanCarriers)
        .set(req.body)
        .where(eq(oceanCarriers.id, parseInt(req.params.id)))
        .returning();
      res.json(carrier);
    } catch (error) {
      console.error("Error updating ocean carrier:", error);
      res.status(500).json({ error: "Failed to update ocean carrier" });
    }
  });

  app.delete("/api/admin/ocean-carriers/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [carrier] = await db
        .delete(oceanCarriers)
        .where(eq(oceanCarriers.id, parseInt(req.params.id)))
        .returning();
      res.json(carrier);
    } catch (error) {
      console.error("Error deleting ocean carrier:", error);
      res.status(500).json({ error: "Failed to delete ocean carrier" });
    }
  });

  // Documents CRUD endpoints
  app.get("/api/admin/documents", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allDocuments = await db
        .select({
          ...documents,
          shipment: {
            id: shipments.id,
            trackingNumber: shipments.trackingNumber,
          },
        })
        .from(documents)
        .leftJoin(shipments, eq(documents.shipmentId, shipments.id));
      res.json(allDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Get all shipments for document form
  app.get("/api/admin/shipments", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allShipments = await db.select().from(shipments);
      res.json(allShipments);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ error: "Failed to fetch shipments" });
    }
  });

  app.post("/api/admin/documents", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating document with data:", req.body);
      const [document] = await db.insert(documents).values({
        ...req.body,
        uploadedAt: new Date(),
      }).returning();
      console.log("Created document:", document);
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document", details: error.message });
    }
  });

  app.put("/api/admin/documents/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [document] = await db
        .update(documents)
        .set(req.body)
        .where(eq(documents.id, parseInt(req.params.id)))
        .returning();
      res.json(document);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/admin/documents/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [document] = await db
        .delete(documents)
        .where(eq(documents.id, parseInt(req.params.id)))
        .returning();
      res.json(document);
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // Ports CRUD endpoints
  app.get("/api/admin/ports", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allPorts = await db.select().from(ports);
      res.json(allPorts);
    } catch (error) {
      console.error("Error fetching ports:", error);
      res.status(500).json({ error: "Failed to fetch ports" });
    }
  });

  app.post("/api/admin/ports", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating port with data:", req.body);
      const [port] = await db.insert(ports).values(req.body).returning();
      console.log("Created port:", port);
      res.json(port);
    } catch (error) {
      console.error("Error creating port:", error);
      res.status(500).json({ error: "Failed to create port", details: error.message });
    }
  });

  app.put("/api/admin/ports/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [port] = await db
        .update(ports)
        .set(req.body)
        .where(eq(ports.id, parseInt(req.params.id)))
        .returning();
      res.json(port);
    } catch (error) {
      console.error("Error updating port:", error);
      res.status(500).json({ error: "Failed to update port" });
    }
  });

  app.delete("/api/admin/ports/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [port] = await db
        .delete(ports)
        .where(eq(ports.id, parseInt(req.params.id)))
        .returning();
      res.json(port);
    } catch (error) {
      console.error("Error deleting port:", error);
      res.status(500).json({ error: "Failed to delete port" });
    }
  });

  return httpServer;
}