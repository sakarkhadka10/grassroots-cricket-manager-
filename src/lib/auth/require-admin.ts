import "server-only";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { usersTable } from "@/db/schema";

export async function getAdmin() {
  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) {
    return { status: 401 as const };
  }

  let user:
    | {
        id: string;
        role: (typeof usersTable.$inferSelect)["role"];
      }
    | undefined;

  if (session.user.id) {
    [user] = await db
      .select({
        id: usersTable.id,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, session.user.id))
      .limit(1);
  }

  if (!user && session.user.email) {
    [user] = await db
      .select({
        id: usersTable.id,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.email, session.user.email))
      .limit(1);
  }

  if (!user) {
    return { status: 401 as const };
  }

  if (user.role !== "ADMIN") {
    return { status: 403 as const };
  }

  return {
    status: 200 as const,
    user,
  };
}
