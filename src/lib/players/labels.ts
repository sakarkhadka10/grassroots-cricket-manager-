import { calculateImpactScore } from "@/lib/cricket/impact-score";
import { playerRoles } from "@/lib/validations/player";
import type { ImpactPlayer } from "@/types/player.types";

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

export function playerImpactScore(player: ImpactPlayer) {
  return calculateImpactScore(player);
}
