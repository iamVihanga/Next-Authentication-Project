import * as z from "zod";

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
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
