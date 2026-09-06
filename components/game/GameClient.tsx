"use client"

import { useState, useTransition, useMemo, useEffect } from "react"

import Link from "next/link"
import { Home } from "lucide-react"
import uiContent from "@/data/ui-content-general.json"
import { joinPlayAction } from "@/lib/actions/plays.actions"
import { toast } from "sonner"
import { JoinScreen } from "./JoinScreen"
import { StartScreen } from "./StartScreen"
import { GameplayScreen } from "./GameplayScreen"
import { ResultScreen } from "./ResultScreen"
import { LanguageDropdown } from "@/components/shared/LanguageDropdown"
import type { Game, ClassroomPlay } from "@/lib/db/schema"
import { useGameSession, generateRandomName } from "@/hooks/game/useGameSession"
import { useOfflineSync } from "@/hooks/game/useOfflineSync"
import { useGameFlow } from "@/hooks/game/useGameFlow"
import { getDemoGame, getDemoScenarios } from "@/data/demo-game"
import { useLocale } from "@/lib/i18n/LanguageContext"

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
  const { locale, messages: t } = useLocale()
  const [screen, setScreen] = useState<GameScreen>(game.isDemo ? "start" : "join")
  const [playerName, setPlayerName] = useState("")
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const { gameStart, gamePlay, results } = uiContent

  // Localized demo game title and description
  const activeGame = useMemo(() => {
    if (!game.isDemo) return game
    return getDemoGame(locale)
  }, [game, locale])

  // Localized demo scenarios
  const activeScenarios = useMemo(() => {
    if (!game.isDemo) return scenarios
    return getDemoScenarios(locale)
  }, [game.isDemo, scenarios, locale])

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
    game: activeGame,
    playId: play.id,
    scenarios: activeScenarios,
    playerId,
    playerName,
    syncProgress,
    setScreen,
  })

  // Session restore hook
  useGameSession({
    playId: play.id,
    isDemo: game.isDemo ?? false,
    locale,
    startTransition,
    setPlayerId,
    setPlayerName,
    setScore,
    setCorrectAnswers,
    setWrongAnswers,
    setCurrentScenarioIndex,
    setScreen,
  })

  // Keep playerName language in sync with current locale
  useEffect(() => {
    if (!playerName) return
    const hasArabic = /[\u0600-\u06FF]/.test(playerName)
    if (locale === "en" && hasArabic) {
      const newName = generateRandomName("en")
      setPlayerName(newName)
      localStorage.setItem("drugGamePlayerName", newName)
    } else if (locale === "ar" && !hasArabic) {
      const newName = generateRandomName("ar")
      setPlayerName(newName)
      localStorage.setItem("drugGamePlayerName", newName)
    }
  }, [locale, playerName])

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
          } catch (e) {
            console.error(e)
          }
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
        toast.error(t.game.duplicateNameToast)
      }
    })
  }

  const handleShare = () => {
    const gameUrl = typeof window !== "undefined" ? window.location.href : ""
    trackEvent("game_result_shared", { game_id: activeGame.id, score })
    const text = t.game.result.shareText
      .replace("{gameTitle}", activeGame.title)
      .replace("{score}", String(score))
      .replace("{gameUrl}", gameUrl)

    if (navigator.share) {
      navigator
        .share({
          title: activeGame.title,
          text,
          url: gameUrl,
        })
        .catch(() => {})
      return
    }

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success(t.game.result.copiedMessage)
        })
        .catch(() => {})
      return
    }

    toast.info(text)
  }

  const activeFeedback = isSkipped
    ? t.game.play.skipFeedback
    : selectedChoice
    ? {
        title:
          selectedChoice.feedbackTitle ||
          ((selectedChoice.isCorrect ?? selectedChoice.points > 0)
            ? t.game.correctFeedback
            : t.game.wrongFeedback),
        message: selectedChoice.feedbackMessage || "",
        tip: selectedChoice.feedbackTip || "",
      }
    : null

  const feedbackIsCorrect =
    !isSkipped &&
    (selectedChoice ? (selectedChoice.isCorrect ?? selectedChoice.points > 0) : false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center p-4 pt-20 sm:pt-4 relative">
      {/* Top Floating Bar */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-8 max-w-5xl mx-auto flex items-center justify-between pointer-events-none z-40">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-xl font-bold text-sm shadow-sm border border-gray-200/80 backdrop-blur-md transition-all hover:scale-105"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{t.game.backToHome}</span>
        </Link>

        <div className="pointer-events-auto">
          <LanguageDropdown variant="glass" />
        </div>
      </div>

      <div className="w-full max-w-lg">
        {isOffline && (
          <div className="bg-amber-100 border border-amber-200 text-amber-800 text-sm font-bold text-center py-3 px-4 rounded-2xl mb-4 shadow-sm animate-in fade-in slide-in-from-top-4 flex items-center justify-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>{t.game.offlineNotice}</span>
          </div>
        )}

        {screen === "join" && (
          <JoinScreen
            game={activeGame}
            playerName={playerName}
            setPlayerName={setPlayerName}
            isPending={isPending}
            onJoin={handleJoin}
            onGenerateRandomName={() => setPlayerName(generateRandomName(locale))}
          />
        )}

        {screen === "start" && (
          <StartScreen
            game={activeGame}
            playerName={playerName}
            onStartGame={startGame}
          />
        )}

        {screen === "game" && currentScenario && (
          <GameplayScreen
            playerName={playerName}
            score={score}
            currentScenarioIndex={currentScenarioIndex}
            totalScenarios={activeScenarios.length}
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
            game={activeGame}
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
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(600px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s linear forwards;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease;
        }
      `}</style>
    </div>
  )
}
