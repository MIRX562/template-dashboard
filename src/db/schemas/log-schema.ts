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
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .default(null),
  action: text("action").notNull(),
  resource: text("resource").default(null),
  message: text("message").default(null),
  data: jsonb("data").default(null),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
