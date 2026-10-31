import "server-only";

import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { usersTable } from "@/db/schema";

export async function getAdmin() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { status: 401 as const };
  }
  const [user] = await db
    .select({
      id: usersTable.id,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

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
