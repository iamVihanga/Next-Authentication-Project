import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `http://localhost:3000/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Please confirm your email",
    html: `
            <h1>Confirm your email</h1>
            <p>Click the link below to confirm your email address.</p>
            <a href="${confirmLink}">Confirm email</a>
        `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password.</p>
            <a href="${resetLink}">Reset password</a>
    `,
  });
}
