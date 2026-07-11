import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, Game, NewGame } from "@/lib/db/schema";

/**
 * Fetch a single game by its ID.
 */
export async function getGameById(id: string): Promise<Game | undefined> {
  const result = await db.select().from(games).where(eq(games.id, id)).limit(1);
  return result[0];
}

/**
 * Fetch a single game by its slug.
 */
export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const result = await db.select().from(games).where(eq(games.slug, slug)).limit(1);
  return result[0];
}

/**
 * Fetch all games belonging to a specific user.
 */
export async function getGamesByUserId(userId: string): Promise<Game[]> {
  return db
    .select()
    .from(games)
    .where(eq(games.ownerId, userId))
    .orderBy(desc(games.createdAt));
}

/**
 * Create a new game.
 */
export async function createGame(gameData: NewGame): Promise<Game> {
  const [newGame] = await db.insert(games).values(gameData).returning();
  return newGame;
}

/**
 * Update an existing game by ID.
 */
export async function updateGame(id: string, gameData: Partial<NewGame>): Promise<Game> {
  const [updatedGame] = await db
    .update(games)
    .set({ ...gameData, updatedAt: new Date() })
    .where(eq(games.id, id))
    .returning();
  
  if (!updatedGame) throw new Error(`Failed to update game with ID ${id}`);
  return updatedGame;
}

/**
 * Delete a game by ID.
 */
export async function deleteGame(id: string): Promise<void> {
  await db.delete(games).where(eq(games.id, id));
}
