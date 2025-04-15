import { pgTable, serial, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const EventTable = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  duration: varchar("duration", { length: 50 }).notNull(),
  calendlyUrl: varchar("calendly_url", { length: 255 }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  locationType: varchar("location_type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ContactTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}); 