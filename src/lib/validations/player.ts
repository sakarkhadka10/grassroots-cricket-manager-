import { z } from "zod";

export const playerRoles = ["BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKETKEEPER"] as const;

export const playerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.enum(playerRoles),
  basePrice: z.coerce.number<number>().finite().nonnegative().max(9999999999.99),
  matchesPlayed: z.coerce.number<number>().int().nonnegative(),
  totalRuns: z.coerce.number<number>().int().nonnegative(),
  totalWickets: z.coerce.number<number>().int().nonnegative(),
});

export type PlayerInput = z.infer<typeof playerSchema>;
