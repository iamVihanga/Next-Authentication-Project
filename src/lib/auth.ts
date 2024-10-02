/**
 * This library is used to perform all the authentication related operations.
 * In Server Components (Instead of using client-side hooks)
 */
import { auth } from "@/auth";

export async function currentUser() {
  const session = await auth();

  return session?.user;
}
