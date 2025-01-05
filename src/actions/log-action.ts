"use server";
import { db } from "@/db";
import { logsTable } from "@/db/schemas/log-schema";

export type LogDataMap = {
  CREATE: { resourceId: string };
  READ: { resourceId: string | null };
  UPDATE: { resourceId: string };
  DELETE: { resourceId: string };
  LOGIN: { ip: string };
  LOGOUT: null;
  ERROR: { endpoint?: string; errorMessage?: string };
};

export type LogAction = keyof LogDataMap;

export type CRUDResource = "users" | "sessions" | "files";

export async function logAction<T extends LogAction>(
  userId: string | null,
  action: T,
  resource: CRUDResource | null = null,
  message: string | null = null,
  data: LogDataMap[T] = null
) {
  await db.insert(logsTable).values({
    userId,
    action,
    resource,
    message,
    data,
  });
}

export async function logCreate(
  userId: string | null,
  resource: CRUDResource,
  resourceId: string
) {
  await logAction(userId, "CREATE", resource, `Created ${resource}`, {
    resourceId,
  });
}

export async function logUpdate(
  userId: string | null,
  resource: CRUDResource,
  resourceId: string
) {
  await logAction(userId, "UPDATE", resource, `Updated ${resource}`, {
    resourceId,
  });
}

export async function logDelete(
  userId: string | null,
  resource: CRUDResource,
  resourceId: string
) {
  await logAction(userId, "DELETE", resource, `Deleted ${resource}`, {
    resourceId,
  });
}
