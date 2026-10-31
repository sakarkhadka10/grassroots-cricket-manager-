import type { UserRole } from "@/lib/auth/validation";

export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";
export const ADMIN_HOME_PATH = "/dashboard";
export const USER_HOME_PATH = "/app";

export function homePathForRole(role: UserRole) {
  return role === "ADMIN" ? ADMIN_HOME_PATH : USER_HOME_PATH;
}
