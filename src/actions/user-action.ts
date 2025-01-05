"use server";
import { CreateUser, usersTable } from "@/db/schemas";
import { logAction } from "./log-action";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function createUser(data: CreateUser) {
  try {
    // Input validation
    if (!data) {
      await logAction(null, "ERROR", "users", "Invalid input provided", {
        endpoint: "user server action",
      });
      throw new Error("Invalid Input");
    }

    // Example database operation
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1)
      .execute();
    if (existingUser.length > 0) {
      await logAction(null, "ERROR", "users", "User already exists", {
        endpoint: "user server action",
      });
      throw new Error("User already exists");
    }

    // Your database operation here
    const newUser = await db
      .insert(usersTable)
      .values({ ...data })
      .returning();

    await logAction(
      null,
      "CREATE",
      "users",
      `User:${newUser[0].name} Created`,
      { resourceId: newUser[0].id }
    );
    return { success: true, message: "User Created" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unexpected error occurred" };
    }
  }
}
