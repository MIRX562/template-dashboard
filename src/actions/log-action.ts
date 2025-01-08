"use server";
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import {
  CRUDResource,
  LogAction,
  LogDataMap,
  logsTable,
} from "@/db/schemas/log-schema";
import { getCurrentSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

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

export async function bulkDeleteLog(data: GetLogs[]) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }

    await Promise.all(
      data.map((row) => db.delete(logsTable).where(eq(logsTable.id, row.id)))
    );
  } catch (error) {
    throw error;
  }
}

export async function deleteLog(id: number) {
  //session validation
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error(`Not Authorized!!`);
  }

  await db.delete(logsTable).where(eq(logsTable.id, id));
}

// fetcher
export async function getLogs() {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }
    const logs = db
      .select({
        id: logsTable.id,
        actor: usersTable.name,
        action: logsTable.action,
        resource: logsTable.resource,
        message: logsTable.message,
        data: logsTable.data,
        date: logsTable.createdAt,
      })
      .from(logsTable)
      .leftJoin(usersTable, eq(logsTable.userId, usersTable.id))
      .execute();
    return logs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export type GetLogs = Awaited<ReturnType<typeof getLogs>>[number];
