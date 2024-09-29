"use server";
import { type RegisterSchemaT, RegisterSchema } from "@/schemas/index";

export async function register(values: RegisterSchemaT) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields !" };
  }

  return { success: "Email send !" };
}
