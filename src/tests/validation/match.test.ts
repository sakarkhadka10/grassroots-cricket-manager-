import { describe, expect, it } from "vitest";
import { createMatchSchema } from "@/lib/validations/match";

const teamAId = "11111111-1111-4111-8111-111111111111";
const teamBId = "22222222-2222-4222-8222-222222222222";
const playerId = "33333333-3333-4333-8333-333333333333";

const validMatch = {
  requestId: "44444444-4444-4444-8444-444444444444",
  teamAId,
  teamBId,
  winnerId: teamAId,
  teamAScore: 180,
  teamBScore: 150,
  performances: [{ playerId, teamId: teamAId, runs: 65, wickets: 2 }],
};

describe("Match validation", () => {
  it("accepts a valid match", () => {
    expect(createMatchSchema.safeParse(validMatch).success).toBe(true);
  });

  it("rejects a team playing itself", () => {
    expect(
      createMatchSchema.safeParse({
        ...validMatch,
        teamBId: teamAId,
      }).success,
    ).toBe(false);
  });

  it("rejects negative player runs", () => {
    expect(
      createMatchSchema.safeParse({
        ...validMatch,
        performances: [{ ...validMatch.performances[0], runs: -10 }],
      }).success,
    ).toBe(false);
  });

  it("rejects duplicate player performances", () => {
    expect(
      createMatchSchema.safeParse({
        ...validMatch,
        performances: [validMatch.performances[0], validMatch.performances[0]],
      }).success,
    ).toBe(false);
  });

  it("rejects a winner inconsistent with the score", () => {
    expect(
      createMatchSchema.safeParse({
        ...validMatch,
        winnerId: teamBId,
      }).success,
    ).toBe(false);
  });
});
