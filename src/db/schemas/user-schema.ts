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
import { ShieldCheck, User2 } from "lucide-react";
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
    avatarUrl: text(),
    createdAt: timestamp().defaultNow(),
  },
  (table) => {
    return [uniqueIndex("emailIndex").on(table.email)];
  }
);
export type User = InferSelectModel<typeof usersTable>;

//? ZOD Schemas
//auth
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type Login = z.infer<typeof loginSchema>;

export const registerUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});
export type RegisterUser = z.infer<typeof registerUserSchema>;

//user profile
export const updateProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export const passwordResetSchema = z
  .object({
    current_pass: z.string(),
    new_pass: z.string(),
    confirm_pass: z.string(),
    id: z.string(),
  })
  .refine((data) => data.new_pass === data.confirm_pass, {
    message: "Passwords don't match",
    path: ["confirm_pass"],
  });
export type ResetPassword = z.infer<typeof passwordResetSchema>;

//user management
export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["Admin", "Employee"]),
  // avatarUrl: z.string().optional(),
});
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["Admin", "Employee"]),
});
export type UpdateUser = z.infer<typeof updateUserSchema>;

//? Table filter options
export const userRoles = [
  {
    value: "Admin",
    label: "Admin",
    icon: ShieldCheck,
  },
  {
    value: "Employee",
    label: "Employee",
    icon: User2,
  },
];
