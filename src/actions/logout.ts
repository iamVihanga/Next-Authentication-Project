"use server";
import { signOut } from "@/auth";

export async function logout() {
  // In here you can perform any server-side actions

  await signOut();
}
