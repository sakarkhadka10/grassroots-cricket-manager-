import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export type TeamInput = z.infer<typeof teamSchema>;
