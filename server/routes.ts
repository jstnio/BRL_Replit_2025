import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { airlines, airports, oceanCarriers, documents, shipments, ports, countries, customers, internationalAgents, truckers, customsBrokers, portTerminals, warehouses, inboundAirfreightShipments } from "@db/schema";
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

  // Countries CRUD endpoints
  app.get("/api/admin/countries", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allCountries = await db.select().from(countries);
      res.json(allCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.post("/api/admin/countries", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating country with data:", req.body);
      const [country] = await db.insert(countries).values(req.body).returning();
      console.log("Created country:", country);
      res.json(country);
    } catch (error) {
      console.error("Error creating country:", error);
      res.status(500).json({ error: "Failed to create country", details: error.message });
    }
  });

  app.put("/api/admin/countries/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [country] = await db
        .update(countries)
        .set(req.body)
        .where(eq(countries.id, parseInt(req.params.id)))
        .returning();
      res.json(country);
    } catch (error) {
      console.error("Error updating country:", error);
      res.status(500).json({ error: "Failed to update country" });
    }
  });

  app.delete("/api/admin/countries/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [country] = await db
        .delete(countries)
        .where(eq(countries.id, parseInt(req.params.id)))
        .returning();
      res.json(country);
    } catch (error) {
      console.error("Error deleting country:", error);
      res.status(500).json({ error: "Failed to delete country" });
    }
  });

  // Customers CRUD endpoints
  app.get("/api/admin/customers", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allCustomers = await db.select().from(customers);
      res.json(allCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.post("/api/admin/customers", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating customer with data:", req.body);
      const [customer] = await db.insert(customers).values(req.body).returning();
      console.log("Created customer:", customer);
      res.json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "Failed to create customer", details: error.message });
    }
  });

  app.put("/api/admin/customers/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [customer] = await db
        .update(customers)
        .set(req.body)
        .where(eq(customers.id, parseInt(req.params.id)))
        .returning();
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  app.delete("/api/admin/customers/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [customer] = await db
        .delete(customers)
        .where(eq(customers.id, parseInt(req.params.id)))
        .returning();
      res.json(customer);
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  // International Agents CRUD endpoints
  app.get("/api/admin/international-agents", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allAgents = await db.select().from(internationalAgents);
      res.json(allAgents);
    } catch (error) {
      console.error("Error fetching international agents:", error);
      res.status(500).json({ error: "Failed to fetch international agents" });
    }
  });

  app.post("/api/admin/international-agents", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating international agent with data:", req.body);
      const [agent] = await db.insert(internationalAgents).values(req.body).returning();
      console.log("Created international agent:", agent);
      res.json(agent);
    } catch (error) {
      console.error("Error creating international agent:", error);
      res.status(500).json({ error: "Failed to create international agent", details: error.message });
    }
  });

  app.put("/api/admin/international-agents/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [agent] = await db
        .update(internationalAgents)
        .set(req.body)
        .where(eq(internationalAgents.id, parseInt(req.params.id)))
        .returning();
      res.json(agent);
    } catch (error) {
      console.error("Error updating international agent:", error);
      res.status(500).json({ error: "Failed to update international agent" });
    }
  });

  app.delete("/api/admin/international-agents/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [agent] = await db
        .delete(internationalAgents)
        .where(eq(internationalAgents.id, parseInt(req.params.id)))
        .returning();
      res.json(agent);
    } catch (error) {
      console.error("Error deleting international agent:", error);
      res.status(500).json({ error: "Failed to delete international agent" });
    }
  });

  // Truckers CRUD endpoints
  app.get("/api/admin/truckers", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allTruckers = await db.select().from(truckers);
      res.json(allTruckers);
    } catch (error) {
      console.error("Error fetching truckers:", error);
      res.status(500).json({ error: "Failed to fetch truckers" });
    }
  });

  app.post("/api/admin/truckers", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating trucker with data:", req.body);
      const [trucker] = await db.insert(truckers).values(req.body).returning();
      console.log("Created trucker:", trucker);
      res.json(trucker);
    } catch (error) {
      console.error("Error creating trucker:", error);
      res.status(500).json({ error: "Failed to create trucker", details: error.message });
    }
  });

  app.put("/api/admin/truckers/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [trucker] = await db
        .update(truckers)
        .set(req.body)
        .where(eq(truckers.id, parseInt(req.params.id)))
        .returning();
      res.json(trucker);
    } catch (error) {
      console.error("Error updating trucker:", error);
      res.status(500).json({ error: "Failed to update trucker" });
    }
  });

  app.delete("/api/admin/truckers/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [trucker] = await db
        .delete(truckers)
        .where(eq(truckers.id, parseInt(req.params.id)))
        .returning();
      res.json(trucker);
    } catch (error) {
      console.error("Error deleting trucker:", error);
      res.status(500).json({ error: "Failed to delete trucker" });
    }
  });

  // Customs Brokers CRUD endpoints
  app.get("/api/admin/customs-brokers", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allBrokers = await db.select().from(customsBrokers);
      res.json(allBrokers);
    } catch (error) {
      console.error("Error fetching customs brokers:", error);
      res.status(500).json({ error: "Failed to fetch customs brokers" });
    }
  });

  app.post("/api/admin/customs-brokers", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating customs broker with data:", req.body);
      const [broker] = await db.insert(customsBrokers).values(req.body).returning();
      console.log("Created customs broker:", broker);
      res.json(broker);
    } catch (error) {
      console.error("Error creating customs broker:", error);
      res.status(500).json({ error: "Failed to create customs broker", details: error.message });
    }
  });

  app.put("/api/admin/customs-brokers/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [broker] = await db
        .update(customsBrokers)
        .set(req.body)
        .where(eq(customsBrokers.id, parseInt(req.params.id)))
        .returning();
      res.json(broker);
    } catch (error) {
      console.error("Error updating customs broker:", error);
      res.status(500).json({ error: "Failed to update customs broker" });
    }
  });

  app.delete("/api/admin/customs-brokers/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [broker] = await db
        .delete(customsBrokers)
        .where(eq(customsBrokers.id, parseInt(req.params.id)))
        .returning();
      res.json(broker);
    } catch (error) {
      console.error("Error deleting customs broker:", error);
      res.status(500).json({ error: "Failed to delete customs broker" });
    }
  });

  // Port Terminals CRUD endpoints
  app.get("/api/admin/port-terminals", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allTerminals = await db.select().from(portTerminals);
      res.json(allTerminals);
    } catch (error) {
      console.error("Error fetching port terminals:", error);
      res.status(500).json({ error: "Failed to fetch port terminals" });
    }
  });

  app.post("/api/admin/port-terminals", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating port terminal with data:", req.body);
      const [terminal] = await db.insert(portTerminals).values(req.body).returning();
      console.log("Created port terminal:", terminal);
      res.json(terminal);
    } catch (error) {
      console.error("Error creating port terminal:", error);
      res.status(500).json({ error: "Failed to create port terminal", details: error.message });
    }
  });

  app.put("/api/admin/port-terminals/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [terminal] = await db
        .update(portTerminals)
        .set(req.body)
        .where(eq(portTerminals.id, parseInt(req.params.id)))
        .returning();
      res.json(terminal);
    } catch (error) {
      console.error("Error updating port terminal:", error);
      res.status(500).json({ error: "Failed to update port terminal" });
    }
  });

  app.delete("/api/admin/port-terminals/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [terminal] = await db
        .delete(portTerminals)
        .where(eq(portTerminals.id, parseInt(req.params.id)))
        .returning();
      res.json(terminal);
    } catch (error) {
      console.error("Error deleting port terminal:", error);
      res.status(500).json({ error: "Failed to delete port terminal" });
    }
  });

  // Warehouses CRUD endpoints
  app.get("/api/admin/warehouses", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const allWarehouses = await db.select().from(warehouses);
      res.json(allWarehouses);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      res.status(500).json({ error: "Failed to fetch warehouses" });
    }
  });

  app.post("/api/admin/warehouses", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating warehouse with data:", req.body);
      const [warehouse] = await db.insert(warehouses).values(req.body).returning();
      console.log("Created warehouse:", warehouse);
      res.json(warehouse);
    } catch (error) {
      console.error("Error creating warehouse:", error);
      res.status(500).json({ error: "Failed to create warehouse", details: error.message });
    }
  });

  app.put("/api/admin/warehouses/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [warehouse] = await db
        .update(warehouses)
        .set(req.body)
        .where(eq(warehouses.id, parseInt(req.params.id)))
        .returning();
      res.json(warehouse);
    } catch (error) {
      console.error("Error updating warehouse:", error);
      res.status(500).json({ error: "Failed to update warehouse" });
    }
  });

  app.delete("/api/admin/warehouses/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const [warehouse] = await db
        .delete(warehouses)
        .where(eq(warehouses.id, parseInt(req.params.id)))
        .returning();
      res.json(warehouse);
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      res.status(500).json({ error: "Failed to delete warehouse" });
    }
  });

  // Inbound Airfreight Shipments routes
  app.get("/api/admin/airfreight/inbound", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      // First get basic shipment data
      const allShipments = await db
        .select({
          id: inboundAirfreightShipments.id,
          brlReference: inboundAirfreightShipments.brlReference,
          hawb: inboundAirfreightShipments.hawb,
          mawb: inboundAirfreightShipments.mawb,
          flightNumber: inboundAirfreightShipments.flightNumber,
          departureDate: inboundAirfreightShipments.departureDate,
          arrivalDate: inboundAirfreightShipments.arrivalDate,
          pieces: inboundAirfreightShipments.pieces,
          weight: inboundAirfreightShipments.weight,
          chargeableWeight: inboundAirfreightShipments.chargeableWeight,
          volume: inboundAirfreightShipments.volume,
          goodsDescription: inboundAirfreightShipments.goodsDescription,
          perishableCargo: inboundAirfreightShipments.perishableCargo,
          dangerousCargo: inboundAirfreightShipments.dangerousCargo,
          status: inboundAirfreightShipments.status,
          duimp: inboundAirfreightShipments.duimp,
          cct: inboundAirfreightShipments.cct,
          notes: inboundAirfreightShipments.notes,
          shipperId: inboundAirfreightShipments.shipperId,
          consigneeId: inboundAirfreightShipments.consigneeId,
          internationalAgentId: inboundAirfreightShipments.internationalAgentId,
          airlineId: inboundAirfreightShipments.airlineId,
          originAirportId: inboundAirfreightShipments.originAirportId,
          destinationAirportId: inboundAirfreightShipments.destinationAirportId,
          customsBrokerId: inboundAirfreightShipments.customsBrokerId,
          truckerId: inboundAirfreightShipments.truckerId,
        })
        .from(inboundAirfreightShipments)
        .orderBy(inboundAirfreightShipments.createdAt);

      // Then get the related data
      const shipmentDetails = await Promise.all(
        allShipments.map(async (shipment) => {
          const [originAirport] = await db
            .select()
            .from(airports)
            .where(eq(airports.id, shipment.originAirportId));

          const [destinationAirport] = await db
            .select()
            .from(airports)
            .where(eq(airports.id, shipment.destinationAirportId));

          return {
            ...shipment,
            originAirport,
            destinationAirport,
          };
        })
      );

      console.log("Successfully fetched shipments:", shipmentDetails);
      res.json(shipmentDetails);
    } catch (error: any) {
      console.error("Error fetching inbound airfreight shipments:", error);
      res.status(500).json({ 
        error: "Failed to fetch inbound airfreight shipments", 
        details: error.message,
        stack: error.stack 
      });
    }
  });

  app.post("/api/admin/airfreight/inbound", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Creating inbound airfreight shipment with data:", req.body);

      // Validate the brlReference is unique
      if (req.body.brlReference) {
        const existing = await db
          .select()
          .from(inboundAirfreightShipments)
          .where(eq(inboundAirfreightShipments.brlReference, req.body.brlReference))
          .limit(1);

        if (existing.length > 0) {
          return res.status(400).json({ error: "BRL Reference must be unique" });
        }
      }

      // Create the shipment
      const [shipment] = await db
        .insert(inboundAirfreightShipments)
        .values({
          brlReference: req.body.brlReference,
          shipperId: parseInt(req.body.shipperId),
          consigneeId: parseInt(req.body.consigneeId),
          internationalAgentId: parseInt(req.body.internationalAgentId),
          airlineId: parseInt(req.body.airlineId),
          originAirportId: parseInt(req.body.originAirportId),
          destinationAirportId: parseInt(req.body.destinationAirportId),
          customsBrokerId: parseInt(req.body.customsBrokerId),
          truckerId: parseInt(req.body.truckerId),
          hawb: req.body.hawb,
          mawb: req.body.mawb,
          flightNumber: req.body.flightNumber,
          departureDate: new Date(req.body.departureDate),
          arrivalDate: new Date(req.body.arrivalDate),
          pieces: parseInt(req.body.pieces),
          weight: req.body.weight,
          chargeableWeight: req.body.chargeableWeight,
          volume: req.body.volume,
          goodsDescription: req.body.goodsDescription,
          perishableCargo: req.body.perishableCargo,
          dangerousCargo: req.body.dangerousCargo,
          duimp: req.body.duimp,
          cct: req.body.cct,
          notes: req.body.notes,
        })
        .returning();

      console.log("Created inbound airfreight shipment:", shipment);
      res.json(shipment);
    } catch (error: any) {
      console.error("Error creating inbound airfreight shipment:", error);
      res.status(500).json({ 
        error: "Failed to create inbound airfreight shipment", 
        details: error.message 
      });
    }
  });

  app.delete("/api/admin/airfreight/inbound/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Deleting inbound airfreight shipment with ID:", req.params.id);

      // Verify shipment exists
      const [existingShipment] = await db
        .select()
        .from(inboundAirfreightShipments)
        .where(eq(inboundAirfreightShipments.id, parseInt(req.params.id)))
        .limit(1);

      if (!existingShipment) {
        return res.status(404).json({ error: "Shipment not found" });
      }

      // Delete the shipment
      const [deletedShipment] = await db
        .delete(inboundAirfreightShipments)
        .where(eq(inboundAirfreightShipments.id, parseInt(req.params.id)))
        .returning();

      console.log("Successfully deleted shipment:", deletedShipment);
      res.json(deletedShipment);
    } catch (error: any) {
      console.error("Error deleting inbound airfreight shipment:", error);
      res.status(500).json({ 
        error: "Failed to delete inbound airfreight shipment", 
        details: error.message,
        stack: error.stack 
      });
    }
  });

  return httpServer;
}