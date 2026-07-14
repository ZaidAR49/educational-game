"use server";

import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import { getPostHogClient } from "@/lib/posthog-server";
import * as gamesService from "@/lib/services/games.service";
import { NewGame } from "@/lib/db/schema";
import { requireAuth, verifyGameOwnership } from "./utils";

/**
 * Creates a new game for the logged-in user.
 */
export async function createGameAction(gameData: Omit<NewGame, "ownerId">) {
  const user = await requireAuth();

  const newGame = await gamesService.createGame({
    ...gameData,
    ownerId: user.id,
  });

  revalidatePath("/dashboard/games");
  updateTag(`games-${user.id}`);
  updateTag(`dashboard-${user.id}`);

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: user.id,
    event: "game_created",
    properties: { game_id: newGame?.id || 'unknown' },
  });
  await posthog.shutdown();

  return newGame;
}

/**
 * Fetches all games for the logged-in user with pagination and filters.
 */
export async function getMyGamesAction(page: number = 1, search?: string, status?: string) {
  const user = await requireAuth();
  return gamesService.getGamesByUserId(user.id, page, 3, search, status);
}

/**
 * Fetches the absolute total count of games for the logged-in user.
 */
export async function getTotalGamesCountAction() {
  const user = await requireAuth();
  return gamesService.getTotalGamesCount(user.id);
}

/**
 * Deletes a game, ensuring the user owns it.
 */
export async function deleteGameAction(gameId: string) {
  const user = await requireAuth();
  await verifyGameOwnership(gameId, user.id);

  await gamesService.deleteGame(gameId);
  revalidatePath("/dashboard/games");
  updateTag(`games-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  updateTag(`game-${gameId}`);
  updateTag(`game-full-${gameId}`);

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: user.id,
    event: "game_deleted",
    properties: { game_id: gameId },
  });
  await posthog.shutdown();
}

/**
 * Updates a game, ensuring the user owns it.
 */
export async function updateGameAction(gameId: string, gameData: Partial<NewGame>) {
  const user = await requireAuth();
  await verifyGameOwnership(gameId, user.id);

  const updatedGame = await gamesService.updateGame(gameId, gameData);
  revalidatePath("/dashboard/games");
  revalidatePath(`/dashboard/games/${gameId}`); 
  updateTag(`games-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  updateTag(`game-${gameId}`);
  updateTag(`game-full-${gameId}`);
  return updatedGame;
}

/**
 * Toggles a game's publish status AND manages its session (classroomPlays).
 */
export async function toggleGamePublishStatusAction(gameId: string, publish: boolean) {
  const user = await requireAuth();
  await verifyGameOwnership(gameId, user.id);

  const newStatus = publish ? 'published' : 'draft';

  const { db } = await import("@/lib/db");
  const { games, classroomPlays } = await import("@/lib/db/schema");
  const { eq, and } = await import("drizzle-orm");

  await db.transaction(async (tx) => {
    // Update game status
    await tx.update(games).set({ status: newStatus }).where(eq(games.id, gameId));

    if (publish) {
      // Create a new session
      await tx.insert(classroomPlays).values({
        gameId,
        teacherId: user.id,
        status: 'live',
        startedAt: new Date(),
      });
    } else {
      // Close active sessions for this game
      await tx.update(classroomPlays)
        .set({ status: 'closed', endedAt: new Date() })
        .where(
          and(
            eq(classroomPlays.gameId, gameId),
            eq(classroomPlays.status, 'live')
          )
        );
    }
  });

  revalidatePath("/dashboard/games");
  updateTag(`games-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  updateTag(`game-${gameId}`);
  updateTag(`game-full-${gameId}`);
  updateTag(`sessions-${user.id}`); // Invalidate sessions list

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: user.id,
    event: publish ? "game_published" : "game_session_closed",
    properties: { game_id: gameId },
  });
  await posthog.shutdown();
}
