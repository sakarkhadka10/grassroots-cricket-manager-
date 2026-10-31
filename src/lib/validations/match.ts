import { z } from "zod";

const performanceSchema = z.object({
  playerId: z.uuid(),
  teamId: z.uuid(),
  runs: z.number().int().nonnegative(),
  wickets: z.number().int().nonnegative(),
});

export const createMatchSchema = z
  .object({
    requestId: z.uuid(),
    teamAId: z.uuid(),
    teamBId: z.uuid(),
    winnerId: z.uuid().nullable(),
    teamAScore: z.number().int().nonnegative(),
    teamBScore: z.number().int().nonnegative(),
    performances: z.array(performanceSchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (data.teamAId === data.teamBId) {
      ctx.addIssue({
        code: "custom",
        path: ["teamBId"],
        message: "A team cannot play against itself.",
      });
    }

    if (data.winnerId !== null && data.winnerId !== data.teamAId && data.winnerId !== data.teamBId) {
      ctx.addIssue({
        code: "custom",
        path: ["winnerId"],
        message: "Winner must be one of the two teams.",
      });
    }

    const expectedWinner =
      data.teamAScore > data.teamBScore ? data.teamAId : data.teamBScore > data.teamAScore ? data.teamBId : null;

    if (data.winnerId !== expectedWinner) {
      ctx.addIssue({
        code: "custom",
        path: ["winnerId"],
        message: "Winner must agree with the match scores.",
      });
    }

    const seen = new Set<string>();

    for (const [index, performance] of data.performances.entries()) {
      if (performance.teamId !== data.teamAId && performance.teamId !== data.teamBId) {
        ctx.addIssue({
          code: "custom",
          path: ["performances", index, "teamId"],
          message: "Player must represent a participating team.",
        });
      }

      if (seen.has(performance.playerId)) {
        ctx.addIssue({
          code: "custom",
          path: ["performances", index, "playerId"],
          message: "A player can appear only once per match.",
        });
      }

      seen.add(performance.playerId);
    }
  });

export type CreateMatchInput = z.infer<typeof createMatchSchema>;
