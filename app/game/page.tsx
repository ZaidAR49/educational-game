"use client"

import { useState } from "react"
import Link from "next/link"
import scenarios from "@/data/scenarios-v2.json"
import uiContent from "@/data/ui-content.json"
import { config } from "@/lib/config"
import {
  createConfettiPieces,
  getResultMessage,
  shareGameResult,
  type ConfettiPiece,
} from "@/lib/game"

type GameScreen = "start" | "game" | "result"

export default function GamePage() {
  const [screen, setScreen] = useState<GameScreen>("start")
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null)
  const [isSkipped, setIsSkipped] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  const { app, gameStart, gamePlay, results } = uiContent

  const currentScenario = scenarios[currentScenarioIndex]
  const maxScore = scenarios.length * 10
  const percentage = (score / maxScore) * 100
  const resultData = getResultMessage(percentage)
  const selectedChoice =
    selectedChoiceIndex !== null
      ? currentScenario?.choices[selectedChoiceIndex]
      : null

  const startGame = () => {
    setCurrentScenarioIndex(0)
    setScore(0)
    setHasAnswered(false)
    setSelectedChoiceIndex(null)
    setIsSkipped(false)
    setShowFeedback(false)
    setScreen("game")
  }

  const selectChoice = (choiceIndex: number) => {
    if (hasAnswered) return

    setHasAnswered(true)
    setIsSkipped(false)
    setSelectedChoiceIndex(choiceIndex)

    const choice = currentScenario.choices[choiceIndex]
    if (choice.isCorrect) {
      setScore((prev) => prev + choice.points)
    }

    setTimeout(() => {
      setShowFeedback(true)
    }, config.game.feedbackDelayMs)
  }

  const skipQuestion = () => {
    if (hasAnswered) return

    setHasAnswered(true)
    setIsSkipped(true)
    setSelectedChoiceIndex(null)
    // 0 points added (no score change)

    setTimeout(() => {
      setShowFeedback(true)
    }, config.game.feedbackDelayMs)
  }

  const showResults = () => {
    setScreen("result")
    const resultPercentage = (score / maxScore) * 100
    if (resultPercentage >= config.game.resultThresholds.good) {
      setConfetti(createConfettiPieces())
      setTimeout(() => setConfetti([]), config.game.confettiClearMs)
    }
  }

  const nextScenario = () => {
    if (currentScenarioIndex >= scenarios.length - 1) {
      showResults()
      return
    }

    setCurrentScenarioIndex((prev) => prev + 1)
    setHasAnswered(false)
    setSelectedChoiceIndex(null)
    setIsSkipped(false)
    setShowFeedback(false)
  }

  const restartGame = () => {
    setScreen("start")
    setConfetti([])
  }

  const handleShare = () => {
    const gameUrl = typeof window !== "undefined" ? window.location.href : ""
    void shareGameResult(score, gameUrl)
  }

  // Feedback content: skipped vs answered
  const activeFeedback = isSkipped
    ? gamePlay.skipFeedback
    : selectedChoice?.feedback ?? null
  const feedbackIsCorrect = !isSkipped && (selectedChoice?.isCorrect ?? false)

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-lg">
        {/* ─── START SCREEN ─── */}
        {screen === "start" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center animate-in fade-in duration-500">
            <img
              src={app.logoUrl}
              alt={`شعار ${app.organizationName}`}
              className="w-28 h-28 mx-auto mb-4 object-contain"
            />
            <h1 className="text-3xl font-bold text-emerald-600 mb-2">
              {app.name}
            </h1>
            <p className="text-gray-500 mb-6">{app.campaignSubtitle}</p>

            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 mb-6 text-right">
              {gameStart.welcomeLines.map((line, i) => (
                <p
                  key={i}
                  className={`text-gray-700 mb-3 ${i === gameStart.welcomeLines.length - 1 ? "" : ""}`}
                >
                  {line}
                </p>
              ))}
              <p className="text-emerald-700 font-bold">{gameStart.ctaText}</p>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse"
            >
              {gameStart.startButtonLabel}
            </button>

            <div className="flex justify-center gap-4 mt-6">
              <span className="text-2xl animate-pulse">⭐</span>
              <span className="text-2xl animate-pulse" style={{ animationDelay: "0.3s" }}>🌟</span>
              <span className="text-2xl animate-pulse" style={{ animationDelay: "0.6s" }}>✨</span>
            </div>

            <Link
              href={config.routes.home}
              className="inline-block mt-6 text-gray-400 hover:text-gray-600 text-sm"
            >
              {gameStart.backToHomeLabel}
            </Link>
          </div>
        )}

        {/* ─── GAME SCREEN ─── */}
        {screen === "game" && currentScenario && (
          <div className="bg-white rounded-3xl p-6 shadow-xl relative animate-in fade-in duration-500">
            {/* Header row: score | skip | question counter */}
            <div className="flex justify-between items-center mb-4 gap-2">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-2 rounded-xl text-center min-w-[80px]">
                <span className="block text-xs text-gray-500">{gamePlay.scoreLabel}</span>
                <span className="text-2xl font-bold text-emerald-600">{score}</span>
              </div>

              {/* Skip button — centre */}
              <button
                type="button"
                onClick={skipQuestion}
                disabled={hasAnswered}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200
                  ${hasAnswered
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-amber-400 text-amber-600 hover:bg-amber-50 hover:scale-105 active:scale-95"
                  }`}
              >
                {gamePlay.skipButtonLabel}
              </button>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-2 rounded-xl text-center min-w-[80px]">
                <span className="block text-xs text-gray-500">{gamePlay.questionLabel}</span>
                <span className="text-xl font-bold text-blue-600">
                  {currentScenarioIndex + 1} / {scenarios.length}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentScenarioIndex / scenarios.length) * 100}%` }}
              />
            </div>

            {/* Scenario card */}
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-5 text-center mb-5 animate-in slide-in-from-right duration-500">
              <div className="text-5xl mb-3">{currentScenario.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {currentScenario.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {currentScenario.description}
              </p>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {currentScenario.choices.map((choice, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectChoice(index)}
                  disabled={hasAnswered}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 text-right
                    ${!hasAnswered ? "border-gray-200 hover:border-blue-400 hover:bg-gray-50 hover:-translate-x-1" : ""}
                    ${hasAnswered && selectedChoiceIndex === index && choice.isCorrect ? "border-emerald-500 bg-emerald-50" : ""}
                    ${hasAnswered && selectedChoiceIndex === index && !choice.isCorrect ? "border-amber-500 bg-amber-50 animate-shake" : ""}
                    ${hasAnswered && selectedChoiceIndex !== index && choice.isCorrect ? "border-emerald-500 bg-emerald-50" : ""}
                    ${hasAnswered ? "pointer-events-none" : "cursor-pointer"}
                  `}
                >
                  <span className="text-2xl flex-shrink-0">{choice.icon}</span>
                  <span className="text-gray-700">{choice.text}</span>
                </button>
              ))}
            </div>

            {/* Feedback overlay */}
            {showFeedback && activeFeedback && (
              <div className="absolute inset-0 bg-white/98 rounded-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-in zoom-in duration-500">
                    {isSkipped ? "⏭️" : feedbackIsCorrect ? gamePlay.feedbackCorrectIcon : gamePlay.feedbackWrongIcon}
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      isSkipped
                        ? "text-amber-500"
                        : feedbackIsCorrect
                          ? "text-emerald-600"
                          : "text-amber-600"
                    }`}
                  >
                    {activeFeedback.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {activeFeedback.message}
                  </p>

                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 mb-5 flex items-start gap-3 text-right">
                    <span className="text-2xl flex-shrink-0">{gamePlay.feedbackTipIcon}</span>
                    <span className="text-gray-700 text-sm">
                      {activeFeedback.tip}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={nextScenario}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {currentScenarioIndex >= scenarios.length - 1
                      ? gamePlay.showResultsLabel
                      : gamePlay.nextButtonLabel}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── RESULT SCREEN ─── */}
        {screen === "result" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center relative overflow-hidden animate-in fade-in duration-500">
            {confetti.map((piece) => (
              <div
                key={piece.id}
                className="absolute w-3 h-3 rounded-sm animate-confetti"
                style={{
                  left: piece.left,
                  backgroundColor: piece.color,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                }}
              />
            ))}

            <div className="relative z-10">
              <div className="text-7xl mb-4 animate-in zoom-in duration-700">
                {resultData.badge}
              </div>
              <h1 className="text-3xl font-bold text-emerald-600 mb-2">
                {resultData.title}
              </h1>
              <p className="text-gray-500 mb-6">{resultData.subtitle}</p>

              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 mb-5">
                <span className="block text-sm opacity-90 mb-1">
                  {results.finalScoreLabel}
                </span>
                <span className="text-5xl font-bold">{score}</span>
                <span className="text-lg opacity-90"> / {maxScore} {results.pointsSuffix}</span>
              </div>

              <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 mb-5 font-bold">
                {resultData.message}
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-500 rounded-2xl p-5 mb-6">
                <img
                  src={app.logoUrl}
                  alt={`شعار ${app.organizationName}`}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
                <h3 className="text-emerald-700 font-bold mb-2">
                  {results.organizationMessageTitle.replace("{organizationName}", app.organizationName)}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {results.organizationMessage}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={restartGame}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {results.playAgainLabel}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="border-2 border-emerald-500 text-emerald-600 font-bold px-8 py-3 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300"
                >
                  {results.shareLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
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
