"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Crown, 
  Medal, 
  Award, 
  Trophy, 
  Maximize, 
  Minimize, 
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { createConfettiPieces, type ConfettiPiece } from "@/lib/game"

interface Player {
  id: string
  name: string
  totalScore: number
  correctAnswers?: number
  wrongAnswers?: number
  isFinished?: boolean
  durationSeconds?: number
}

interface Session {
  id: string
  gameName: string
  date?: string
}

export default function PodiumClient({ 
  session, 
  players 
}: { 
  session: Session
  players: Player[] 
}) {
  const { messages: t, isRTL } = useLocale()
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [showPodium, setShowPodium] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Sort students by score descending, then by duration ascending
  const sortedStudents = [...players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
    return (a.durationSeconds || Infinity) - (b.durationSeconds || Infinity)
  })
  const top3 = sortedStudents.slice(0, 3)

  // Helper to safely exit fullscreen mode
  const exitFullscreenIfActive = useCallback(async () => {
    try {
      if (typeof document !== "undefined" && document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error("Exit fullscreen error:", err)
    }
  }, [])

  // Exit fullscreen if component unmounts (e.g. browser back button, client navigation)
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  // Celebratory audio chime using browser Web Audio API
  const playFanfareChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 triumphant chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "triangle"
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1)
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1)
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.1 + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.7)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.1)
        osc.stop(ctx.currentTime + idx * 0.1 + 0.7)
      })
    } catch {
      // Audio context might be restricted before interaction; safe fallback
    }
  }, [])

  const triggerCelebration = useCallback(() => {
    setShowPodium(false)
    setTimeout(() => {
      setShowPodium(true)
      if (top3.length > 0) {
        setConfetti(createConfettiPieces())
        playFanfareChime()
        setTimeout(() => {
          setConfetti(prev => [...prev, ...createConfettiPieces()])
        }, 600)
      }
    }, 150)
  }, [top3.length, playFanfareChime])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPodium(true)
      if (top3.length > 0) {
        setConfetti(createConfettiPieces())
        playFanfareChime()
        setTimeout(() => {
          setConfetti(prev => [...prev, ...createConfettiPieces()])
        }, 800)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [top3.length, playFanfareChime])

  // Fullscreen tracking & toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err)
    }
  }

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener("fullscreenchange", handleFsChange)
    return () => document.removeEventListener("fullscreenchange", handleFsChange)
  }, [])

  // Responsive column width based on number of podium participants
  const getColWidthClass = (rank: number) => {
    if (top3.length === 1) {
      return "w-full max-w-xs sm:max-w-md"
    }
    if (top3.length === 2) {
      return rank === 1 ? "w-1/2 max-w-sm" : "w-1/2 max-w-xs"
    }
    return rank === 1 ? "w-1/3 max-w-sm" : "w-1/3 max-w-xs"
  }

  const ArrowBackIcon = isRTL ? ChevronRight : ChevronLeft

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen overflow-hidden bg-slate-950 flex flex-col justify-between select-none font-sans text-white">
      {/* Confetti Animation Layer */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm z-50 pointer-events-none"
          style={{
            top: "-20px",
            left: piece.left,
            backgroundColor: piece.color,
            animationName: "confetti-fall",
            animationDuration: piece.duration,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
            animationDelay: piece.delay,
          }}
        />
      ))}

      {/* Atmospheric Background & Spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Overhead Spotlights Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-96 bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Top Control Bar */}
      <header className="relative z-50 w-full px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between pointer-events-auto">
        {/* Back to Session Button */}
        <Link
          href={`/dashboard/sessions/${session.id}`}
          onClick={exitFullscreenIfActive}
          className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
          title={t.sessionDetails?.backToSession || "العودة للجلسة"}
        >
          <ArrowBackIcon className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
          <span>{t.sessionDetails?.backToSession || "العودة للجلسة"}</span>
        </Link>

        {/* Center Game Pill */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md text-xs font-semibold text-slate-300 shadow-inner">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-xs">{session.gameName}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Replay Confetti Button */}
          <button
            type="button"
            onClick={triggerCelebration}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
            title={t.sessionDetails?.replayCelebration || "إعادة الاحتفال"}
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{t.sessionDetails?.replayCelebration || "إعادة الاحتفال"}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
            title={isFullscreen ? (t.sessionDetails?.exitFullscreen || "إنهاء ملء الشاشة") : (t.sessionDetails?.toggleFullscreen || "ملء الشاشة")}
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">{t.sessionDetails?.exitFullscreen || "تصغير"}</span>
              </>
            ) : (
              <>
                <Maximize className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">{t.sessionDetails?.toggleFullscreen || "ملء الشاشة"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Podium Stage Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-between px-4 sm:px-8 max-w-6xl mx-auto w-full pt-2 pb-6 sm:pb-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pt-2 sm:pt-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-[0_0_25px_rgba(251,191,36,0.4)] tracking-wide mb-2">
            {t.sessionDetails?.podiumTitle || "تتويج الأبطال"}
          </h1>
          <p className="text-amber-100/80 text-sm sm:text-base font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{session.gameName}</span>
          </p>
        </motion.div>

        {/* Empty State when no players */}
        {top3.length === 0 && (
          <div className="flex flex-col items-center justify-center my-auto p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md text-center max-w-md">
            <Trophy className="w-16 h-16 text-amber-400/50 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold mb-2">{t.sessionDetails?.noPlayersFound || "لم يتم تسجيل نتائج طلاب بعد"}</h2>
            <p className="text-slate-400 text-sm mb-6">شارك رابط اللعبة أو رمز الدخول مع الطلاب لبدء التنافس والظهور على المنصة.</p>
            <Link
              href={`/dashboard/sessions/${session.id}`}
              onClick={exitFullscreenIfActive}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition-all shadow-lg hover:scale-105"
            >
              {t.sessionDetails?.backToSession || "العودة للجلسة"}
            </Link>
          </div>
        )}

        {/* Podium Blocks Container */}
        {top3.length > 0 && (
          <div className="flex-1 w-full flex items-end justify-center gap-3 sm:gap-6 md:gap-8 max-w-4xl mx-auto pb-4 sm:pb-8">
            
            {/* 2nd Place - Silver (Rendered left of Gold in standard podiums) */}
            {top3[1] && showPodium && (
              <motion.div
                initial={{ opacity: 0, y: 260 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, type: "spring", bounce: 0.35, delay: 0.4 }}
                className={`flex flex-col items-center z-10 ${getColWidthClass(2)}`}
              >
                {/* Student Name */}
                <div className="text-slate-100 font-extrabold mb-12 sm:mb-16 text-center text-base sm:text-xl md:text-2xl w-full px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] truncate">
                  {top3[1].name}
                </div>

                {/* Silver Pedestal */}
                <div className="w-full bg-gradient-to-t from-slate-700 via-slate-500 to-slate-200 rounded-t-3xl h-44 sm:h-56 md:h-64 flex flex-col items-center justify-start pt-7 sm:pt-8 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.4),0_15px_35px_rgba(0,0,0,0.6)] border-t-2 border-white/60">
                  {/* Medal Icon Badge */}
                  <div className="absolute -top-9 sm:-top-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(148,163,184,0.7)]">
                    <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700" />
                  </div>
                  <span className="text-slate-900 font-black text-4xl sm:text-5xl md:text-6xl mt-3 sm:mt-4 drop-shadow-sm">
                    2
                  </span>
                  <div className="mt-2 sm:mt-3 bg-white/70 text-slate-900 font-black text-sm sm:text-base px-3.5 sm:px-5 py-1 rounded-full backdrop-blur-md shadow-inner flex items-center gap-1">
                    <span>{top3[1].totalScore}</span>
                    <span className="text-xs font-bold text-slate-700">{t.game?.result?.pointsSuffix || "نقطة"}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 1st Place - Gold (Center Champion) */}
            {top3[0] && showPodium && (
              <motion.div
                initial={{ opacity: 0, y: 350 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, type: "spring", bounce: 0.45, delay: 0.8 }}
                className={`flex flex-col items-center z-20 ${getColWidthClass(1)}`}
              >
                {/* Floating Champion Name */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-amber-100 font-black mb-16 sm:mb-20 text-center text-xl sm:text-3xl md:text-4xl w-full px-2 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] truncate"
                >
                  {top3[0].name}
                </motion.div>

                {/* Gold Pedestal */}
                <div className="w-full bg-gradient-to-t from-amber-700 via-amber-500 to-yellow-300 rounded-t-3xl h-60 sm:h-72 md:h-80 flex flex-col items-center justify-start pt-9 sm:pt-11 relative shadow-[inset_0_-10px_25px_rgba(0,0,0,0.4),0_20px_45px_rgba(245,158,11,0.5)] border-t-4 border-amber-100">
                  {/* Glowing Crown Icon Badge */}
                  <div className="absolute -top-12 sm:-top-14 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-yellow-100 via-amber-300 to-amber-500 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-[0_0_45px_rgba(251,191,36,0.9)]">
                    <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/40" />
                    <Crown className="w-12 h-12 sm:w-14 sm:h-14 text-amber-900 drop-shadow-md relative z-10" />
                  </div>
                  <span className="text-amber-950 font-black text-5xl sm:text-7xl md:text-8xl mt-4 sm:mt-5 drop-shadow-sm">
                    1
                  </span>
                  <div className="mt-3 sm:mt-4 bg-white/85 text-amber-950 font-black text-base sm:text-xl px-4 sm:px-6 py-1 sm:py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5">
                    <span>{top3[0].totalScore}</span>
                    <span className="text-xs sm:text-sm font-bold text-amber-900">{t.game?.result?.pointsSuffix || "نقطة"}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3rd Place - Bronze (Rendered right of Gold) */}
            {top3[2] && showPodium && (
              <motion.div
                initial={{ opacity: 0, y: 220 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.2 }}
                className={`flex flex-col items-center z-10 ${getColWidthClass(3)}`}
              >
                {/* Student Name */}
                <div className="text-slate-100 font-extrabold mb-10 sm:mb-14 text-center text-sm sm:text-lg md:text-xl w-full px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] truncate">
                  {top3[2].name}
                </div>

                {/* Bronze Pedestal */}
                <div className="w-full bg-gradient-to-t from-orange-900 via-amber-700 to-amber-500 rounded-t-3xl h-36 sm:h-44 md:h-52 flex flex-col items-center justify-start pt-5 sm:pt-6 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.4),0_15px_30px_rgba(0,0,0,0.6)] border-t-2 border-amber-200/50">
                  {/* Award Icon Badge */}
                  <div className="absolute -top-7 sm:-top-8 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-200 via-orange-400 to-amber-700 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                    <Award className="w-7 h-7 sm:w-8 sm:h-8 text-amber-950" />
                  </div>
                  <span className="text-amber-950 font-black text-3xl sm:text-4xl md:text-5xl mt-3 sm:mt-4 drop-shadow-sm">
                    3
                  </span>
                  <div className="mt-2 bg-white/70 text-amber-950 font-black text-xs sm:text-sm px-3 sm:px-4 py-0.5 rounded-full backdrop-blur-md shadow-inner flex items-center gap-1">
                    <span>{top3[2].totalScore}</span>
                    <span className="text-[10px] font-bold text-amber-900">{t.game?.result?.pointsSuffix || "نقطة"}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <footer className="w-full flex justify-center items-center gap-3 pt-2">
          <Link
            href={`/dashboard/sessions/${session.id}`}
            onClick={exitFullscreenIfActive}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md font-bold text-sm transition-all shadow-md hover:scale-105"
          >
            <span>{t.sessionDetails?.backToSession || "العودة لتفاصيل الجلسة"}</span>
          </Link>
          <Link
            href="/dashboard/sessions"
            onClick={exitFullscreenIfActive}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md font-medium text-sm transition-all shadow-md hover:scale-105"
          >
            <span>{t.sessionDetails?.backToSessions || "قائمة الجلسات"}</span>
          </Link>
        </footer>
      </main>

      {/* Falling Confetti CSS Animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
