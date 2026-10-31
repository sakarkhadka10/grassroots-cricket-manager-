"use server";

import { revalidatePath } from "next/cache";

import { getAdmin } from "@/lib/auth/require-admin";
import { recordMatch } from "@/lib/matches/record-match";
import { createMatchSchema } from "@/lib/validations/match";

export type MatchActionState = {
  success: boolean;
  message: string;
};

const errorMessages: Record<string, string> = {
  DUPLICATE_MATCH: "This match was already recorded.",
  INVALID_TEAMS: "Select two different teams that exist in the database.",
  INVALID_PLAYERS: "One or more selected players were not found.",
  UNKNOWN: "Unable to record match.",
};

export async function createMatchAction(
  _previousState: MatchActionState,
  formData: FormData,
): Promise<MatchActionState> {
  const admin = await getAdmin();

  if (admin.status !== 200) {
    return {
      success: false,
      message: "You do not have permission to record matches.",
    };
  }

  let payload: unknown;

  try {
    payload = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return {
      success: false,
      message: "Invalid match submission.",
    };
  }

  const parsed = createMatchSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check team scores, winner, and player performances.",
    };
  }

  const result = await recordMatch(parsed.data);

  if (!result.ok) {
    return {
      success: false,
      message: errorMessages[result.code] ?? errorMessages.UNKNOWN,
    };
  }

  revalidatePath("/dashboard/matches");
  revalidatePath("/dashboard/players");
  revalidatePath("/dashboard/leaderboard");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "",
  };
}
