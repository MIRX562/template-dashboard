"use server";
import {
  passwordResetSchema,
  ResetPassword,
  UpdateProfile,
  updateProfileSchema,
  usersTable,
} from "@/db/schemas";
import { logAction } from "./log-action";
import { db } from "@/db";
import { getCurrentSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPasswordHash } from "@/lib/password";

export async function updateProfile(data: UpdateProfile) {
  try {
    //session validation
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error("Not Authorized!!");
    }

    // Input validation
    if (!data) {
      throw new Error("no data received!");
    }
    const validatedData = updateProfileSchema.safeParse(data);
    if (!validatedData.success) {
      await logAction(null, "ERROR", "users", "Invalid input provided");
      throw new Error("Invalid Input!");
    }

    // existing record check
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, data.id))
      .limit(1)
      .execute();
    if (!existingUser) {
      await logAction(user.id, "ERROR", "users", "User not exists");
      throw new Error("User not exists");
    }

    // database operation
    await db.update(usersTable).set({
      name: validatedData.data?.name,
      email: validatedData.data?.email,
    });

    await logAction(user.id, "UPDATE", "users", "User Profile Updated!", {
      resourceId: validatedData.data!.id,
    });
    return { success: true, message: "User Profile Updated!" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    } else {
      console.error(error);
      throw error;
    }
  }
}

export async function resetPassword(data: ResetPassword) {
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
    const validatedInput = passwordResetSchema.safeParse(data);
    if (!validatedInput.success) {
      await logAction(user.id, "ERROR", "users", "Invalid input provided");
      throw new Error(
        "Validation failed: " +
          validatedInput.error.errors.map((e) => e.message).join(", ")
      );
    }

    // password match check
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, validatedInput.data.id))
      .limit(1)
      .execute();
    const passwordMatched = await verifyPasswordHash(
      existingUser[0].password,
      validatedInput.data.current_pass
    );

    if (!passwordMatched) {
      await logAction(user.id, "ERROR", "users", "Wrong password!");
      throw new Error("Wrong Password");
    }

    // database operation
    const newPassword = await hashPassword(data.new_pass);
    await db
      .update(usersTable)
      .set({
        password: newPassword,
      })
      .where(eq(usersTable.id, validatedInput.data.id));

    await logAction(user.id, "UPDATE", "users", "Password Updated", {
      resourceId: user.id,
    });
    return { success: true, message: "Password Updated" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    } else {
      console.error(error);
      throw error;
    }
  }
}
