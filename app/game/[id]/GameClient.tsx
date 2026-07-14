"use client"

import { useState, useTransition } from "react"
import uiContent from "@/data/ui-content-general.json"
import { shareGameResult } from "@/lib/game"
import { joinPlayAction } from "@/lib/actions/plays.actions"
import { toast } from "sonner"
import { JoinScreen } from "./components/JoinScreen"
import { StartScreen } from "./components/StartScreen"
import { GameplayScreen } from "./components/GameplayScreen"
import { ResultScreen } from "./components/ResultScreen"
import type { Game, ClassroomPlay } from "@/lib/db/schema"
import { useGameSession, generateRandomName } from "./hooks/useGameSession"
import { useOfflineSync } from "./hooks/useOfflineSync"
import { useGameFlow } from "./hooks/useGameFlow"

type GameScreen = "join" | "start" | "game" | "result"

type SanitizedChoice = {
  id: string
  scenarioId: string
  orderIndex: number
  text: string
  icon: string | null
  feedbackTitle: string | null
  feedbackMessage: string | null
  feedbackTip: string | null
  points: number
  createdAt: Date
  isCorrect?: boolean
}

type SanitizedScenario = {
  id: string
  gameId: string
  orderIndex: number
  icon: string | null
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  choices: SanitizedChoice[]
}

export default function GameClient({
  game,
  play,
  scenarios,
}: {
  game: Game & { isDemo?: boolean }
  play: Pick<ClassroomPlay, "id"> | { id: string }
  scenarios: SanitizedScenario[]
}) {
  const [screen, setScreen] = useState<GameScreen>(game.isDemo ? "start" : "join")
  const [playerName, setPlayerName] = useState("")
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const { app, gameStart, gamePlay, results } = uiContent

  // Offline sync hook
  const { isOffline, syncProgress } = useOfflineSync({
    playId: play.id,
    playerId,
    playerName,
    isDemo: game.isDemo ?? false,
  })

  // Game flow hook
  const {
    currentScenarioIndex,
    setCurrentScenarioIndex,
    score,
    setScore,
    correctAnswers,
    setCorrectAnswers,
    wrongAnswers,
    setWrongAnswers,
    hasAnswered,
    selectedChoiceIndex,
    isSkipped,
    showFeedback,
    confetti,
    currentScenario,
    maxScore,
    resultData,
    selectedChoice,
    startGame,
    selectChoice,
    skipQuestion,
    nextScenario,
    trackEvent,
  } = useGameFlow({
    game,
    playId: play.id,
    scenarios,
    playerId,
    playerName,
    syncProgress,
    setScreen,
  })

  // Session restore hook
  useGameSession({
    playId: play.id,
    isDemo: game.isDemo ?? false,
    startTransition,
    setPlayerId,
    setPlayerName,
    setScore,
    setCorrectAnswers,
    setWrongAnswers,
    setCurrentScenarioIndex,
    setScreen,
  })

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return

    startTransition(async () => {
      try {
        if (game.isDemo) {
          setPlayerId("demo-player-id")
          localStorage.setItem("drugGamePlayerName", playerName.trim())
          trackEvent("game_joined", { game_id: game.id, is_demo: true })
          setScreen("start")
          return
        }

        const savedSessionStr = localStorage.getItem(`eduplay_session_${play.id}`)
        let savedPlayerId: string | null = null
        if (savedSessionStr) {
          try {
            const data = JSON.parse(savedSessionStr)
            if (data.playerName === playerName.trim()) savedPlayerId = data.playerId
          } catch (e) { console.error(e) }
        }

        const player = await joinPlayAction(play.id, playerName.trim(), savedPlayerId)
        setPlayerId(player.id)
        localStorage.setItem("drugGamePlayerName", playerName.trim())
        localStorage.setItem(
          `eduplay_session_${play.id}`,
          JSON.stringify({
            playerId: player.id,
            playerName: playerName.trim(),
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            currentScenarioIndex: 0,
            isFinished: false,
          })
        )
        trackEvent("game_joined", { game_id: game.id, is_demo: false })
        setScreen("start")
      } catch {
        toast.error("هذا الاسم مستخدم بالفعل في هذه الجلسة، يرجى اختيار اسم آخر.")
      }
    })
  }

  const handleShare = () => {
    const gameUrl = typeof window !== "undefined" ? window.location.href : ""
    trackEvent("game_result_shared", { game_id: game.id, score })
    void shareGameResult(score, gameUrl)
  }

  const activeFeedback = isSkipped
    ? gamePlay.skipFeedback
    : selectedChoice
    ? {
        title:
          selectedChoice.feedbackTitle ||
          ((selectedChoice.isCorrect ?? selectedChoice.points > 0) ? "إجابة صحيحة!" : "إجابة خاطئة!"),
        message: selectedChoice.feedbackMessage || "",
        tip: selectedChoice.feedbackTip || "",
      }
    : null

  const feedbackIsCorrect =
    !isSkipped && (selectedChoice ? (selectedChoice.isCorrect ?? selectedChoice.points > 0) : false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        {isOffline && (
          <div className="bg-amber-100 border border-amber-200 text-amber-800 text-sm font-bold text-center py-3 px-4 rounded-2xl mb-4 shadow-sm animate-in fade-in slide-in-from-top-4 flex items-center justify-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>أنت غير متصل بالإنترنت. سيتم حفظ تقدمك تلقائياً.</span>
          </div>
        )}

        {screen === "join" && (
          <JoinScreen
            game={game}
            playerName={playerName}
            setPlayerName={setPlayerName}
            isPending={isPending}
            onJoin={handleJoin}
            onGenerateRandomName={() => setPlayerName(generateRandomName())}
          />
        )}

        {screen === "start" && (
          <StartScreen game={game} playerName={playerName} gameStart={gameStart} onStartGame={startGame} />
        )}

        {screen === "game" && currentScenario && (
          <GameplayScreen
            playerName={playerName}
            score={score}
            currentScenarioIndex={currentScenarioIndex}
            totalScenarios={scenarios.length}
            currentScenario={currentScenario}
            gamePlay={gamePlay}
            hasAnswered={hasAnswered}
            selectedChoiceIndex={selectedChoiceIndex}
            showFeedback={showFeedback}
            isSkipped={isSkipped}
            activeFeedback={activeFeedback}
            feedbackIsCorrect={feedbackIsCorrect}
            onSelectChoice={selectChoice}
            onSkipQuestion={skipQuestion}
            onNextScenario={nextScenario}
          />
        )}

        {screen === "result" && (
          <ResultScreen
            playerName={playerName}
            score={score}
            maxScore={maxScore}
            game={game}
            results={results}
            resultData={resultData}
            confetti={confetti}
            onShare={handleShare}
            onRetry={startGame}
          />
        )}
      </div>

      <style jsx global>{`
        @keyframes confetti {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti 3s linear forwards; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease; }
      `}</style>
    </div>
  )
}
