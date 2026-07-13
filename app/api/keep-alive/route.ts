import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  // Protect endpoint — only allow Vercel Cron (or manual calls with the secret)
  const authHeader = req.headers.get("authorization")
  if (
    process.env.CRON_SECRET &&
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

    return NextResponse.json({ 
      success: true, 
      message: "Database pinged successfully. Connection is warm! Pruned stale player records.",
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
