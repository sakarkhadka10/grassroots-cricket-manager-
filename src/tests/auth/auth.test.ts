import { beforeAll, describe, expect, it } from "vitest";

import { registerSchema, loginSchema } from "../../lib/auth/validation";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-that-is-at-least-32-characters-long";
});

describe("Registration validation", () => {
  it("rejects passwords shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "1234",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes email addresses", () => {
    const result = registerSchema.parse({
      name: "Test User",
      email: "TEST@EXAMPLE.COM",
      password: "StrongPass123",
      role: "USER",
    });

    expect(result.email).toBe("test@example.com");
  });

  it("accepts USER and ADMIN roles", () => {
    expect(
      registerSchema.safeParse({
        name: "Test User",
        email: "a@example.com",
        password: "StrongPass123",
        role: "ADMIN",
      }).success,
    ).toBe(true);
  });

  it("rejects malformed login emails", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });
});
