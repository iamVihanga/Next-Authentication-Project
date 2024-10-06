"use server";

import bcrypt from "bcryptjs";
import { SettingsSchemaT } from "@/schemas";
import { db } from "@/db/db";
import { getUserByEmail, getUserById } from "@/db/functions";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function settings(values: SettingsSchemaT) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized !" };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "User not found !" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // Check email availability
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(verificationToken.token, values.email);

    return { success: "Verification email sent !" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) return { error: "Password is incorrect!" };

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Settings updated !" };
}
