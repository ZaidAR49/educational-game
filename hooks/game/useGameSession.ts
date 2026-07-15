"use client"

import { useEffect } from "react"
import nicknames from "@/data/nicknames.json"
import { joinPlayAction } from "@/lib/actions/plays.actions"

export const generateRandomName = () => {
  const noun = nicknames.nouns[Math.floor(Math.random() * nicknames.nouns.length)]
  const adj = nicknames.adjectives[Math.floor(Math.random() * nicknames.adjectives.length)]
  return `${noun} ${adj}`
}

type SessionCallbacks = {
  playId: string
  isDemo: boolean
  startTransition: (fn: () => Promise<void>) => void
  setPlayerId: (id: string) => void
  setPlayerName: (name: string) => void
  setScore: (score: number) => void
  setCorrectAnswers: (n: number) => void
  setWrongAnswers: (n: number) => void
  setCurrentScenarioIndex: (n: number) => void
  setScreen: (screen: "join" | "start" | "game" | "result") => void
}

/**
 * Restores a saved game session from localStorage on mount, or seeds a
 * random player name when no session exists. Skips all DB calls in demo mode.
 */
export function useGameSession({
  playId,
  isDemo,
  startTransition,
  setPlayerId,
  setPlayerName,
  setScore,
  setCorrectAnswers,
  setWrongAnswers,
  setCurrentScenarioIndex,
  setScreen,
}: SessionCallbacks) {
  useEffect(() => {
    const savedSessionStr = localStorage.getItem(`eduplay_session_${playId}`)

    if (savedSessionStr && !isDemo) {
      try {
        const saved = JSON.parse(savedSessionStr)
        if (saved.playerId && saved.playerName) {
          startTransition(async () => {
            try {
              const player = await joinPlayAction(playId, saved.playerName, saved.playerId)

              setPlayerId(player.id)
              setPlayerName(player.name)

              const restoredScore = saved.score ?? player.totalScore
              const restoredCorrect = saved.correctAnswers ?? player.totalCorrectAnswers
              const restoredWrong = saved.wrongAnswers ?? player.totalWrongAnswers
              const restoredIndex =
                saved.currentScenarioIndex ??
                player.totalCorrectAnswers + player.totalWrongAnswers
              const restoredFinished = saved.isFinished || player.isFinished

              setScore(restoredScore)
              setCorrectAnswers(restoredCorrect)
              setWrongAnswers(restoredWrong)
              setCurrentScenarioIndex(restoredIndex)
              setScreen(restoredFinished ? "result" : "game")
            } catch (err) {
              console.error("Failed to auto-reconnect:", err)
              localStorage.removeItem(`eduplay_session_${playId}`)

              const savedName = localStorage.getItem("drugGamePlayerName")
              setPlayerName(savedName ?? generateRandomName())
            }
          })
          return
        }
      } catch (e) {
        console.error(e)
      }
    }

    const savedName = localStorage.getItem("drugGamePlayerName")
    setPlayerName(savedName ?? generateRandomName())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playId, isDemo])
}
