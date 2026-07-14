import { eq, desc, count, ilike, and } from "drizzle-orm";
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
 * Fetch the absolute total count of games belonging to a specific user (ignores filters).
 */
export async function getTotalGamesCount(userId: string): Promise<number> {
  const [totalCount] = await db
    .select({ count: count() })
    .from(games)
    .where(eq(games.ownerId, userId));
  return totalCount.count;
}

/**
 * Fetch all games belonging to a specific user, with pagination and filters.
 */
export async function getGamesByUserId(userId: string, page: number = 1, limit: number = 3, search?: string, status?: string) {
  const offset = (page - 1) * limit;

  const conditions = [eq(games.ownerId, userId)];
  
  if (search) {
    conditions.push(ilike(games.title, `%${search}%`));
  }
  
  if (status && (status === 'draft' || status === 'published' || status === 'archived')) {
    conditions.push(eq(games.status, status as any));
  }

  const whereClause = and(...conditions);

  const [totalCount] = await db
    .select({ count: count() })
    .from(games)
    .where(whereClause);

  const data = await db.query.games.findMany({
    where: whereClause,
    orderBy: desc(games.createdAt),
    limit: limit,
    offset: offset,
    columns: {
      id: true,
      title: true,
      description: true,
      icon: true,
      status: true,
      playCount: true,
      createdAt: true,
    },
    with: {
      organization: {
        columns: {
          name: true
        }
      }
    }
  });

  return {
    data,
    total: totalCount.count
  };
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

/**
 * Fetch the number of games associated with a specific organization.
 */
export async function getGameCountByOrganizationId(organizationId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(games)
    .where(eq(games.organizationId, organizationId));
  return result.count;
}
