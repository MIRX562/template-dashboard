import { InferSelectModel } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { z } from "zod";

export const rolesEnum = pgEnum("roles", ["Admin", "Employee"]);

export const usersTable = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: text().notNull(),
    role: rolesEnum().default("Employee").notNull(),
    createdAt: timestamp().defaultNow(),
  },
  (table) => {
    return [uniqueIndex("emailIndex").on(table.email)];
  }
);
export type User = InferSelectModel<typeof usersTable>;

//zod
export const registerUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});
export type RegisterUser = z.infer<typeof registerUserSchema>;

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});
