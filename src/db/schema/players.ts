import { check, integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { playerRoleEnum } from "./enums";
import { sql } from "drizzle-orm";

export const playersTable = pgTable(
  "players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    role: playerRoleEnum("role").notNull(),
    basePrice: numeric("base_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    matchesPlayed: integer("matches_played").notNull().default(0),
    totalRuns: integer("total_runs").notNull().default(0),
    totalWickets: integer("total_wickets").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("base_price_positive", sql`${table.basePrice} >= 0`),
    check("matches_played_positive", sql`${table.matchesPlayed} >= 0`),
    check("total_runs_positive", sql`${table.totalRuns} >= 0`),
    check("total_wickets_positive", sql`${table.totalWickets} >= 0`),
  ],
);

export type Player = typeof playersTable.$inferSelect;
export type NewPlayer = typeof playersTable.$inferInsert;
