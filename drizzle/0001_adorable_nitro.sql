CREATE TYPE "public"."player_role" AS ENUM('BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKETKEEPER');--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" "player_role" NOT NULL,
	"base_price" numeric(10, 2) NOT NULL,
	"matches_played" integer DEFAULT 0 NOT NULL,
	"total_runs" integer DEFAULT 0 NOT NULL,
	"total_wickets" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "base_price_positive" CHECK ("players"."base_price" >= 0),
	CONSTRAINT "matches_played_positive" CHECK ("players"."matches_played" >= 0),
	CONSTRAINT "total_runs_positive" CHECK ("players"."total_runs" >= 0),
	CONSTRAINT "total_wickets_positive" CHECK ("players"."total_wickets" >= 0)
);
