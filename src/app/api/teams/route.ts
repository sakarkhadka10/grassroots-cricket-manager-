import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/db";
import { teamsTable } from "@/db/schema";
import { getAdmin } from "@/lib/auth/require-admin";
import { teamSchema } from "@/lib/validations/team";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.select().from(teamsTable).orderBy(asc(teamsTable.name));

  return NextResponse.json({ teams: result });
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
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = teamSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid team name" }, { status: 400 });
  }

  const [team] = await db.insert(teamsTable).values(parsed.data).onConflictDoNothing().returning();

  if (!team) {
    return NextResponse.json({ error: "Team already exists" }, { status: 409 });
  }

  return NextResponse.json({ team }, { status: 201 });
}
