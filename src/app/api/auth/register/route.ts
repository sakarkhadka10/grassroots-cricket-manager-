import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { signIn } from "@/auth";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/auth/validation";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid registration details",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { name, email, password, role } = parsed.data;

    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        passwordHash,
        role,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
      });

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      return NextResponse.json(
        { message: "Account created", user, warning: "Signed up but automatic sign-in failed. Please log in." },
        { status: 201 },
      );
    }

    return NextResponse.json({ message: "Account created", user }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    console.error("Registration failed:", error);

    return NextResponse.json({ error: "Unable to create account" }, { status: 500 });
  }
}
