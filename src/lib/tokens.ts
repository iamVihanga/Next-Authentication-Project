import { db } from "@/db/db";
import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { getVerificationTokenByEmail } from "@/db/functions/verification-token";
import { getPasswordResetTokenByEmail } from "@/db/functions/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/db/functions/two-factor-token";

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

export async function generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  // Set token expires in 5 minutes
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  // Delete existing token if it exists
  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
}
