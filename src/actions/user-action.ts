"use server";
import {
  CreateUser,
  createUserSchema,
  sessionTable,
  UpdateUser,
  updateUserSchema,
  usersTable,
} from "@/db/schemas";
import { logAction } from "./log-action";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { updateUserImageFile } from "./file-action";

//? CRUD
export async function createUser(data: CreateUser) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }
    // Input validation
    if (!data) {
      throw new Error(`no data received!`);
    }
    const validatedInput = createUserSchema.safeParse(data);
    if (!validatedInput.success) {
      await logAction(user.id, "ERROR", "users", "Invalid input provided");
      throw new Error(
        "Validation failed: " +
          validatedInput.error.errors.map((e) => e.message).join(", ")
      );
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1)
      .execute();
    if (existingUser.length > 0) {
      await logAction(user.id, "ERROR", "users", "User already exists", {
        endpoint: "user server action",
      });
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(validatedInput.data.password);
    const newUser = await db
      .insert(usersTable)
      .values({
        name: validatedInput.data.name,
        email: validatedInput.data.email,
        role: validatedInput.data.role,
        password: hashedPassword,
      })
      .returning();

    await logAction(
      user.id,
      "CREATE",
      "users",
      `User:${newUser[0].name} Created`,
      { resourceId: newUser[0].id }
    );
    return { success: true, message: "User Created" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(data: UpdateUser) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }
    // Input validation
    if (!data) {
      throw new Error(`no data received!`);
    }
    const validatedInput = updateUserSchema.safeParse(data);
    if (!validatedInput.success) {
      await logAction(user.id, "ERROR", "users", "Invalid input provided");
      throw new Error(
        "Validation failed: " +
          validatedInput.error.errors.map((e) => e.message).join(", ")
      );
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1)
      .execute();
    if (existingUser.length > 0) {
      await logAction(user.id, "ERROR", "users", "User already exists", {
        endpoint: "user server action",
      });
      throw new Error("User already exists");
    }

    const newUser = await db
      .update(usersTable)
      .set({
        name: validatedInput.data.name,
        email: validatedInput.data.email,
        role: validatedInput.data.role,
      })
      .where(eq(usersTable.id, validatedInput.data.id))
      .returning();

    await logAction(
      user.id,
      "CREATE",
      "users",
      `User:${newUser[0].name} Created`,
      { resourceId: newUser[0].id }
    );
    return { success: true, message: "User Created" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function bulkDeleteUser(data: GetUsers[]) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }

    // Input validation
    if (!data) {
      throw new Error(`no data received!`);
    }

    await Promise.all(
      data.map((row) => db.delete(usersTable).where(eq(usersTable.id, row.id)))
    );

    await logAction(user.id, "DELETE", "users", "Selected Users deleted");
    return { success: true, message: "Selected User deleted" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }

    // Input validation
    if (!id) {
      throw new Error(`no id received!`);
    }

    await db.delete(usersTable).where(eq(usersTable.id, id));

    await logAction(user.id, "DELETE", "users", "Users deleted");
    return { success: true, message: "User deleted" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserImage(data: FormData) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error(`Not Authorized!!`);
    }

    // Input validation
    if (!data) {
      throw new Error(`no data received!`);
    }

    const uploadedImage = await updateUserImageFile(data);
    await db.update(usersTable).set({
      avatarUrl: uploadedImage.file.url,
    });
    await logAction(user.id, "UPDATE", "files", "Image Profile Updated");
    return { success: true, message: "Image Profile Updated" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw error;
    }
  }
}

//? Fetcher
export async function getUsers() {
  //session validation
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error(`Not Authorized!!`);
  }
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      avatarUrl: usersTable.avatarUrl,
      isActive: sessionTable.expiresAt,
      date: usersTable.createdAt,
    })
    .from(usersTable)
    .leftJoin(sessionTable, eq(usersTable.id, sessionTable.userId))
    .execute();
  return users;
}

export type GetUsers = Awaited<ReturnType<typeof getUsers>>[number];
