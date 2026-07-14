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

export async function joinPlayAction(playId: string, playerName: string, existingPlayerId?: string | null) {
  // Check if play is actually live
  const play = await playsService.getPlayById(playId);
  if (!play || play.status !== "live") {
    throw new Error("This game session is not currently live.");
  }

  const { db } = await import("@/lib/db");
  const { players } = await import("@/lib/db/schema");
  const { eq, and, sql } = await import("drizzle-orm");

  // SECURITY: Prevent Bot Flooding / Enforce Capacity
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(players)
    .where(eq(players.classroomPlayId, playId));

  if (count >= 200) {
    throw new Error("عذراً، الجلسة ممتلئة (الحد الأقصى 200 لاعب).");
  }

  const existingPlayer = await db.query.players.findFirst({
    where: and(
      eq(players.classroomPlayId, playId),
      eq(players.name, playerName)
    )
  });

  if (existingPlayer) {
    if (existingPlayerId && existingPlayer.id === existingPlayerId) {
      // Reconnect existing player
      const { cookies } = await import("next/headers");
      (await cookies()).set('eduplay_student_id', existingPlayer.id, {
        httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24
      });
      return existingPlayer;
    } else {
      throw new Error("هذا الاسم مستخدم بالفعل في هذه الجلسة، يرجى اختيار اسم آخر.");
    }
  }

  const newPlayer = await playsService.createPlayer({
    classroomPlayId: playId,
    name: playerName,
  }).catch((err: any) => {
    // Bug #4 Fix: unique-constraint violation means concurrent join with same name
    const isUniqueViolation =
      err?.code === '23505' || // PostgreSQL unique_violation
      err?.message?.includes('unique') ||
      err?.message?.includes('duplicate');
    if (isUniqueViolation) {
      throw new Error("هذا الاسم مستخدم بالفعل في هذه الجلسة، يرجى اختيار اسم آخر.");
    }
    throw err;
  });

  if (newPlayer) {
    const { cookies } = await import("next/headers");
    (await cookies()).set('eduplay_student_id', newPlayer.id, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24
    });
  }

  // Depending on how players are displayed, you might revalidate the teacher's live view.
  revalidatePath(`/dashboard/games/${play.gameId}/live`);

  const { getPostHogClient } = await import("@/lib/posthog-server");
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: newPlayer?.id || playerName,
    event: "game_joined",
    properties: { play_id: playId, game_id: play.gameId },
  });
  await posthog.shutdown();

  return newPlayer;
}

/**
 * Updates a player's score or status.
 */
export async function updatePlayerAction(playerId: string, playerData: Partial<NewPlayer>) {
  // SECURITY: Prevent IDOR (Student Cheating) by verifying HttpOnly cookie
  const { cookies } = await import("next/headers");
  const securePlayerId = (await cookies()).get('eduplay_student_id')?.value;
  
  if (!securePlayerId || securePlayerId !== playerId) {
    throw new Error("Unauthorized: Invalid student session.");
  }

  const updatedPlayer = await playsService.updatePlayer(playerId, playerData);
  
  // Revalidate the teacher's live view
  const play = await playsService.getPlayById(updatedPlayer.classroomPlayId);
  if (play) {
    revalidatePath(`/dashboard/games/${play.gameId}/live`);
    
    if (playerData.isFinished) {
      const { getPostHogClient } = await import("@/lib/posthog-server");
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: playerId,
        event: "game_completed",
        properties: { play_id: updatedPlayer.classroomPlayId, game_id: play.gameId, score: updatedPlayer.totalScore },
      });
      await posthog.shutdown();
    }
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
    with: {
      organization: true,
    }
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

  // Bug #11 Fix: strip `isCorrect` from choices before sending to the student client
  // Answer validation must happen server-side — students should not see correct answers in the payload
  const sanitizedScenarios = gameScenarios.map(scenario => ({
    ...scenario,
    choices: scenario.choices.map(({ isCorrect, ...rest }) => rest),
  }));

  return {
    game,
    play: livePlay,
    scenarios: sanitizedScenarios,
  };
}

/**
 * Fetches a game for a teacher to preview without an active session.
 */
export async function getGameForPreviewAction(gameId: string) {
  const { db } = await import("@/lib/db");
  const { games, scenarios } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
    with: {
      organization: true,
    }
  });

  if (!game) {
    return { error: "لم يتم العثور على اللعبة." };
  }

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
    game: { ...game, isDemo: true }, // Force isDemo true for previews
    play: { id: "preview-play" },
    scenarios: gameScenarios,
  };
}
