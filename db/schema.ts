import { pgTable, text, serial, integer, boolean, timestamp, foreignKey, jsonb } from "drizzle-orm/pg-core";
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
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: text("company_name"),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  taxId: text("tax_id"),
});

// Customs Brokers
export const customsBrokers = pgTable("customs_brokers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licenseNumber: text("license_number").unique().notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  specializations: text("specializations").array().notNull(),
});

// International Agents
export const internationalAgents = pgTable("international_agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  agencyName: text("agency_name").notNull(),
  country: text("country").notNull(),
  servicesOffered: text("services_offered").array().notNull(),
});

// Truckers
export const truckers = pgTable("truckers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  driverLicense: text("driver_license").unique().notNull(),
  vehicleType: text("vehicle_type").notNull(),
  availabilityStatus: text("availability_status").notNull(),
});

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
export const insertCustomsBrokerSchema = createInsertSchema(customsBrokers);
export const selectCustomsBrokerSchema = createSelectSchema(customsBrokers);
export const insertInternationalAgentSchema = createInsertSchema(internationalAgents);
export const selectInternationalAgentSchema = createSelectSchema(internationalAgents);
export const insertTruckerSchema = createInsertSchema(truckers);
export const selectTruckerSchema = createSelectSchema(truckers);

// TypeScript types
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
export type CustomsBroker = typeof customsBrokers.$inferSelect;
export type InsertCustomsBroker = typeof customsBrokers.$inferInsert;
export type InternationalAgent = typeof internationalAgents.$inferSelect;
export type InsertInternationalAgent = typeof internationalAgents.$inferInsert;
export type Trucker = typeof truckers.$inferSelect;
export type InsertTrucker = typeof truckers.$inferInsert;

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
  details: jsonb("details"), // Flexible field for additional shipment details
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// Shipping Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").references(() => shipments.id).notNull(),
  type: text("type").notNull(), // invoice, bill_of_lading, customs, etc.
  filename: text("filename").notNull(),
  fileUrl: text("file_url").notNull(),
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