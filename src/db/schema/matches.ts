import { integer, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { teamsTable } from "./teams";
import { playersTable } from "./players";

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Prevent accidental duplicate submissions
  requestId: uuid("request_id").notNull().unique(),

  teamAId: uuid("team_a_id")
    .notNull()
    .references(() => teamsTable.id),

  teamBId: uuid("team_b_id")
    .notNull()
    .references(() => teamsTable.id),

  winnerId: uuid("winner_id").references(() => teamsTable.id),

  teamAScore: integer("team_a_score").notNull(),
  teamBScore: integer("team_b_score").notNull(),

  playedAt: timestamp("played_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const playerPerformances = pgTable(
  "player_performances",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playersTable.id),

    teamId: uuid("team_id")
      .notNull()
      .references(() => teamsTable.id),

    runs: integer("runs").notNull(),
    wickets: integer("wickets").notNull(),
  },
  (table) => [uniqueIndex("unique_match_player").on(table.matchId, table.playerId)],
);
