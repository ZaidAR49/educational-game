import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  // Bug #5 Fix: fail-closed — always require CRON_SECRET to be present and match
  const authHeader = req.headers.get("authorization")
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 1. Run a lightweight raw query to keep the database client and pool active
    await db.execute(sql`SELECT 1`)

    // 2. Purge student player records older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { players } = await import("@/lib/db/schema")
    const { lt } = await import("drizzle-orm")
    await db.delete(players).where(lt(players.createdAt, thirtyDaysAgo))

    // 3. Auto-close stale live sessions older than TTL
    const { classroomPlays, games } = await import("@/lib/db/schema")
    const { and, eq, inArray } = await import("drizzle-orm")
    const { config } = await import("@/lib/config")
    const cutoffTime = new Date(Date.now() - config.session.maxLiveDurationMs)

    const stalePlays = await db
      .select({ id: classroomPlays.id, gameId: classroomPlays.gameId })
      .from(classroomPlays)
      .where(
        and(
          eq(classroomPlays.status, "live"),
          sql`COALESCE(${classroomPlays.startedAt}, ${classroomPlays.createdAt}) < ${cutoffTime}`
        )
      )

    if (stalePlays.length > 0) {
      const stalePlayIds = stalePlays.map((p) => p.id)
      const staleGameIds = Array.from(new Set(stalePlays.map((p) => p.gameId)))

      await db
        .update(classroomPlays)
        .set({ status: "closed", endedAt: new Date(), updatedAt: new Date() })
        .where(inArray(classroomPlays.id, stalePlayIds))

      await db
        .update(games)
        .set({ status: "draft", updatedAt: new Date() })
        .where(inArray(games.id, staleGameIds))
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database pinged successfully. Pruned stale player records and closed expired sessions.",
      closedSessionsCount: stalePlays.length,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Database keep alive ping failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to query the database" 
    }, { status: 500 })
  }
}
