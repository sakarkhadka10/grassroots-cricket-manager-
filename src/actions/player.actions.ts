"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { playersTable } from "@/db/schema";
import { getAdmin } from "@/lib/auth/require-admin";
import { playerSchema } from "@/lib/validations/player";

const playerIdSchema = z.string().uuid();

export type PlayerActionState = {
  success: boolean;
  message: string;
};

export async function createPlayerAction(
  _previousState: PlayerActionState,
  formData: FormData,
): Promise<PlayerActionState> {
  const admin = await getAdmin();

  if (admin.status !== 200) {
    return {
      success: false,
      message: "You do not have permission to add players.",
    };
  }

  const parsed = playerSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    basePrice: formData.get("basePrice"),
    matchesPlayed: formData.get("matchesPlayed"),
    totalRuns: formData.get("totalRuns"),
    totalWickets: formData.get("totalWickets"),
  });

  if (!parsed.success) {
    const negativeRuns = parsed.data === undefined && Number(formData.get("totalRuns")) < 0;

    return {
      success: false,
      message: negativeRuns ? "Total runs cannot be negative." : "Please enter valid player details.",
    };
  }

  try {
    await db.insert(playersTable).values({
      ...parsed.data,
      basePrice: parsed.data.basePrice.toFixed(2),
    });
    revalidatePath("/dashboard/players");
    revalidatePath("/dashboard");
    return {
      success: true,
      message: "",
    };
  } catch {
    return {
      success: false,
      message: "Unable to create player.",
    };
  }
}

export async function updatePlayerAction(
  playerId: string,
  _previousState: PlayerActionState,
  formData: FormData,
): Promise<PlayerActionState> {
  const admin = await getAdmin();

  if (admin.status !== 200) {
    return {
      success: false,
      message: "You do not have permission to update players.",
    };
  }

  const idParsed = playerIdSchema.safeParse(playerId);
  if (!idParsed.success) {
    return { success: false, message: "Invalid player reference." };
  }

  const parsed = playerSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    basePrice: formData.get("basePrice"),
    matchesPlayed: formData.get("matchesPlayed"),
    totalRuns: formData.get("totalRuns"),
    totalWickets: formData.get("totalWickets"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter valid player details.",
    };
  }

  try {
    const [player] = await db
      .update(playersTable)
      .set({
        ...parsed.data,
        basePrice: parsed.data.basePrice.toFixed(2),
      })
      .where(eq(playersTable.id, idParsed.data))
      .returning({ id: playersTable.id });

    if (!player) {
      return { success: false, message: "Player not found." };
    }

    revalidatePath("/dashboard/players");
    revalidatePath(`/dashboard/players/${idParsed.data}`);
    revalidatePath("/dashboard");
    return { success: true, message: "" };
  } catch {
    return { success: false, message: "Unable to update player." };
  }
}

export async function deletePlayerAction(playerId: string): Promise<PlayerActionState> {
  const admin = await getAdmin();

  if (admin.status !== 200) {
    return {
      success: false,
      message: "You do not have permission to delete players.",
    };
  }

  const idParsed = playerIdSchema.safeParse(playerId);
  if (!idParsed.success) {
    return { success: false, message: "Invalid player reference." };
  }

  try {
    const [deleted] = await db
      .delete(playersTable)
      .where(eq(playersTable.id, idParsed.data))
      .returning({ id: playersTable.id });

    if (!deleted) {
      return { success: false, message: "Player not found." };
    }

    revalidatePath("/dashboard/players");
    revalidatePath("/dashboard");
    return { success: true, message: "Player removed from roster." };
  } catch {
    return { success: false, message: "Unable to delete player." };
  }
}
