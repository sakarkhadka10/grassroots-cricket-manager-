import { calculateImpactScore } from "@/lib/cricket/impact-score";
import { describe, expect, it } from "vitest";

describe("Cricket Impact Score", () => {
  it("applies the Bowler multiplier and rookie penalty", () => {
    const score = calculateImpactScore({
      role: "BOWLER",
      totalRuns: 0,
      totalWickets: 4,
      matchesPlayed: 0,
    });

    // (4 * 20 * 1.5) - 50 = 70
    expect(score).toBe(70);
  });

  it("applies the Batsman multiplier and veteran bonus", () => {
    const score = calculateImpactScore({
      role: "BATSMAN",
      totalRuns: 500,
      totalWickets: 0,
      matchesPlayed: 25,
    });

    // (500 * 1.2 * 1.3) + 100 = 880
    expect(score).toBe(880);
  });

  it("gives Wicketkeepers a flat bonus without Bowler multiplier", () => {
    const score = calculateImpactScore({
      role: "WICKETKEEPER",
      totalRuns: 200,
      totalWickets: 5,
      matchesPlayed: 10,
    });

    // (200 * 1.2) + (5 * 20) + 30 = 370
    expect(score).toBe(370);
  });

  it("does not apply bonuses at exactly 5 or 20 matches", () => {
    for (const matchesPlayed of [5, 20]) {
      expect(
        calculateImpactScore({
          role: "ALL_ROUNDER",
          totalRuns: 100,
          totalWickets: 3,
          matchesPlayed,
        }),
      ).toBe(180);
    }
  });

  it("rejects negative Total Runs", () => {
    expect(() =>
      calculateImpactScore({
        role: "BATSMAN",
        totalRuns: -10,
        totalWickets: 0,
        matchesPlayed: 10,
      }),
    ).toThrow("Player statistics must be non-negative integers");
  });

  it("allows a negative final score for a rookie with no stats", () => {
    expect(
      calculateImpactScore({
        role: "ALL_ROUNDER",
        totalRuns: 0,
        totalWickets: 0,
        matchesPlayed: 0,
      }),
    ).toBe(-50);
  });
});
