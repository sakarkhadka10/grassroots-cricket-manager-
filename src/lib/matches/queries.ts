import "server-only";

import { count, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/db";
import { matches, teamsTable } from "@/db/schema";

const teamA = alias(teamsTable, "team_a");
const teamB = alias(teamsTable, "team_b");
const winnerTeam = alias(teamsTable, "winner_team");

export async function getMatchSummaries() {
  return db
    .select({
      id: matches.id,
      playedAt: matches.playedAt,
      teamAName: teamA.name,
      teamBName: teamB.name,
      teamAScore: matches.teamAScore,
      teamBScore: matches.teamBScore,
      winnerName: winnerTeam.name,
    })
    .from(matches)
    .innerJoin(teamA, eq(matches.teamAId, teamA.id))
    .innerJoin(teamB, eq(matches.teamBId, teamB.id))
    .leftJoin(winnerTeam, eq(matches.winnerId, winnerTeam.id))
    .orderBy(desc(matches.playedAt));
}

export type MatchSummary = Awaited<ReturnType<typeof getMatchSummaries>>[number];

export async function getMatchCount() {
  const [{ value }] = await db.select({ value: count() }).from(matches);
  return value;
}
