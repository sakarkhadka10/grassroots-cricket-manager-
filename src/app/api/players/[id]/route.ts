import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/db";
import { playersTable } from "@/db/schema";
import { getAdmin } from "@/lib/auth/require-admin";
import { playerSchema } from "@/lib/validations/player";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const [player] = await db.select().from(playersTable).where(eq(playersTable.id, id)).limit(1);

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json({ player });
}

export async function PUT(request: Request, context: Context) {
  const admin = await getAdmin();

  if (admin.status !== 200) {
    return NextResponse.json({ error: admin.status === 401 ? "Unauthorized" : "Forbidden" }, { status: admin.status });
  }

  const { id } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = playerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid player data",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const [player] = await db
    .update(playersTable)
    .set({
      ...parsed.data,
      basePrice: parsed.data.basePrice.toFixed(2),
    })
    .where(eq(playersTable.id, id))
    .returning();

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json({ player });
}

export async function DELETE(_request: Request, context: Context) {
  const admin = await getAdmin();

  if (admin.status !== 200) {
    return NextResponse.json({ error: admin.status === 401 ? "Unauthorized" : "Forbidden" }, { status: admin.status });
  }

  const { id } = await context.params;

  const [deleted] = await db.delete(playersTable).where(eq(playersTable.id, id)).returning({ id: playersTable.id });

  if (!deleted) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Player deleted" });
}
