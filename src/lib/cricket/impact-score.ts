import { ImpactPlayer } from "@/types/player.types";

export function calculateImpactScore(player: ImpactPlayer): number {
  const { role, totalRuns, totalWickets, matchesPlayed } = player;

  const values = [totalRuns, totalWickets, matchesPlayed];

  if (values.some((value) => !Number.isSafeInteger(value) || value < 0)) {
    throw new Error("Player statistics must be non-negative integers");
  }

  let runsScore = totalRuns * 1.2;
  let wicketsScore = totalWickets * 20;

  switch (role) {
    case "BATSMAN":
      runsScore *= 1.3;
      break;

    case "BOWLER":
      wicketsScore *= 1.5;
      break;

    case "ALL_ROUNDER":
    case "WICKETKEEPER":
      break;

    default:
      throw new Error("Invalid player role");
  }

  let impactScore = runsScore + wicketsScore;

  if (role === "WICKETKEEPER") {
    impactScore += 30;
  }

  // Experience: under 5 matches (−50), over 20 (+100); exactly 5 or 20 unchanged.
  if (matchesPlayed < 5) {
    impactScore -= 50;
  } else if (matchesPlayed > 20) {
    impactScore += 100;
  }

  return Math.round((impactScore + Number.EPSILON) * 100) / 100;
}

export function formatImpactScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(2);
}
