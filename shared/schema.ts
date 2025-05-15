import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type")
    .$type<
      | "bedroom"
      | "bathroom"
      | "kitchen"
      | "living_room"
      | "hallway"
      | "media_room"
      | "office"
      | "other"
    >()
    .notNull(),
});

export type Room = typeof rooms.$inferSelect;
