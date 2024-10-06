"use server";

import { currentRole } from "@/lib/auth";

export async function admin() {
  const role = await currentRole();

  if (role !== "ADMIN") {
    return { error: "Forbidden !" };
  }

  return { success: "Allowed !" };
}
