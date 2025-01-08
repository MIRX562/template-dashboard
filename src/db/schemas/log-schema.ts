import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user-schema";
import {
  CircleSlash,
  DiamondPlus,
  Eye,
  File,
  FileClock,
  LogIn,
  LogOut,
  OctagonX,
  Pencil,
  User,
} from "lucide-react";

export const logsTable = pgTable("logs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  action: text("action").notNull(),
  resource: text("resource"),
  message: text("message"),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//? server  action helper
export type LogDataMap = {
  CREATE: { resourceId: string };
  READ: { resourceId: string | null };
  UPDATE: { resourceId: string };
  DELETE: { resourceId: string };
  LOGIN: { ip: string };
  LOGOUT: null;
  ERROR: { endpoint?: string; errorMessage?: string };
  EXPORT: null;
  IMPORT: null;
};
export type LogAction = keyof LogDataMap;
export type CRUDResource = "users" | "sessions" | "files" | "logs";

//? Table filter options
export const logActions = [
  {
    value: "CREATE",
    label: "Create",
    icon: DiamondPlus,
  },
  {
    value: "READ",
    label: "Read",
    icon: Eye,
  },
  {
    value: "UPDATE",
    label: "Update",
    icon: Pencil,
  },
  {
    value: "DELETE",
    label: "Delete",
    icon: OctagonX,
  },
  {
    value: "LOGIN",
    label: "Login",
    icon: LogIn,
  },
  {
    value: "LOGOUT",
    label: "Logout",
    icon: LogOut,
  },
  {
    value: "ERROR",
    label: "Error",
    icon: CircleSlash,
  },
];

export const logResources = [
  {
    value: "users",
    label: "Users",
    icon: User,
  },
  {
    value: "sessions",
    label: "Sessions",
    icon: FileClock,
  },
  {
    value: "files",
    label: "Files",
    icon: File,
  },
];
