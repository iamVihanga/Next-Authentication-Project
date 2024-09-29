"use server";
import { type LoginSchemaT, LoginSchema } from "@/schemas/index";

export async function login(values: LoginSchemaT) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields !" };
  }

  return { success: "Email send !" };
}
