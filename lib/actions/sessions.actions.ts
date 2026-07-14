"use server";

import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import { getPostHogClient } from "@/lib/posthog-server";
import { eq, inArray, desc, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, classroomPlays, players } from "@/lib/db/schema";
import { requireAuth } from "./utils";

const getCachedSessions = (userId: string) => unstable_cache(
  async () => {
    const plays = await db
      .select({
        id: classroomPlays.id,
        date: classroomPlays.createdAt,
        gameName: games.title,
        playersCount: sql<number>`COUNT(${players.id})::int`,
      })
      .from(classroomPlays)
      .innerJoin(games, eq(classroomPlays.gameId, games.id))
      .leftJoin(players, eq(classroomPlays.id, players.classroomPlayId))
      .where(eq(classroomPlays.teacherId, userId))
      .groupBy(classroomPlays.id, classroomPlays.createdAt, games.title)
      .orderBy(desc(classroomPlays.createdAt));

    return plays.map((p) => ({
      id: p.id,
      gameName: p.gameName,
      date: p.date.toISOString(),
      playersCount: p.playersCount || 0,
    }));
  },
  [`sessions-${userId}`],
  { tags: [`sessions-${userId}`] }
)();

/**
 * Fetches all sessions for the logged-in user.
 */
export async function getMySessionsAction() {
  const user = await requireAuth();
  return getCachedSessions(user.id);
}

const getCachedSessionDetails = (sessionId: string, userId: string) => unstable_cache(
  async () => {
    const playResult = await db
      .select({
        id: classroomPlays.id,
        date: classroomPlays.createdAt,
        gameName: games.title,
        teacherId: classroomPlays.teacherId,
      })
      .from(classroomPlays)
      .innerJoin(games, eq(classroomPlays.gameId, games.id))
      .where(eq(classroomPlays.id, sessionId))
      .limit(1);

    const sessionData = playResult[0];
    if (!sessionData || sessionData.teacherId !== userId) {
      return null;
    }

    const sessionPlayers = await db
      .select()
      .from(players)
      .where(eq(players.classroomPlayId, sessionId))
      .orderBy(desc(players.totalScore));

    return {
      session: {
        id: sessionData.id,
        gameName: sessionData.gameName,
        date: sessionData.date.toISOString(),
      },
      players: sessionPlayers.map((p) => {
        let duration = p.durationSeconds || 0;
        if (!p.isFinished && !duration && p.startedAt) {
          duration = Math.floor((new Date().getTime() - p.startedAt.getTime()) / 1000);
        }
        
        return {
          id: p.id,
          name: p.name,
          totalScore: p.totalScore,
          correctAnswers: p.totalCorrectAnswers,
          wrongAnswers: p.totalWrongAnswers,
          isFinished: p.isFinished,
          durationSeconds: duration,
        };
      }),
    };
  },
  [`session-${sessionId}`],
  { tags: [`session-${sessionId}`] }
)();

/**
 * Fetches a single session and its players.
 */
export async function getSessionDetailsAction(sessionId: string) {
  const user = await requireAuth();
  return getCachedSessionDetails(sessionId, user.id);
}

/**
 * Deletes multiple sessions for the user.
 */
export async function deleteSessionsAction(sessionIds: string[]) {
  const user = await requireAuth();

  if (!sessionIds.length) return;

  await db
    .delete(classroomPlays)
    .where(
      and(
        inArray(classroomPlays.id, sessionIds),
        eq(classroomPlays.teacherId, user.id)
      )
    );

  updateTag(`sessions-${user.id}`);
  for (const id of sessionIds) {
    updateTag(`session-${id}`);
  }
  revalidatePath("/dashboard/sessions");

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: user.id,
    event: "sessions_deleted",
    properties: { count: sessionIds.length },
  });
  await posthog.shutdown();
}

/**
 * Fetches the currently live session and its players for a given game.
 * Used for the real-time Live Session dashboard.
 */
export async function getLiveSessionDataAction(gameId: string) {
  const user = await requireAuth();

  const playResult = await db
    .select({
      id: classroomPlays.id,
      date: classroomPlays.createdAt,
      gameName: games.title,
    })
    .from(classroomPlays)
    .innerJoin(games, eq(classroomPlays.gameId, games.id))
    .where(
      and(
        eq(classroomPlays.gameId, gameId),
        eq(classroomPlays.teacherId, user.id),
        eq(classroomPlays.status, 'live')
      )
    )
    .limit(1);

  const sessionData = playResult[0];
  if (!sessionData) {
    return null;
  }

  const sessionPlayers = await db
    .select()
    .from(players)
    .where(eq(players.classroomPlayId, sessionData.id))
    .orderBy(desc(players.totalScore));

  return {
    session: {
      id: sessionData.id,
      gameName: sessionData.gameName,
    },
    players: sessionPlayers.map((p) => {
      let duration = p.durationSeconds || 0;
      if (!p.isFinished && !duration && p.startedAt) {
        duration = Math.floor((new Date().getTime() - p.startedAt.getTime()) / 1000);
      }
      
      return {
        id: p.id,
        name: p.name,
        score: p.totalScore, // Map to score for the Live component
        correct: p.totalCorrectAnswers,
        wrong: p.totalWrongAnswers,
        isConnected: !p.isFinished, // Using isFinished to determine if they are currently active
        durationSeconds: duration,
      };
    }),
  };
}
