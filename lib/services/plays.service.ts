import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { classroomPlays, players, ClassroomPlay, NewClassroomPlay, Player, NewPlayer, playStatusEnum } from "@/lib/db/schema";

// --- CLASSROOM PLAYS ---

/**
 * Create a new classroom play session (starts in draft status usually).
 */
export async function createClassroomPlay(playData: NewClassroomPlay): Promise<ClassroomPlay> {
  const [newPlay] = await db.insert(classroomPlays).values(playData).returning();
  return newPlay;
}

/**
 * Fetch a single classroom play by ID.
 */
export async function getPlayById(id: string): Promise<ClassroomPlay | undefined> {
  const result = await db.select().from(classroomPlays).where(eq(classroomPlays.id, id)).limit(1);
  return result[0];
}

/**
 * Fetch all classroom plays for a specific teacher.
 */
export async function getClassroomPlaysByTeacherId(teacherId: string): Promise<ClassroomPlay[]> {
  return db
    .select()
    .from(classroomPlays)
    .where(eq(classroomPlays.teacherId, teacherId))
    .orderBy(desc(classroomPlays.createdAt));
}

/**
 * Get the currently live play for a specific game (there should only be one due to DB constraints).
 */
export async function getLivePlayByGameId(gameId: string): Promise<ClassroomPlay | undefined> {
  const result = await db
    .select()
    .from(classroomPlays)
    .where(and(eq(classroomPlays.gameId, gameId), eq(classroomPlays.status, "live")))
    .limit(1);
  return result[0];
}

/**
 * Update the status of a classroom play (e.g., from 'draft' to 'live', or 'live' to 'closed').
 * Will automatically set startedAt or endedAt based on the new status.
 */
export async function updateClassroomPlayStatus(
  id: string, 
  status: "draft" | "live" | "closed"
): Promise<ClassroomPlay> {
  const updateData: Partial<NewClassroomPlay> = { status, updatedAt: new Date() };
  
  if (status === "live") {
    updateData.startedAt = new Date();
  } else if (status === "closed") {
    updateData.endedAt = new Date();
  }

  const [updatedPlay] = await db
    .update(classroomPlays)
    .set(updateData)
    .where(eq(classroomPlays.id, id))
    .returning();

  if (!updatedPlay) throw new Error(`Failed to update play with ID ${id}`);
  return updatedPlay;
}

// --- PLAYERS ---

/**
 * Add a new player to a classroom play.
 */
export async function createPlayer(playerData: NewPlayer): Promise<Player> {
  const [newPlayer] = await db.insert(players).values(playerData).returning();
  return newPlayer;
}

/**
 * Fetch all players in a specific classroom play.
 */
export async function getPlayersByPlayId(playId: string): Promise<Player[]> {
  return db
    .select()
    .from(players)
    .where(eq(players.classroomPlayId, playId))
    .orderBy(desc(players.totalScore));
}

/**
 * Update a player's score or finish status.
 */
export async function updatePlayer(id: string, playerData: Partial<NewPlayer>): Promise<Player> {
  const [updatedPlayer] = await db
    .update(players)
    .set(playerData)
    .where(eq(players.id, id))
    .returning();
    
  if (!updatedPlayer) throw new Error(`Failed to update player with ID ${id}`);
  return updatedPlayer;
}
