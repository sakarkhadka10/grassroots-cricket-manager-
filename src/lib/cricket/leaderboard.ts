import "server-only";

import { db } from "@/db";
import { playersTable } from "@/db/schema";
import { calculateImpactScore } from "./impact-score";

export async function getLeaderboard() {
  const allPlayers = await db
    .select({
      id: playersTable.id,
      name: playersTable.name,
      role: playersTable.role,
      matchesPlayed: playersTable.matchesPlayed,
      totalRuns: playersTable.totalRuns,
      totalWickets: playersTable.totalWickets,
    })
    .from(playersTable);

  const rankedPlayers = allPlayers
    .map((player) => ({
      ...player,
      impactScore: calculateImpactScore(player),
    }))
    .toSorted(
      (a, b) =>
        b.impactScore - a.impactScore ||
        b.totalRuns - a.totalRuns ||
        b.totalWickets - a.totalWickets ||
        a.name.localeCompare(b.name) ||
        a.id.localeCompare(b.id),
    );

  return rankedPlayers.map((player, index) => ({
    rank: index + 1,
    ...player,
  }));
}

export type LeaderboardPlayer = Awaited<ReturnType<typeof getLeaderboard>>[number];
