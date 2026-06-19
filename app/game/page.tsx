"use client"

import { useState } from "react"
import Link from "next/link"
import  scenarios from "@/data/scenarios-v2.json"
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
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(
    null,
  )
  const [showFeedback, setShowFeedback] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

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
    setShowFeedback(false)
    setScreen("game")
  }

  const selectChoice = (choiceIndex: number) => {
    if (hasAnswered) return

    setHasAnswered(true)
    setSelectedChoiceIndex(choiceIndex)

    const choice = currentScenario.choices[choiceIndex]
    if (choice.isCorrect) {
      setScore((prev) => prev + choice.points)
    }

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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-lg">
        {screen === "start" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center animate-in fade-in duration-500">
            <img
              src={config.logoUrl}
              alt={`شعار ${config.organizationName}`}
              className="w-28 h-28 mx-auto mb-4 object-contain"
            />
            <h1 className="text-3xl font-bold text-emerald-600 mb-2">
              {config.appName}
            </h1>
            <p className="text-gray-500 mb-6">{config.campaignSubtitle}</p>

            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 mb-6 text-right">
              <p className="text-gray-700 mb-3">{"مرحباً بك يا بطل! 👋"}</p>
              <p className="text-gray-700 mb-3">
                في هذه اللعبة ستمر بمواقف مختلفة من الحياة اليومية.
              </p>
              <p className="text-gray-700 mb-3">
                اختر القرار الصحيح في كل موقف واجمع أكبر عدد من النقاط!
              </p>
              <p className="text-emerald-700 font-bold">
                هل أنت مستعد لتصبح بطل القرارات الصحيحة؟
              </p>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse"
            >
              🚀 ابدأ اللعبة
            </button>

            <div className="flex justify-center gap-4 mt-6">
              <span className="text-2xl animate-pulse">⭐</span>
              <span
                className="text-2xl animate-pulse"
                style={{ animationDelay: "0.3s" }}
              >
                🌟
              </span>
              <span
                className="text-2xl animate-pulse"
                style={{ animationDelay: "0.6s" }}
              >
                ✨
              </span>
            </div>

            <Link
              href={config.routes.home}
              className="inline-block mt-6 text-gray-400 hover:text-gray-600 text-sm"
            >
              ← العودة للرئيسية
            </Link>
          </div>
        )}

        {screen === "game" && currentScenario && (
          <div className="bg-white rounded-3xl p-6 shadow-xl relative animate-in fade-in duration-500">
            <div className="flex justify-between mb-4">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-2 rounded-xl text-center min-w-[100px]">
                <span className="block text-xs text-gray-500">النقاط</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {score}
                </span>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-2 rounded-xl text-center min-w-[100px]">
                <span className="block text-xs text-gray-500">الموقف</span>
                <span className="text-xl font-bold text-blue-600">
                  {currentScenarioIndex + 1} / {scenarios.length}
                </span>
              </div>
            </div>

            <div className="bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(currentScenarioIndex / scenarios.length) * 100}%`,
                }}
              />
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-5 text-center mb-5 animate-in slide-in-from-right duration-500">
              <div className="text-5xl mb-3">{currentScenario.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {currentScenario.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {currentScenario.description}
              </p>
            </div>

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

            {showFeedback && selectedChoice && (
              <div className="absolute inset-0 bg-white/98 rounded-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-in zoom-in duration-500">
                    {selectedChoice.isCorrect ? "✅" : "💡"}
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 ${selectedChoice.isCorrect ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {selectedChoice.feedback.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {selectedChoice.feedback.message}
                  </p>

                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 mb-5 flex items-start gap-3 text-right">
                    <span className="text-2xl flex-shrink-0">💡</span>
                    <span className="text-gray-700 text-sm">
                      {selectedChoice.feedback.tip}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={nextScenario}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {currentScenarioIndex >= scenarios.length - 1
                      ? "🏆 عرض النتيجة"
                      : "← التالي"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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
                  نتيجتك النهائية
                </span>
                <span className="text-5xl font-bold">{score}</span>
                <span className="text-lg opacity-90"> / {maxScore} نقطة</span>
              </div>

              <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 mb-5 font-bold">
                {resultData.message}
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-500 rounded-2xl p-5 mb-6">
                <img
                  src={config.logoUrl}
                  alt={`شعار ${config.organizationName}`}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
                <h3 className="text-emerald-700 font-bold mb-2">
                  رسالة من {config.organizationName}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  أنت قادر على اتخاذ القرارات الصحيحة دائماً! تذكر أن صحتك
                  وسلامتك أهم من أي شيء. إذا واجهت أي موقف صعب، تحدث مع والديك
                  أو معلمك. نحن فخورون بك! 💚
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={restartGame}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  🔄 العب مرة أخرى
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="border-2 border-emerald-500 text-emerald-600 font-bold px-8 py-3 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300"
                >
                  📤 شارك نتيجتك
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
