"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { teamsTable } from "@/db/schema";
import { getAdmin } from "@/lib/auth/require-admin";
import { teamSchema } from "@/lib/validations/team";

export type TeamActionState = {
  success: boolean;
  message: string;
};

export async function createTeamAction(_previousState: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const admin = await getAdmin();

  if (admin.status !== 200) {
    return {
      success: false,
      message: "You do not have permission to add teams.",
    };
  }

  const parsed = teamSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a team name between 2 and 100 characters.",
    };
  }

  try {
    const [team] = await db.insert(teamsTable).values(parsed.data).onConflictDoNothing().returning();

    if (!team) {
      return {
        success: false,
        message: "A team with this name already exists.",
      };
    }

    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard/matches");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "",
    };
  } catch {
    return {
      success: false,
      message: "Unable to create team.",
    };
  }
}
