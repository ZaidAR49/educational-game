"use server";

import { revalidatePath } from "next/cache";
import * as playsService from "@/lib/services/plays.service";
import { NewClassroomPlay, NewPlayer } from "@/lib/db/schema";
import { requireAuth, verifyGameOwnership } from "./utils";

/**
 * Creates a new classroom play (game session).
 */
export async function createClassroomPlayAction(gameId: string) {
  const user = await requireAuth();
  
  // Assuming a teacher must own the game to start a play for it
  await verifyGameOwnership(gameId, user.id);

  const newPlay = await playsService.createClassroomPlay({
    gameId,
    teacherId: user.id,
    status: "draft",
  });

  revalidatePath(`/dashboard/games/${gameId}`);
  revalidatePath("/dashboard/sessions");
  return newPlay;
}

/**
 * Fetches all plays for the logged-in teacher.
 */
export async function getMyPlaysAction() {
  const user = await requireAuth();
  return playsService.getClassroomPlaysByTeacherId(user.id);
}

/**
 * Updates the status of a classroom play (e.g. to "live" or "closed").
 */
export async function updatePlayStatusAction(playId: string, status: "draft" | "live" | "closed") {
  const user = await requireAuth();
  
  const play = await playsService.getPlayById(playId);
  if (!play) throw new Error("Play not found");
  if (play.teacherId !== user.id) throw new Error("Unauthorized: You do not own this play.");

  const updatedPlay = await playsService.updateClassroomPlayStatus(playId, status);
  revalidatePath(`/dashboard/sessions`);
  revalidatePath(`/dashboard/games/${play.gameId}/live`);
  return updatedPlay;
}

// --- PLAYER ACTIONS (No requireAuth usually, as players are guests) ---

/**
 * Joins a classroom play (creates a new player).
 */
export async function joinPlayAction(playId: string, playerName: string) {
  // Check if play is actually live
  const play = await playsService.getPlayById(playId);
  if (!play || play.status !== "live") {
    throw new Error("This game session is not currently live.");
  }

  const newPlayer = await playsService.createPlayer({
    classroomPlayId: playId,
    name: playerName,
  });

  // Depending on how players are displayed, you might revalidate the teacher's live view.
  revalidatePath(`/dashboard/games/${play.gameId}/live`);
  return newPlayer;
}

/**
 * Updates a player's score or status.
 */
export async function updatePlayerAction(playerId: string, playerData: Partial<NewPlayer>) {
  // In a real app you might want some security token for players
  // so they can only update their own score.
  const updatedPlayer = await playsService.updatePlayer(playerId, playerData);
  
  // Revalidate the teacher's live view
  const play = await playsService.getPlayById(updatedPlayer.classroomPlayId);
  if (play) {
    revalidatePath(`/dashboard/games/${play.gameId}/live`);
  }
  
  return updatedPlayer;
}

/**
 * Fetches the live play and scenarios for a student joining a game.
 * Public endpoint (no auth required).
 */
export async function getLiveGameForStudentAction(gameId: string) {
  const { db } = await import("@/lib/db");
  const { games, scenarios, classroomPlays } = await import("@/lib/db/schema");
  const { eq, and } = await import("drizzle-orm");

  // Get game info
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
  });

  if (!game) {
    return { error: "لم يتم العثور على اللعبة." };
  }

  // Get live play
  const livePlay = await db.query.classroomPlays.findFirst({
    where: and(
      eq(classroomPlays.gameId, gameId),
      eq(classroomPlays.status, "live")
    ),
  });

  if (!livePlay) {
    return { error: "لا توجد جلسة مباشرة نشطة لهذه اللعبة حالياً. يرجى الانتظار حتى يبدأ المعلم الجلسة." };
  }

  // Get scenarios with choices
  const gameScenarios = await db.query.scenarios.findMany({
    where: eq(scenarios.gameId, gameId),
    orderBy: (scenarios, { asc }) => [asc(scenarios.orderIndex)],
    with: {
      choices: {
        orderBy: (choices, { asc }) => [asc(choices.orderIndex)],
      }
    }
  });

  return {
    game,
    play: livePlay,
    scenarios: gameScenarios,
  };
}
