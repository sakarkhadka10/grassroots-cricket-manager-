import { z } from "zod";

export const userRoles = ["USER", "ADMIN"] as const;
export type UserRole = (typeof userRoles)[number];

export const userRoleLabels: Record<UserRole, string> = {
  USER: "User",
  ADMIN: "Admin",
};

// register schema
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase().max(255),
  password: z.string().min(8).max(72),
  role: z.enum(userRoles),
});

// login schema
export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
