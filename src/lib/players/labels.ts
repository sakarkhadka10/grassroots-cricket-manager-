import type { Player } from "@/db/schema";
import { playerRoles } from "@/lib/validations/player";

export const playerRoleLabels: Record<(typeof playerRoles)[number], string> = {
  BATSMAN: "Batsman",
  BOWLER: "Bowler",
  ALL_ROUNDER: "All-rounder",
  WICKETKEEPER: "Wicketkeeper",
};

export function formatBasePrice(value: string | number) {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function playerImpactScore(player: Pick<Player, "totalRuns" | "totalWickets" | "matchesPlayed">) {
  if (player.matchesPlayed === 0) {
    return 0;
  }
  return Math.round((player.totalRuns + player.totalWickets * 25) / player.matchesPlayed);
}
