"use server";

import { db } from "@/db/db";
import { getUserByEmail } from "@/db/functions";
import { getPasswordResetTokenByToken } from "@/db/functions/password-reset-token";
import { type NewPasswordSchemaT, NewPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";

export async function newPassword(
  values: NewPasswordSchemaT,
  token: string | null
) {
  if (!token) {
    return { error: "Missing token" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exists!" };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  // Delete used token from database
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated successfully!" };
}
