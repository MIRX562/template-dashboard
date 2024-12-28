"use server";
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { User } from "@/db/schemas/types";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from "@/lib/auth";
import { hashPassword, verifyPasswordHash } from "@/lib/password";
import { eq } from "drizzle-orm";

export async function register(data: User) {
  try {
    // Input validation
    if (!data) {
      throw new Error("Error message");
    }

    // Example database operation
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1)
      .execute();
    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    // Your database operation here
    const { name, email, password } = data;
    const hashedPassword = await hashPassword(password);
    const user = await db
      .insert(usersTable)
      .values({ name, email, password: hashedPassword })
      .returning();

    if (user.length === 0) {
      throw new Error("User registration failed");
    }

    return { success: true, message: "Success message" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unexpected error occurred" };
    }
  }
}

export async function login(email: string, password: string) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const passwordMatched = verifyPasswordHash(user[0].password, password);

    if (user.length === 0 || !passwordMatched) {
      throw new Error("Invalid username or password");
    }

    const token = generateSessionToken();
    const session = await createSession(token, user[0].id);
    await setSessionTokenCookie(token, session.expiresAt);

    return { success: true, message: "Logged In!" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unexpected error occurred" };
    }
  }
}

export async function logout() {
  const { session } = await getCurrentSession();

  if (session !== null) {
    await invalidateSession(session.id);
  }

  await deleteSessionTokenCookie();
}
