import { UserRole } from "@prisma/client";
import * as z from "zod";

// Settings Schema
export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required !",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required !",
      path: ["password"],
    }
  );

export type SettingsSchemaT = z.infer<typeof SettingsSchema>;

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export type LoginSchemaT = z.infer<typeof LoginSchema>;

// Register Schema
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export type RegisterSchemaT = z.infer<typeof RegisterSchema>;

// Reset schema
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export type ResetSchemaT = z.infer<typeof ResetSchema>;

// New Password schema
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export type NewPasswordSchemaT = z.infer<typeof NewPasswordSchema>;

// https://youtu.be/1MTyCvS05V4?t=25819
