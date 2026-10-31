import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/db";
import { matches } from "@/db/schema";
import { getAdmin } from "@/lib/auth/require-admin";
import { recordMatch } from "@/lib/matches/record-match";
import { createMatchSchema } from "@/lib/validations/match";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await db
    .select()
    .from(matches)
    .orderBy(sql`${matches.playedAt} DESC`);

  return NextResponse.json({ matches: results });
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

  const parsed = createMatchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid match data",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const result = await recordMatch(parsed.data);

  if (!result.ok) {
    if (result.code === "DUPLICATE_MATCH") {
      return NextResponse.json({ error: "Match has already been recorded" }, { status: 409 });
    }

    if (result.code === "INVALID_TEAMS" || result.code === "INVALID_PLAYERS") {
      return NextResponse.json({ error: "Invalid team or player selection" }, { status: 400 });
    }

    console.error("Match recording failed");

    return NextResponse.json({ error: "Unable to record match" }, { status: 500 });
  }

  return NextResponse.json(
    {
      message: "Match recorded successfully",
      match: result.match,
    },
    { status: 201 },
  );
}
