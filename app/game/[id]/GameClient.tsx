"use client"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import uiContent from "@/data/ui-content-general.json"
import nicknames from "@/data/nicknames.json"
import { config } from "@/lib/config"
import {
  createConfettiPieces,
  getResultMessage,
  shareGameResult,
  type ConfettiPiece,
} from "@/lib/game"
import { joinPlayAction, updatePlayerAction } from "@/lib/actions/plays.actions"
import posthog from "posthog-js"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

type GameScreen = "join" | "start" | "game" | "result"

const generateRandomName = () => {
  const noun = nicknames.nouns[Math.floor(Math.random() * nicknames.nouns.length)];
  const adj = nicknames.adjectives[Math.floor(Math.random() * nicknames.adjectives.length)];
  return `${noun} ${adj}`;
};

export default function GameClient({ game, play, scenarios }: { game: any, play: any, scenarios: any[] }) {
  const [screen, setScreen] = useState<GameScreen>("join")
  const [playerName, setPlayerName] = useState("")
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  
  // Scoring
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null)
  const [isSkipped, setIsSkipped] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  const { app, gameStart, gamePlay, results } = uiContent

  useEffect(() => {
    // Check local storage for existing name
    const savedName = localStorage.getItem("drugGamePlayerName");
    if (savedName) {
      setPlayerName(savedName);
    } else {
      setPlayerName(generateRandomName());
    }
  }, []);

  const currentScenario = scenarios[currentScenarioIndex]
  // max score should ideally be derived from scenarios and choices, but we assume each correct is 10 points for now
  const maxScore = scenarios.reduce((acc, scenario) => {
    const maxChoicePoints = Math.max(...scenario.choices.map((c: any) => c.points || 0), 0);
    return acc + maxChoicePoints;
  }, 0) || scenarios.length * 10;
  
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
  const resultData = getResultMessage(percentage)
  const selectedChoice =
    selectedChoiceIndex !== null
      ? currentScenario?.choices[selectedChoiceIndex]
      : null

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    startTransition(async () => {
      try {
        if (game.isDemo) {
          // Bypass DB for demo
          setPlayerId("demo-player-id");
          localStorage.setItem("drugGamePlayerName", playerName.trim());
          posthog.capture("game_joined", { game_id: game.id, is_demo: true });
          setScreen("start");
          return;
        }

        const player = await joinPlayAction(play.id, playerName.trim());
        setPlayerId(player.id);

        // Save name for future sessions
        localStorage.setItem("drugGamePlayerName", playerName.trim());
        posthog.capture("game_joined", { game_id: game.id, is_demo: false });

        setScreen("start");
      } catch (error: any) {
        toast.error("هذا الاسم مستخدم بالفعل في هذه الجلسة، يرجى اختيار اسم آخر.");
      }
    });
  }

  const startGame = () => {
    setCurrentScenarioIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setHasAnswered(false)
    setSelectedChoiceIndex(null)
    setIsSkipped(false)
    setShowFeedback(false)
    posthog.capture("game_started", { game_id: game.id, scenario_count: scenarios.length })
    setScreen("game")
  }

  const syncProgress = async (newScore: number, newCorrect: number, newWrong: number, finished: boolean) => {
    if (game.isDemo) return; // Bypass DB for demo
    if (!playerId) return;
    try {
      await updatePlayerAction(playerId, {
        totalScore: newScore,
        totalCorrectAnswers: newCorrect,
        totalWrongAnswers: newWrong,
        isFinished: finished,
        completedAt: finished ? new Date() : undefined,
      });
    } catch (error) {
      console.error("Failed to sync progress");
    }
  }

  const selectChoice = (choiceIndex: number) => {
    if (hasAnswered) return

    setHasAnswered(true)
    setIsSkipped(false)
    setSelectedChoiceIndex(choiceIndex)

    const choice = currentScenario.choices[choiceIndex]
    
    const newScore = score + (choice.points || 0);
    const newCorrect = correctAnswers + (choice.isCorrect ? 1 : 0);
    const newWrong = wrongAnswers + (!choice.isCorrect ? 1 : 0);
    
    setScore(newScore);
    if (choice.isCorrect) setCorrectAnswers(newCorrect);
    else setWrongAnswers(newWrong);

    // Sync score after answering
    syncProgress(newScore, newCorrect, newWrong, false);
    posthog.capture("choice_selected", {
      game_id: game.id,
      scenario_index: currentScenarioIndex,
      is_correct: choice.isCorrect,
      points_earned: choice.points || 0,
    });

    setTimeout(() => {
      setShowFeedback(true)
    }, config.game.feedbackDelayMs)
  }

  const skipQuestion = () => {
    if (hasAnswered) return

    setHasAnswered(true)
    setIsSkipped(true)
    setSelectedChoiceIndex(null)

    const newWrong = wrongAnswers + 1; // Count skip as wrong
    setWrongAnswers(newWrong);

    syncProgress(score, correctAnswers, newWrong, false);
    posthog.capture("question_skipped", {
      game_id: game.id,
      scenario_index: currentScenarioIndex,
    });

    setTimeout(() => {
      setShowFeedback(true)
    }, config.game.feedbackDelayMs)
  }

  const showResults = () => {
    setScreen("result")
    const resultPercentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    // Final sync
    syncProgress(score, correctAnswers, wrongAnswers, true);
    posthog.capture("game_completed", {
      game_id: game.id,
      score,
      max_score: maxScore,
      percentage: Math.round(resultPercentage),
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
    });

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

  const handleShare = () => {
    const gameUrl = typeof window !== "undefined" ? window.location.href : ""
    posthog.capture("game_result_shared", { game_id: game.id, score })
    void shareGameResult(score, gameUrl)
  }

  // Feedback content: skipped vs answered
  const activeFeedback = isSkipped
    ? gamePlay.skipFeedback
    : selectedChoice ? {
        title: selectedChoice.feedbackTitle || (selectedChoice.isCorrect ? "إجابة صحيحة!" : "إجابة خاطئة!"),
        message: selectedChoice.feedbackMessage || "",
        tip: selectedChoice.feedbackTip || ""
      } : null;
      
  const feedbackIsCorrect = !isSkipped && (selectedChoice?.isCorrect ?? false)

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-lg">
        {/* ─── JOIN SCREEN ─── */}
        {screen === "join" && (
          <form onSubmit={handleJoin} className="bg-white rounded-3xl p-8 shadow-xl text-center animate-in fade-in duration-500">
             <div className={`w-20 h-20 ${game.organization?.logoPath ? 'bg-transparent' : 'bg-indigo-50'} rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 text-4xl overflow-hidden`}>
               {game.organization?.logoPath ? (
                 <img src={game.organization.logoPath} alt="Logo" className="w-full h-full object-contain" />
               ) : (
                 "🎮"
               )}
             </div>
             <h1 className="text-3xl font-black text-gray-900 mb-2">
               الانضمام للعبة
             </h1>
             <p className="text-gray-500 font-bold mb-8">{game.title}</p>
             
             <div className="mb-6 text-right">
               <label className="block text-gray-700 font-bold mb-2">اسمك الأول</label>
               <div className="relative">
                 <input 
                   type="text" 
                   required
                   value={playerName}
                   onChange={(e) => setPlayerName(e.target.value)}
                   className="w-full pl-16 pr-5 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold"
                   placeholder="اكتب اسمك هنا..."
                   autoFocus
                 />
                 <button
                   type="button"
                   onClick={() => setPlayerName(generateRandomName())}
                   className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors group"
                   title="توليد اسم عشوائي"
                 >
                   <span className="text-xl group-hover:rotate-180 inline-block transition-transform duration-300">🎲</span>
                 </button>
               </div>
             </div>

             <button
               type="submit"
               disabled={isPending || !playerName.trim()}
               className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xl font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
             >
               {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "دخول الآن"}
             </button>
          </form>
        )}

        {/* ─── START SCREEN ─── */}
        {screen === "start" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center animate-in fade-in duration-500">
            {game.organization?.logoPath && (
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                 <img src={game.organization.logoPath} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <h1 className="text-3xl font-black text-emerald-600 mb-2">
              {game.title}
            </h1>
            <p className="text-gray-500 mb-6 font-bold">مرحباً {playerName}! 👋</p>

            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 mb-6 text-right">
              {game.description && (
                <p className="text-gray-700 mb-4 leading-relaxed font-medium">
                  {game.description}
                </p>
              )}
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
          </div>
        )}

        {/* ─── GAME SCREEN ─── */}
        {screen === "game" && currentScenario && (
          <div className="bg-white rounded-3xl p-6 shadow-xl relative animate-in fade-in duration-500">
            {/* Header row: score | skip | question counter */}
            <div className="flex justify-between items-center mb-4 gap-2">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-2 rounded-xl text-center min-w-[80px]">
                <span className="block text-xs text-gray-500 font-bold">{gamePlay.scoreLabel}</span>
                <span className="text-2xl font-black text-emerald-600">{score}</span>
              </div>

              {/* Skip button — centre */}
              <button
                type="button"
                onClick={skipQuestion}
                disabled={hasAnswered}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border-2 text-sm font-bold transition-all duration-200
                  ${hasAnswered
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-amber-400 text-amber-600 hover:bg-amber-50 hover:scale-105 active:scale-95"
                  }`}
              >
                {gamePlay.skipButtonLabel}
              </button>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-2 rounded-xl text-center min-w-[80px]">
                <span className="block text-xs text-gray-500 font-bold">{gamePlay.questionLabel}</span>
                <span className="text-xl font-black text-blue-600">
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
              <div className="text-5xl mb-3">{currentScenario.icon || "❓"}</div>
              <h2 className="text-xl font-black text-gray-800 mb-2">
                {currentScenario.title}
              </h2>
              <p className="text-gray-600 font-medium leading-relaxed">
                {currentScenario.description}
              </p>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {currentScenario.choices.map((choice: any, index: number) => (
                <button
                  key={choice.id || index}
                  type="button"
                  onClick={() => selectChoice(index)}
                  disabled={hasAnswered}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 text-right font-bold
                    ${!hasAnswered ? "border-gray-200 hover:border-blue-400 hover:bg-gray-50 hover:-translate-x-1" : ""}
                    ${hasAnswered && selectedChoiceIndex === index && choice.isCorrect ? "border-emerald-500 bg-emerald-50" : ""}
                    ${hasAnswered && selectedChoiceIndex === index && !choice.isCorrect ? "border-amber-500 bg-amber-50 animate-shake" : ""}
                    ${hasAnswered && selectedChoiceIndex !== index && choice.isCorrect ? "border-emerald-500 bg-emerald-50" : ""}
                    ${hasAnswered ? "pointer-events-none" : "cursor-pointer"}
                  `}
                >
                  {choice.icon && <span className="text-2xl flex-shrink-0">{choice.icon}</span>}
                  <span className="text-gray-700">{choice.text}</span>
                </button>
              ))}
            </div>

            {/* Feedback overlay */}
            {showFeedback && activeFeedback && (
              <div className="absolute inset-0 bg-white/98 rounded-3xl flex items-center justify-center p-6 animate-in fade-in duration-300 z-10">
                <div className="text-center w-full">
                  <div className="text-6xl mb-4 animate-in zoom-in duration-500">
                    {isSkipped ? "⏭️" : feedbackIsCorrect ? gamePlay.feedbackCorrectIcon : gamePlay.feedbackWrongIcon}
                  </div>
                  <h3
                    className={`text-2xl font-black mb-3 ${
                      isSkipped
                        ? "text-amber-500"
                        : feedbackIsCorrect
                          ? "text-emerald-600"
                          : "text-amber-600"
                    }`}
                  >
                    {activeFeedback.title}
                  </h3>
                  {activeFeedback.message && (
                    <p className="text-gray-600 font-medium mb-4 leading-relaxed">
                      {activeFeedback.message}
                    </p>
                  )}

                  {activeFeedback.tip && (
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 mb-5 flex items-start gap-3 text-right">
                      <span className="text-2xl flex-shrink-0">{gamePlay.feedbackTipIcon}</span>
                      <span className="text-gray-700 font-medium text-sm">
                        {activeFeedback.tip}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={nextScenario}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full"
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
              <div className="text-7xl mb-4 animate-in zoom-in duration-700 flex justify-center">
                {game.organization?.logoPath ? (
                  <img src={game.organization.logoPath} alt="Logo" className="w-24 h-24 object-contain" />
                ) : (
                  resultData.badge
                )}
              </div>
              <h1 className="text-3xl font-black text-emerald-600 mb-2">
                {resultData.title}
              </h1>
              <p className="text-gray-500 font-medium mb-6">{resultData.subtitle}</p>

              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 mb-5 shadow-inner">
                <span className="block text-sm opacity-90 font-bold mb-1">
                  {results.finalScoreLabel}
                </span>
                <span className="text-5xl font-black">{score}</span>
                <span className="text-lg opacity-90 font-bold"> / {maxScore} {results.pointsSuffix}</span>
              </div>

              <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 mb-5 font-bold">
                {resultData.message}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {results.shareLabel}
                </button>
                
                {game.isDemo && (
                  <>
                    <button
                      type="button"
                      onClick={startGame}
                      className="bg-white border-2 border-emerald-500 text-emerald-600 font-bold px-8 py-4 rounded-xl shadow-sm hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
                    >
                      إعادة المحاولة 🔄
                    </button>
                    <Link
                      href={game.id === '00000000-0000-0000-0000-000000000003' ? '/' : '/dashboard/games'}
                      className="bg-gray-100 text-gray-700 font-bold px-8 py-4 rounded-xl shadow-sm hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                    >
                      {game.id === '00000000-0000-0000-0000-000000000003' ? 'العودة للرئيسية 🏠' : 'العودة للوحة التحكم 🔙'}
                    </Link>
                  </>
                )}

                {!game.isDemo && (
                  <div className="text-gray-400 font-medium text-sm mt-4">
                    تم تسجيل النتيجة وحفظها بنجاح 🎯
                  </div>
                )}
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
