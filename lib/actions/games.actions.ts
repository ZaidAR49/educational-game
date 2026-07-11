"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
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
  revalidateTag(`games-${user.id}`);
  revalidateTag(`dashboard-${user.id}`);
  return newGame;
}

/**
 * Fetches all games for the logged-in user.
 */
export async function getMyGamesAction() {
  const user = await requireAuth();
  
  const getCachedGames = unstable_cache(
    async () => gamesService.getGamesByUserId(user.id),
    [`games-${user.id}`],
    { tags: [`games-${user.id}`] }
  );

  return getCachedGames();
}

/**
 * Deletes a game, ensuring the user owns it.
 */
export async function deleteGameAction(gameId: string) {
  const user = await requireAuth();
  await verifyGameOwnership(gameId, user.id);

  await gamesService.deleteGame(gameId);
  revalidatePath("/dashboard/games");
  revalidateTag(`games-${user.id}`);
  revalidateTag(`dashboard-${user.id}`);
  revalidateTag(`game-${gameId}`);
  revalidateTag(`game-full-${gameId}`);
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
  revalidateTag(`games-${user.id}`);
  revalidateTag(`dashboard-${user.id}`);
  revalidateTag(`game-${gameId}`);
  revalidateTag(`game-full-${gameId}`);
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
  revalidateTag(`games-${user.id}`);
  revalidateTag(`dashboard-${user.id}`);
  revalidateTag(`game-${gameId}`);
  revalidateTag(`game-full-${gameId}`);
  revalidateTag(`sessions-${user.id}`); // Invalidate sessions list
}
