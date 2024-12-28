import { InferSelectModel } from "drizzle-orm";
import { usersTable } from "./user-schema";
import { sessionTable } from "./session-schema";

//table type
export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionTable>;

//relation type

//helper
type LogDataMap = {
  CREATE: { resourceId: string; changes: Record<string, unknown> };
  READ: { resourceId: string | null; query: Record<string, unknown> };
  UPDATE: { resourceId: string; changes: Record<string, unknown> };
  DELETE: { resourceId: string };
  LOGIN: { ip: string };
  LOGOUT: null;
  SYSTEM_START: { version: string; env: string };
  ERROR: { endpoint: string; errorMessage: string };
};

type LogAction = keyof LogDataMap;

type CRUDResource = "users" | "posts" | "comments" | "products"; // Extend as needed
