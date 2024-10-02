import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/db/db";
import { getUserById } from "@/db/functions";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./db/functions/two-factor-confirmation";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without Verification
      if (account?.provider !== "credentials") return true;

      // Check if email is verified
      const exsistingUser = await getUserById(user.id as string);

      if (!exsistingUser?.emailVerified) return false;

      // Add 2FA check
      if (exsistingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          exsistingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete 2FA confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      // Fetch exsisting user
      const exsistingUser = await getUserById(token.sub);

      if (!exsistingUser) return token;

      // Bind user role to token
      token.role = exsistingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
