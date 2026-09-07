import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { classroomPlays, games } from "@/lib/db/schema"
import { and, eq, sql, inArray } from "drizzle-orm"
import { config } from "@/lib/config"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cutoffTime = new Date(Date.now() - config.session.maxLiveDurationMs)

    // Find all expired live plays
    const expiredPlays = await db
      .select({ id: classroomPlays.id, gameId: classroomPlays.gameId })
      .from(classroomPlays)
      .where(
        and(
          eq(classroomPlays.status, "live"),
          sql`COALESCE(${classroomPlays.startedAt}, ${classroomPlays.createdAt}) < ${cutoffTime}`
        )
      )

    if (expiredPlays.length > 0) {
      const expiredIds = expiredPlays.map((p) => p.id)
      const expiredGameIds = Array.from(new Set(expiredPlays.map((p) => p.gameId)))

      await db
        .update(classroomPlays)
        .set({ status: "closed", endedAt: new Date(), updatedAt: new Date() })
        .where(inArray(classroomPlays.id, expiredIds))

      await db
        .update(games)
        .set({ status: "draft", updatedAt: new Date() })
        .where(inArray(games.id, expiredGameIds))
    }

    return NextResponse.json({
      success: true,
      cleanedCount: expiredPlays.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Session cleanup failed:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cleanup sessions" },
      { status: 500 }
    )
  }
}
