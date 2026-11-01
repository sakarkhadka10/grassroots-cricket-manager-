import { describe, expect, it } from "vitest";
import { playerSchema } from "@/lib/validations/player";
const validPlayer = {
  name: "Test Player",
  role: "BATSMAN",
  basePrice: 1000,
  matchesPlayed: 10,
  totalRuns: 500,
  totalWickets: 2,
};

describe("Player validation", () => {
  it("accepts valid player details", () => {
    expect(playerSchema.safeParse(validPlayer).success).toBe(true);
  });

  it("rejects negative total runs", () => {
    const result = playerSchema.safeParse({
      ...validPlayer,
      totalRuns: -20,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid player role", () => {
    const result = playerSchema.safeParse({
      ...validPlayer,
      role: "CAPTAIN",
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative base price", () => {
    const result = playerSchema.safeParse({
      ...validPlayer,
      basePrice: -100,
    });

    expect(result.success).toBe(false);
  });

  it("rejects fractional wickets", () => {
    const result = playerSchema.safeParse({
      ...validPlayer,
      totalWickets: 2.5,
    });

    expect(result.success).toBe(false);
  });
});
