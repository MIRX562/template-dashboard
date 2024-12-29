import { db } from "@/db";
import { logsTable } from "@/db/schemas/log-schema";
import { CRUDResource, LogAction, LogDataMap } from "@/db/schemas/types";

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
