import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user-schema";

export const logsTable = pgTable("logs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  action: text("action").notNull(),
  resource: text("resource"),
  message: text("message"),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
