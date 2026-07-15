"use client"

import { useState } from "react"
import { config } from "@/lib/config"
import { createConfettiPieces, getResultMessage, type ConfettiPiece } from "@/lib/game"
import posthog from "posthog-js"

type Scenario = any // Simplified for hook signature
type GameScreen = "join" | "start" | "game" | "result"

type UseGameFlowProps = {
  game: { id: string; isDemo?: boolean }
  playId: string
  scenarios: Scenario[]
  playerId: string | null
  playerName: string
  syncProgress: (score: number, correct: number, wrong: number, finished: boolean, index: number) => void
  setScreen: (screen: GameScreen) => void
}

export function useGameFlow({
  game,
  playId,
  scenarios,
  playerId,
  playerName,
  syncProgress,
  setScreen,
}: UseGameFlowProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)

  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null)
  const [isSkipped, setIsSkipped] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  const trackEvent = (eventName: string, properties?: any) => {
    if (!game.isDemo) posthog.capture(eventName, properties)
  }

  const currentScenario = scenarios[currentScenarioIndex]
  const maxScore =
    scenarios.reduce((acc, scenario) => {
      const maxChoicePoints = Math.max(...scenario.choices.map((c: any) => c.points || 0), 0)
      return acc + maxChoicePoints
    }, 0) || scenarios.length * 10

  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
  const resultData = getResultMessage(percentage)
  const selectedChoice =
    selectedChoiceIndex !== null ? currentScenario?.choices[selectedChoiceIndex] : null

  const startGame = () => {
    setCurrentScenarioIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setHasAnswered(false)
    setSelectedChoiceIndex(null)
    setIsSkipped(false)
    setShowFeedback(false)
    trackEvent("game_started", { game_id: game.id, scenario_count: scenarios.length })

    if (!game.isDemo && playerId) {
      localStorage.setItem(
        `eduplay_session_${playId}`,
        JSON.stringify({
          playerId,
          playerName,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          currentScenarioIndex: 0,
          isFinished: false,
        })
      )
    }

    setScreen("game")
  }

  const selectChoice = (choiceIndex: number) => {
    if (hasAnswered) return
    setHasAnswered(true)
    setIsSkipped(false)
    setSelectedChoiceIndex(choiceIndex)

    const choice = currentScenario.choices[choiceIndex]
    const isCorrect = choice.isCorrect ?? choice.points > 0

    const newScore = score + (choice.points || 0)
    const newCorrect = correctAnswers + (isCorrect ? 1 : 0)
    const newWrong = wrongAnswers + (!isCorrect ? 1 : 0)

    setScore(newScore)
    if (isCorrect) {
      setCorrectAnswers(newCorrect)
    } else {
      setWrongAnswers(newWrong)
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(200)
    }

    syncProgress(newScore, newCorrect, newWrong, false, currentScenarioIndex)
    trackEvent("choice_selected", {
      game_id: game.id,
      scenario_index: currentScenarioIndex,
      is_correct: isCorrect,
      points_earned: choice.points || 0,
    })

    setTimeout(() => setShowFeedback(true), config.game.feedbackDelayMs)
  }

  const skipQuestion = () => {
    if (hasAnswered) return
    setHasAnswered(true)
    setIsSkipped(true)
    setSelectedChoiceIndex(null)

    const newWrong = wrongAnswers + 1
    setWrongAnswers(newWrong)

    syncProgress(score, correctAnswers, newWrong, false, currentScenarioIndex)
    trackEvent("question_skipped", { game_id: game.id, scenario_index: currentScenarioIndex })
    setTimeout(() => setShowFeedback(true), config.game.feedbackDelayMs)
  }

  const showResults = () => {
    setScreen("result")
    const resultPercentage = maxScore > 0 ? (score / maxScore) * 100 : 0
    syncProgress(score, correctAnswers, wrongAnswers, true, currentScenarioIndex)
    trackEvent("game_completed", {
      game_id: game.id,
      score,
      max_score: maxScore,
      percentage: Math.round(resultPercentage),
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
    })

    if (game.isDemo || resultPercentage >= config.game.resultThresholds.good) {
      setConfetti(createConfettiPieces())
      setTimeout(() => setConfetti([]), config.game.confettiClearMs)
    }
  }

  const nextScenario = () => {
    if (currentScenarioIndex >= scenarios.length - 1) {
      showResults()
      return
    }
    const nextIndex = currentScenarioIndex + 1
    setCurrentScenarioIndex(nextIndex)
    setHasAnswered(false)
    setSelectedChoiceIndex(null)
    setIsSkipped(false)
    setShowFeedback(false)

    if (!game.isDemo && playerId) {
      localStorage.setItem(
        `eduplay_session_${playId}`,
        JSON.stringify({
          playerId,
          playerName,
          score,
          correctAnswers,
          wrongAnswers,
          currentScenarioIndex: nextIndex,
          isFinished: false,
        })
      )
    }
  }

  return {
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
    percentage,
    resultData,
    selectedChoice,
    startGame,
    selectChoice,
    skipQuestion,
    nextScenario,
    trackEvent,
  }
}
