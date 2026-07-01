import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),

  email: z.string().trim().email("Invalid email address").toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters"),

  role: z.enum(["student", "teacher"]),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;