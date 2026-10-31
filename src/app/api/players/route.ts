import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/db";
import { playersTable } from "@/db/schema";
import { getAdmin } from "@/lib/auth/require-admin";
import { playerSchema } from "@/lib/validations/player";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.select().from(playersTable).orderBy(desc(playersTable.createdAt));

  return NextResponse.json({ players: result });
}

export async function POST(request: Request) {
  const admin = await getAdmin();

  if (admin.status !== 200) {
    return NextResponse.json({ error: admin.status === 401 ? "Unauthorized" : "Forbidden" }, { status: admin.status });
  }

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
    .insert(playersTable)
    .values({
      ...parsed.data,
      basePrice: parsed.data.basePrice.toFixed(2),
    })
    .returning();

  return NextResponse.json({ player }, { status: 201 });
}
