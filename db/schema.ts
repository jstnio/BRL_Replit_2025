import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// User roles enum as a lookup table
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Users table with enhanced security and role support
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  active: boolean("active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Admins - additional admin-specific fields
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  accessLevel: text("access_level").notNull(),
  canManageUsers: boolean("can_manage_users").default(false).notNull(),
});

// Employees - internal staff
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  department: text("department").notNull(),
  position: text("position").notNull(),
  employeeId: text("employee_id").unique().notNull(),
});

// Customers - shipping clients
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  commercialName: text("commercial_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code").notNull(),
  taxId: text("tax_id"),
  eori: text("eori"),
  website: text("website"),
  notes: text("notes"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customs Brokers
export const customsBrokers = pgTable("customs_brokers", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  commercialName: text("commercial_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code").notNull(),
  taxId: text("tax_id"),
  licenseNumber: text("license_number").unique().notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  specializations: text("specializations").array(),
  website: text("website"),
  notes: text("notes"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomsBrokerSchema = createInsertSchema(customsBrokers);
export const selectCustomsBrokerSchema = createSelectSchema(customsBrokers);
export type CustomsBroker = typeof customsBrokers.$inferSelect;
export type InsertCustomsBroker = typeof customsBrokers.$inferInsert;

// International Agents table
export const internationalAgents = pgTable("international_agents", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  commercialName: text("commercial_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code").notNull(),
  taxId: text("tax_id"),
  eori: text("eori"),
  website: text("website"),
  notes: text("notes"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Truckers table with enhanced fields
export const truckers = pgTable("truckers", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  commercialName: text("commercial_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code").notNull(),
  taxId: text("tax_id"),
  website: text("website"),
  notes: text("notes"),
  availabilityStatus: text("availability_status").notNull().default('available'),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTruckerSchema = createInsertSchema(truckers);
export const selectTruckerSchema = createSelectSchema(truckers);
export type Trucker = typeof truckers.$inferSelect;
export type InsertTrucker = typeof truckers.$inferInsert;

// Warehouses table
export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique().notNull(),
  storageCapacity: text("storage_capacity").notNull(),
  currentUtilization: text("current_utilization"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code").notNull(),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  operatingHours: text("operating_hours").notNull(),
  securityLevel: text("security_level"),
  temperatureControl: boolean("temperature_control").default(false),
  hazmatCertified: boolean("hazmat_certified").default(false),
  notes: text("notes"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add to exports
export const insertWarehouseSchema = createInsertSchema(warehouses);
export const selectWarehouseSchema = createSelectSchema(warehouses);
export type Warehouse = typeof warehouses.$inferSelect;
export type InsertWarehouse = typeof warehouses.$inferInsert;

// Define relationships
export const userRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  admin: one(admins, {
    fields: [users.id],
    references: [admins.userId],
  }),
  employee: one(employees, {
    fields: [users.id],
    references: [employees.userId],
  }),
  customer: one(customers, {
    fields: [users.id],
    references: [customers.userId],
  }),
  customsBroker: one(customsBrokers, {
    fields: [users.id],
    references: [customsBrokers.userId],
  }),
  internationalAgent: one(internationalAgents, {
    fields: [users.id],
    references: [internationalAgents.userId],
  }),
  trucker: one(truckers, {
    fields: [users.id],
    references: [truckers.userId],
  }),
}));

// Create Zod schemas for validation
export const insertRoleSchema = createInsertSchema(roles);
export const selectRoleSchema = createSelectSchema(roles);
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertAdminSchema = createInsertSchema(admins);
export const selectAdminSchema = createSelectSchema(admins);
export const insertEmployeeSchema = createInsertSchema(employees);
export const selectEmployeeSchema = createSelectSchema(employees);
export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);
export const insertInternationalAgentSchema = createInsertSchema(internationalAgents);
export const selectInternationalAgentSchema = createSelectSchema(internationalAgents);


// Shipments
export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => customers.id).notNull(),
  trackingNumber: text("tracking_number").unique().notNull(),
  status: text("status").notNull().default("pending"),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  serviceType: text("service_type").notNull(), // ocean, air, ground
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  details: text("details"), // Flexible field for additional shipment details
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// Shipping Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").references(() => shipments.id), // Made optional by removing .notNull()
  type: text("type").notNull(), // invoice, bill_of_lading, customs, etc.
  filename: text("filename").notNull(),
  fileContent: text("file_content").notNull(), // Base64 encoded file content
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Sessions for auth persistence
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shipmentRelations = relations(shipments, ({ one, many }) => ({
  client: one(customers, {
    fields: [shipments.clientId],
    references: [customers.id],
  }),
  documents: many(documents),
}));

export const documentRelations = relations(documents, ({ one }) => ({
  shipment: one(shipments, {
    fields: [documents.shipmentId],
    references: [shipments.id],
  }),
}));

export const insertShipmentSchema = createInsertSchema(shipments);
export const selectShipmentSchema = createSelectSchema(shipments);
export const insertDocumentSchema = createInsertSchema(documents);
export const selectDocumentSchema = createSelectSchema(documents);
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

export type InsertShipment = typeof shipments.$inferInsert;
export type SelectShipment = typeof shipments.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
export type SelectDocument = typeof documents.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;

// Airlines table
export const airlines = pgTable("airlines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  iataCode: text("iata_code").unique(),
  country: text("country").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add to exports
export const insertAirlineSchema = createInsertSchema(airlines);
export const selectAirlineSchema = createSelectSchema(airlines);
export type Airline = typeof airlines.$inferSelect;
export type InsertAirline = typeof airlines.$inferInsert;

// Airports table
export const airports = pgTable("airports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  iataCode: text("iata_code").unique(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  timezone: text("timezone").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add to exports
export const insertAirportSchema = createInsertSchema(airports);
export const selectAirportSchema = createSelectSchema(airports);
export type Airport = typeof airports.$inferSelect;
export type InsertAirport = typeof airports.$inferInsert;

// Ocean Carriers table
export const oceanCarriers = pgTable("ocean_carriers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique(),
  country: text("country").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add to exports
export const insertOceanCarrierSchema = createInsertSchema(oceanCarriers);
export const selectOceanCarrierSchema = createSelectSchema(oceanCarriers);
export type OceanCarrier = typeof oceanCarriers.$inferSelect;
export type InsertOceanCarrier = typeof oceanCarriers.$inferInsert;

// Ports table
export const ports = pgTable("ports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  timezone: text("timezone").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add to exports
export const insertPortSchema = createInsertSchema(ports);
export const selectPortSchema = createSelectSchema(ports);
export type Port = typeof ports.$inferSelect;
export type InsertPort = typeof ports.$inferInsert;

// Countries table
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique().notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add to exports
export const insertCountrySchema = createInsertSchema(countries);
export const selectCountrySchema = createSelectSchema(countries);
export type Country = typeof countries.$inferSelect;
export type InsertCountry = typeof countries.$inferInsert;

// Port Terminals table
export const portTerminals = pgTable("port_terminals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  portId: integer("port_id").references(() => ports.id).notNull(),
  terminalCode: text("terminal_code").unique().notNull(),
  operatingHours: text("operating_hours").notNull(),
  cargoTypes: text("cargo_types").array(),
  maxVesselSize: text("max_vessel_size"),
  berthLength: text("berth_length"),
  maxDraft: text("max_draft"),
  storageCapacity: text("storage_capacity"),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const portTerminalRelations = relations(portTerminals, ({ one }) => ({
  port: one(ports, {
    fields: [portTerminals.portId],
    references: [ports.id],
  }),
}));

export const insertPortTerminalSchema = createInsertSchema(portTerminals);
export const selectPortTerminalSchema = createSelectSchema(portTerminals);
export type PortTerminal = typeof portTerminals.$inferSelect;
export type InsertPortTerminal = typeof portTerminals.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type InternationalAgent = typeof internationalAgents.$inferSelect;
export type InsertInternationalAgent = typeof internationalAgents.$inferInsert;

// Inbound Airfreight Shipments
export const inboundAirfreightShipments = pgTable("inbound_airfreight_shipments", {
  id: serial("id").primaryKey(),
  brlReference: text("brl_reference").notNull().unique(),
  shipperId: integer("shipper_id").references(() => customers.id).notNull(),
  consigneeId: integer("consignee_id").references(() => customers.id).notNull(),
  internationalAgentId: integer("international_agent_id").references(() => internationalAgents.id).notNull(),
  airlineId: integer("airline_id").references(() => airlines.id).notNull(),
  originAirportId: integer("origin_airport_id").references(() => airports.id).notNull(),
  destinationAirportId: integer("destination_airport_id").references(() => airports.id).notNull(),
  customsBrokerId: integer("customs_broker_id").references(() => customsBrokers.id).notNull(),
  truckerId: integer("trucker_id").references(() => truckers.id).notNull(),
  hawb: text("hawb").notNull(),
  mawb: text("mawb").notNull(),
  flightNumber: text("flight_number").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  arrivalDate: timestamp("arrival_date").notNull(),
  pieces: integer("pieces").notNull(),
  weight: text("weight").notNull(),
  chargeableWeight: text("chargeable_weight"), // Fixed field name to match API
  volume: text("volume"),
  goodsDescription: text("goods_description").notNull(),
  perishableCargo: boolean("perishable_cargo").default(false).notNull(),
  dangerousCargo: boolean("dangerous_cargo").default(false).notNull(),
  status: text("status").notNull().default("pending"),
  duimp: text("duimp"),
  cct: text("cct").notNull().default("Pending"),
  notes: text("notes"),
  customsClearanceStatus: text("customs_clearance_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add relations for inbound airfreight shipments
export const inboundAirfreightShipmentRelations = relations(inboundAirfreightShipments, ({ one }) => ({
  shipper: one(customers, {
    fields: [inboundAirfreightShipments.shipperId],
    references: [customers.id],
  }),
  consignee: one(customers, {
    fields: [inboundAirfreightShipments.consigneeId],
    references: [customers.id],
  }),
  internationalAgent: one(internationalAgents, {
    fields: [inboundAirfreightShipments.internationalAgentId],
    references: [internationalAgents.id],
  }),
  airline: one(airlines, {
    fields: [inboundAirfreightShipments.airlineId],
    references: [airlines.id],
  }),
  originAirport: one(airports, {
    fields: [inboundAirfreightShipments.originAirportId],
    references: [airports.id],
  }),
  destinationAirport: one(airports, {
    fields: [inboundAirfreightShipments.destinationAirportId],
    references: [airports.id],
  }),
  customsBroker: one(customsBrokers, {
    fields: [inboundAirfreightShipments.customsBrokerId],
    references: [customsBrokers.id],
  }),
  trucker: one(truckers, {
    fields: [inboundAirfreightShipments.truckerId],
    references: [truckers.id],
  }),
}));

// Add schema validation
export const insertInboundAirfreightShipmentSchema = createInsertSchema(inboundAirfreightShipments);
export const selectInboundAirfreightShipmentSchema = createSelectSchema(inboundAirfreightShipments);
export type InboundAirfreightShipment = typeof inboundAirfreightShipments.$inferSelect;
export type InsertInboundAirfreightShipment = typeof inboundAirfreightShipments.$inferInsert;

// Outbound Airfreight Shipments
export const outboundAirfreightShipments = pgTable("outbound_airfreight_shipments", {
  id: serial("id").primaryKey(),
  brlReference: text("brl_reference").notNull().unique(),
  shipperId: integer("shipper_id").references(() => customers.id).notNull(),
  consigneeId: integer("consignee_id").references(() => customers.id).notNull(),
  internationalAgentId: integer("international_agent_id").references(() => internationalAgents.id).notNull(),
  airlineId: integer("airline_id").references(() => airlines.id).notNull(),
  originAirportId: integer("origin_airport_id").references(() => airports.id).notNull(),
  destinationAirportId: integer("destination_airport_id").references(() => airports.id).notNull(),
  customsBrokerId: integer("customs_broker_id").references(() => customsBrokers.id).notNull(),
  truckerId: integer("trucker_id").references(() => truckers.id).notNull(),
  hawb: text("hawb").notNull(),
  mawb: text("mawb").notNull(),
  flightNumber: text("flight_number").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  arrivalDate: timestamp("arrival_date").notNull(),
  pieces: integer("pieces").notNull(),
  weight: text("weight").notNull(),
  chargeableWeight: text("chargeable_weight"),
  volume: text("volume"),
  goodsDescription: text("goods_description").notNull(),
  perishableCargo: boolean("perishable_cargo").default(false).notNull(),
  dangerousCargo: boolean("dangerous_cargo").default(false).notNull(),
  status: text("status").notNull().default("pending"),
  exportDeclaration: text("export_declaration"),
  dsic: text("dsic"),
  notes: text("notes"),
  customsClearanceStatus: text("customs_clearance_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add relations for outbound airfreight shipments
export const outboundAirfreightShipmentRelations = relations(outboundAirfreightShipments, ({ one }) => ({
  shipper: one(customers, {
    fields: [outboundAirfreightShipments.shipperId],
    references: [customers.id],
  }),
  consignee: one(customers, {
    fields: [outboundAirfreightShipments.consigneeId],
    references: [customers.id],
  }),
  internationalAgent: one(internationalAgents, {
    fields: [outboundAirfreightShipments.internationalAgentId],
    references: [internationalAgents.id],
  }),
  airline: one(airlines, {
    fields: [outboundAirfreightShipments.airlineId],
    references: [airlines.id],
  }),
  originAirport: one(airports, {
    fields: [outboundAirfreightShipments.originAirportId],
    references: [airports.id],
  }),
  destinationAirport: one(airports, {
    fields: [outboundAirfreightShipments.destinationAirportId],
    references: [airports.id],
  }),
  customsBroker: one(customsBrokers, {
    fields: [outboundAirfreightShipments.customsBrokerId],
    references: [customsBrokers.id],
  }),
  trucker: one(truckers, {
    fields: [outboundAirfreightShipments.truckerId],
    references: [truckers.id],
  }),
}));

// Add schema validation
export const insertOutboundAirfreightShipmentSchema = createInsertSchema(outboundAirfreightShipments);
export const selectOutboundAirfreightShipmentSchema = createSelectSchema(outboundAirfreightShipments);
export type OutboundAirfreightShipment = typeof outboundAirfreightShipments.$inferSelect;
export type InsertOutboundAirfreightShipment = typeof outboundAirfreightShipments.$inferInsert;