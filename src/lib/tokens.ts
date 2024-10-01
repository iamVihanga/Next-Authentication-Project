import { db } from "@/db/db";
import { getVerificationTokenByEmail } from "@/db/functions/verification-token";
import { getPasswordResetTokenByEmail } from "@/db/functions/password-reset-token";
import { v4 as uuid } from "uuid";

export async function generateVerificationToken(email: string) {
  const token = uuid();

  // Expire token in 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  // Delete existing token if it exists
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
}

export async function generatePasswordResetToken(email: string) {
  const token = uuid();

  // Expire token in 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
}
