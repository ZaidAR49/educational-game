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
import { JoinScreen } from "./components/JoinScreen"
import { StartScreen } from "./components/StartScreen"
import { GameplayScreen } from "./components/GameplayScreen"
import { ResultScreen } from "./components/ResultScreen"
import type { Game, ClassroomPlay } from "@/lib/db/schema"

type GameScreen = "join" | "start" | "game" | "result"

// Fix #18: Proper types for scenario choices (isCorrect stripped by server before sending)
type SanitizedChoice = {
  id: string;
  scenarioId: string;
  orderIndex: number;
  text: string;
  icon: string | null;
  feedbackTitle: string | null;
  feedbackMessage: string | null;
  feedbackTip: string | null;
  points: number;
  createdAt: Date;
};

type SanitizedScenario = {
  id: string;
  gameId: string;
  orderIndex: number;
  icon: string | null;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  choices: SanitizedChoice[];
};

const generateRandomName = () => {
  const noun = nicknames.nouns[Math.floor(Math.random() * nicknames.nouns.length)];
  const adj = nicknames.adjectives[Math.floor(Math.random() * nicknames.adjectives.length)];
  return `${noun} ${adj}`;
};

// Fix #18: typed props — game is a full Game, play is ClassroomPlay or preview stub, scenarios are sanitized (no isCorrect)
export default function GameClient({ game, play, scenarios }: {
  game: Game & { isDemo?: boolean };
  play: Pick<ClassroomPlay, 'id'> | { id: string };
  scenarios: SanitizedScenario[];
}) {
  const [screen, setScreen] = useState<GameScreen>(game.isDemo ? "start" : "join")
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
  const [isOffline, setIsOffline] = useState(false)

  const trackEvent = (eventName: string, properties?: any) => {
    if (!game.isDemo) {
      posthog.capture(eventName, properties);
    }
  };

  const { app, gameStart, gamePlay, results } = uiContent

  useEffect(() => {
    // Check if there is a saved session for this play
    const savedSessionStr = localStorage.getItem(`eduplay_session_${play.id}`);
    if (savedSessionStr && !game.isDemo) {
      try {
        const saved = JSON.parse(savedSessionStr);
        if (saved.playerId && saved.playerName) {
          startTransition(async () => {
            try {
              // Validate and reconnect on backend
              const player = await joinPlayAction(play.id, saved.playerName, saved.playerId);
              
              setPlayerId(player.id);
              setPlayerName(player.name);
              
              // Restore values
              const restoredScore = saved.score ?? player.totalScore;
              const restoredCorrect = saved.correctAnswers ?? player.totalCorrectAnswers;
              const restoredWrong = saved.wrongAnswers ?? player.totalWrongAnswers;
              const restoredIndex = saved.currentScenarioIndex ?? (player.totalCorrectAnswers + player.totalWrongAnswers);
              const restoredFinished = saved.isFinished || player.isFinished;

              setScore(restoredScore);
              setCorrectAnswers(restoredCorrect);
              setWrongAnswers(restoredWrong);
              setCurrentScenarioIndex(restoredIndex);
              setScreen(restoredFinished ? "result" : "game");
            } catch (err) {
              console.error("Failed to auto-reconnect:", err);
              // Clean up stale session
              localStorage.removeItem(`eduplay_session_${play.id}`);
              
              const savedName = localStorage.getItem("drugGamePlayerName");
              if (savedName) {
                setPlayerName(savedName);
              } else {
                setPlayerName(generateRandomName());
              }
            }
          });
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const savedName = localStorage.getItem("drugGamePlayerName");
    if (savedName) {
      setPlayerName(savedName);
    } else {
      setPlayerName(generateRandomName());
    }
  }, [play.id, game.isDemo]);

  const currentScenario = scenarios[currentScenarioIndex]
  // max score should ideally be derived from scenarios and choices, but we assume each correct is 10 points for now
  const maxScore = scenarios.reduce((acc, scenario) => {
    const maxChoicePoints = Math.max(...scenario.choices.map((c: SanitizedChoice) => c.points || 0), 0);
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
          trackEvent("game_joined", { game_id: game.id, is_demo: true });
          setScreen("start");
          return;
        }

        // Retrieve any saved player ID for this play to support reconnection
        const savedSessionStr = localStorage.getItem(`eduplay_session_${play.id}`);
        let savedPlayerId: string | null = null;
        if (savedSessionStr) {
          try {
            const data = JSON.parse(savedSessionStr);
            if (data.playerName === playerName.trim()) {
              savedPlayerId = data.playerId;
            }
          } catch (e) {
            console.error(e);
          }
        }

        const player = await joinPlayAction(play.id, playerName.trim(), savedPlayerId);
        setPlayerId(player.id);

        // Save name for future sessions
        localStorage.setItem("drugGamePlayerName", playerName.trim());
        
        // Initialize localStorage session
        localStorage.setItem(`eduplay_session_${play.id}`, JSON.stringify({
          playerId: player.id,
          playerName: playerName.trim(),
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          currentScenarioIndex: 0,
          isFinished: false
        }));

        trackEvent("game_joined", { game_id: game.id, is_demo: false });

        setScreen("start");
      } catch (error: any) {
        toast.error("هذا الاسم مستخدم بالفعل في هذه الجلسة، يرجى اختيار اسم آخر.");
      }
    });
  }

  const startGame = () => {
    // Bug #14 Fix: only reset state for a fresh start
    // If the player already has a reconnected session (playerId is set), don't wipe their progress
    if (!playerId) {
      setCurrentScenarioIndex(0)
      setScore(0)
      setCorrectAnswers(0)
      setWrongAnswers(0)
    }
    setHasAnswered(false)
    setSelectedChoiceIndex(null)
    setIsSkipped(false)
    setShowFeedback(false)
    trackEvent("game_started", { game_id: game.id, scenario_count: scenarios.length })
    setScreen("game")
  }

  // Offline-First Sync Queue Worker
  useEffect(() => {
    setIsOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);
    
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    const flushQueue = async () => {
      if (!navigator.onLine) return;
      
      const queueStr = localStorage.getItem('eduplay_sync_queue');
      if (!queueStr) return;
      
      try {
        const queue = JSON.parse(queueStr);
        if (queue.length === 0) return;
        
        // Take the latest payload for each player to prevent redundant syncs
        const latestPayloads = new Map();
        for (const item of queue) {
          latestPayloads.set(item.playerId, item);
        }

        const remainingQueue: any[] = [];
        
        for (const [pId, payload] of latestPayloads.entries()) {
          try {
            await updatePlayerAction(pId, {
              totalScore: payload.score,
              totalCorrectAnswers: payload.correctAnswers,
              totalWrongAnswers: payload.wrongAnswers,
              isFinished: payload.isFinished,
              completedAt: payload.isFinished ? new Date() : undefined,
            });
          } catch (e) {
            remainingQueue.push(payload);
          }
        }
        
        if (remainingQueue.length > 0) {
          localStorage.setItem('eduplay_sync_queue', JSON.stringify(remainingQueue));
        } else {
          localStorage.removeItem('eduplay_sync_queue');
        }
      } catch (e) {
        console.error("Failed to parse sync queue", e);
      }
    };

    // Attempt flush when coming online and periodically every 5 seconds
    window.addEventListener('online', flushQueue);
    const interval = setInterval(flushQueue, 5000);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('online', flushQueue);
      clearInterval(interval);
    };
  }, []);

  // Bug #13 Fix: accept scenarioIndex as a parameter to avoid stale closure
  // (React state updates are async; closed-over `currentScenarioIndex` may lag by one step)
  const syncProgress = async (newScore: number, newCorrect: number, newWrong: number, finished: boolean, scenarioIndex: number) => {
    if (game.isDemo) return; // Bypass DB for demo
    if (!playerId) return;

    // Save state in localStorage
    localStorage.setItem(`eduplay_session_${play.id}`, JSON.stringify({
      playerId,
      playerName,
      score: newScore,
      correctAnswers: newCorrect,
      wrongAnswers: newWrong,
      currentScenarioIndex: scenarioIndex,
      isFinished: finished
    }));

    const syncPayload = {
      playerId,
      score: newScore,
      correctAnswers: newCorrect,
      wrongAnswers: newWrong,
      isFinished: finished,
    };

    try {
      if (!navigator.onLine) throw new Error("Offline");
      
      await updatePlayerAction(playerId, {
        totalScore: newScore,
        totalCorrectAnswers: newCorrect,
        totalWrongAnswers: newWrong,
        isFinished: finished,
        completedAt: finished ? new Date() : undefined,
      });
    } catch (error) {
      console.warn("Failed to sync progress, queuing for background retry.");
      const queue = JSON.parse(localStorage.getItem('eduplay_sync_queue') || '[]');
      queue.push(syncPayload);
      localStorage.setItem('eduplay_sync_queue', JSON.stringify(queue));
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
    if (choice.isCorrect) {
      setCorrectAnswers(newCorrect);
    } else {
      setWrongAnswers(newWrong);
      // Haptic Feedback for wrong answers
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200);
      }
    }

    // Sync score after answering — pass current index explicitly to avoid stale closure (#13)
    syncProgress(newScore, newCorrect, newWrong, false, currentScenarioIndex);
    trackEvent("choice_selected", {
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

    syncProgress(score, correctAnswers, newWrong, false, currentScenarioIndex);
    trackEvent("question_skipped", {
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
    syncProgress(score, correctAnswers, wrongAnswers, true, currentScenarioIndex);
    trackEvent("game_completed", {
      game_id: game.id,
      score,
      max_score: maxScore,
      percentage: Math.round(resultPercentage),
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
    });

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

    // Save incremented index to localStorage
    if (!game.isDemo && playerId) {
      localStorage.setItem(`eduplay_session_${play.id}`, JSON.stringify({
        playerId,
        playerName,
        score,
        correctAnswers,
        wrongAnswers,
        currentScenarioIndex: nextIndex,
        isFinished: false
      }));
    }
  }

  const handleShare = () => {
    const gameUrl = typeof window !== "undefined" ? window.location.href : ""
    trackEvent("game_result_shared", { game_id: game.id, score })
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
        {/* ─── OFFLINE INDICATOR ─── */}
        {isOffline && (
          <div className="bg-amber-100 border border-amber-200 text-amber-800 text-sm font-bold text-center py-3 px-4 rounded-2xl mb-4 shadow-sm animate-in fade-in slide-in-from-top-4 flex items-center justify-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>أنت غير متصل بالإنترنت. سيتم حفظ تقدمك تلقائياً.</span>
          </div>
        )}

        {/* ─── JOIN SCREEN ─── */}
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

        {/* ─── START SCREEN ─── */}
        {screen === "start" && (
          <StartScreen
            game={game}
            playerName={playerName}
            gameStart={gameStart}
            onStartGame={startGame}
          />
        )}

        {/* ─── GAME SCREEN ─── */}
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

        {/* ─── RESULT SCREEN ─── */}
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
