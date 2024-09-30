"use server";
import { type RegisterSchemaT, RegisterSchema } from "@/schemas/index";
import bcrypt from "bcryptjs";
import { db } from "@/db/db";
import { getUserByEmail } from "@/db/functions";

export async function register(values: RegisterSchemaT) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields !" };
  }

  const { email, password, name } = validatedFields.data;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check email already exists
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already exists !" };
  }

  await db.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  // TODO: Send verification token email

  return { success: "User Created !" };
}
