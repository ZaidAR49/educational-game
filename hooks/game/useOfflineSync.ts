"use client"

import { useState, useEffect } from "react"
import { updatePlayerAction } from "@/lib/actions/plays.actions"

type SyncPayload = {
  playId: string
  playerId: string | null
  playerName: string
  isDemo: boolean
}

/**
 * Registers online/offline listeners and runs a background sync queue worker
 * that flushes locally-queued score updates whenever connectivity is restored.
 *
 * Returns:
 *   - `isOffline`: whether the browser is currently offline
 *   - `syncProgress`: call this after every answer/skip to persist progress
 */
export function useOfflineSync({ playId, playerId, playerName, isDemo }: SyncPayload) {
  const [isOffline, setIsOffline] = useState(false)

  // Online/offline indicators + background queue flusher
  useEffect(() => {
    setIsOffline(typeof navigator !== "undefined" ? !navigator.onLine : false)

    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    const flushQueue = async () => {
      if (!navigator.onLine) return

      const queueStr = localStorage.getItem("eduplay_sync_queue")
      if (!queueStr) return

      try {
        const queue = JSON.parse(queueStr)
        if (queue.length === 0) return

        // Deduplicate: keep only the latest payload per player
        const latestPayloads = new Map<string, any>()
        for (const item of queue) {
          latestPayloads.set(item.playerId, item)
        }

        const remainingQueue: any[] = []

        for (const [pId, payload] of latestPayloads.entries()) {
          try {
            await updatePlayerAction(pId, {
              totalScore: payload.score,
              totalCorrectAnswers: payload.correctAnswers,
              totalWrongAnswers: payload.wrongAnswers,
              isFinished: payload.isFinished,
              completedAt: payload.isFinished ? new Date() : undefined,
            })
          } catch (e: any) {
            if (e?.message?.includes("Unauthorized")) {
              console.warn("Discarding sync payload due to unauthorized error:", payload);
            } else {
              remainingQueue.push(payload)
            }
          }
        }

        if (remainingQueue.length > 0) {
          localStorage.setItem("eduplay_sync_queue", JSON.stringify(remainingQueue))
        } else {
          localStorage.removeItem("eduplay_sync_queue")
        }
      } catch (e) {
        console.error("Failed to parse sync queue", e)
      }
    }

    window.addEventListener("online", flushQueue)
    const interval = setInterval(flushQueue, 5000)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("online", flushQueue)
      clearInterval(interval)
    }
  }, [])

  /**
   * Persists score to localStorage immediately, and tries to sync to the DB.
   * On failure (offline or network error) queues the payload for background retry.
   *
   * Bug #13 Fix: accepts `scenarioIndex` as a parameter to avoid stale closures.
   */
  const syncProgress = async (
    newScore: number,
    newCorrect: number,
    newWrong: number,
    finished: boolean,
    scenarioIndex: number
  ) => {
    if (isDemo) return
    if (!playerId) return

    localStorage.setItem(
      `eduplay_session_${playId}`,
      JSON.stringify({
        playerId,
        playerName,
        score: newScore,
        correctAnswers: newCorrect,
        wrongAnswers: newWrong,
        currentScenarioIndex: scenarioIndex,
        isFinished: finished,
      })
    )

    const syncPayload = { playerId, score: newScore, correctAnswers: newCorrect, wrongAnswers: newWrong, isFinished: finished }

    try {
      if (!navigator.onLine) throw new Error("Offline")
      await updatePlayerAction(playerId, {
        totalScore: newScore,
        totalCorrectAnswers: newCorrect,
        totalWrongAnswers: newWrong,
        isFinished: finished,
        completedAt: finished ? new Date() : undefined,
      })
    } catch {
      console.warn("Failed to sync progress, queuing for background retry.")
      const queue = JSON.parse(localStorage.getItem("eduplay_sync_queue") || "[]")
      queue.push(syncPayload)
      localStorage.setItem("eduplay_sync_queue", JSON.stringify(queue))
    }
  }

  return { isOffline, syncProgress }
}
