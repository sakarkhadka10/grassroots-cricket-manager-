import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const playerRoleEnum = pgEnum("player_role", ["BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKETKEEPER"]);
