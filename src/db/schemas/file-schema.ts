import {
  bigint,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user-schema";

export const fileTable = pgTable("files", {
  id: uuid().primaryKey().defaultRandom(),
  url: text().notNull(),
  type: varchar({ length: 50 }).notNull(),
  mimeType: varchar({ length: 100 }).notNull(),
  size: bigint({ mode: "number" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  uploadedBy: uuid("uploaded_by").references(() => usersTable.id),
});
