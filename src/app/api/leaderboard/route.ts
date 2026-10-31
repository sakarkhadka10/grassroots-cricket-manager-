import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getLeaderboard } from "@/lib/cricket/leaderboard";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leaderboard = await getLeaderboard();

    return NextResponse.json({
      total: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);

    return NextResponse.json({ error: "Unable to load leaderboard" }, { status: 500 });
  }
}
