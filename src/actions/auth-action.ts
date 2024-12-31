"use server";

import { db } from "@/db";
import { RegisterUser, usersTable } from "@/db/schemas";
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
import { logAction } from "./log-action";
import { redirect } from "next/navigation";

export async function register(data: RegisterUser) {
  try {
    if (!data) {
      throw new Error("Error message");
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1)
      .execute();

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    const { name, email, password } = data;
    const hashedPassword = await hashPassword(password);
    const user = await db
      .insert(usersTable)
      .values({ name, email, password: hashedPassword })
      .returning();

    if (user.length === 0) {
      throw new Error("User registration failed");
    }

    // Log the successful registration
    await logAction(
      user[0].id,
      "CREATE",
      "users",
      "User successfully registered",
      { resourceId: user[0].id }
    );

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unexpected error occurred" };
    }
  }
  // redirect("/auth/login");
}

export async function login(email: string, password: string) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (
      user.length === 0 ||
      !(await verifyPasswordHash(user[0].password, password))
    ) {
      throw new Error("Invalid username or password");
    }

    const token = generateSessionToken();
    const session = await createSession(token, user[0].id);
    await setSessionTokenCookie(token, session.expiresAt);

    // Log the successful login
    await logAction(
      user[0].id,
      "LOGIN",
      "sessions",
      `User:${user[0].name} logged in`,
      { ip: "TODO" } // Replace with actual IP if available
    );

    // return { success: true, message: "Logged In!" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unexpected error occurred" };
    }
  }
  // redirect("/dashboard");
}

export async function logout() {
  const { session, user } = await getCurrentSession();

  if (session !== null) {
    await invalidateSession(session.id);

    // Log the successful logout
    if (user) {
      await logAction(user.id, "LOGOUT", "sessions", "User logged out", null);
    }
  }

  await deleteSessionTokenCookie();
  redirect("/auth/login");
}
