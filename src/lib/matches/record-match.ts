import "server-only";

import { eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { matches, playerPerformances, playersTable, teamsTable } from "@/db/schema";
import type { CreateMatchInput } from "@/lib/validations/match";

export type RecordMatchErrorCode = "INVALID_TEAMS" | "INVALID_PLAYERS" | "DUPLICATE_MATCH" | "UNKNOWN";

export type RecordMatchResult =
  | { ok: true; match: typeof matches.$inferSelect }
  | { ok: false; code: RecordMatchErrorCode };

export async function recordMatch(data: CreateMatchInput): Promise<RecordMatchResult> {
  try {
    const match = await db.transaction(async (tx) => {
      const participatingTeams = await tx
        .select({ id: teamsTable.id })
        .from(teamsTable)
        .where(inArray(teamsTable.id, [data.teamAId, data.teamBId]));

      if (participatingTeams.length !== 2) {
        throw new Error("INVALID_TEAMS");
      }

      const playerIds = data.performances.map((performance) => performance.playerId);

      const existingPlayers = await tx
        .select({ id: playersTable.id })
        .from(playersTable)
        .where(inArray(playersTable.id, playerIds));

      if (existingPlayers.length !== playerIds.length) {
        throw new Error("INVALID_PLAYERS");
      }

      const [createdMatch] = await tx
        .insert(matches)
        .values({
          requestId: data.requestId,
          teamAId: data.teamAId,
          teamBId: data.teamBId,
          winnerId: data.winnerId,
          teamAScore: data.teamAScore,
          teamBScore: data.teamBScore,
        })
        .onConflictDoNothing({
          target: matches.requestId,
        })
        .returning();

      if (!createdMatch) {
        throw new Error("DUPLICATE_MATCH");
      }

      await tx.insert(playerPerformances).values(
        data.performances.map((performance) => ({
          matchId: createdMatch.id,
          ...performance,
        })),
      );

      for (const performance of data.performances) {
        await tx
          .update(playersTable)
          .set({
            matchesPlayed: sql`${playersTable.matchesPlayed} + 1`,
            totalRuns: sql`${playersTable.totalRuns} + ${performance.runs}`,
            totalWickets: sql`${playersTable.totalWickets} + ${performance.wickets}`,
          })
          .where(eq(playersTable.id, performance.playerId));
      }

      return createdMatch;
    });

    return { ok: true, match };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "DUPLICATE_MATCH") {
        return { ok: false, code: "DUPLICATE_MATCH" };
      }
      if (error.message === "INVALID_TEAMS") {
        return { ok: false, code: "INVALID_TEAMS" };
      }
      if (error.message === "INVALID_PLAYERS") {
        return { ok: false, code: "INVALID_PLAYERS" };
      }
    }

    return { ok: false, code: "UNKNOWN" };
  }
}
