import "server-only";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { homePathForRole } from "@/lib/auth/routes";

export async function getCurrentUser() {
  await connection();
  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: session.user.role,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect(homePathForRole(user.role));
  }

  return user;
}

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();

  if (user) {
    redirect(homePathForRole(user.role));
  }
}
