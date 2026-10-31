export type PlayerRole = "BATSMAN" | "BOWLER" | "ALL_ROUNDER" | "WICKETKEEPER";

export type ImpactPlayer = {
  role: PlayerRole;
  totalRuns: number;
  totalWickets: number;
  matchesPlayed: number;
};
