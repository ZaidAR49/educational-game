"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Crown, Medal, Award, ArrowRight, Trophy } from "lucide-react"
import { createConfettiPieces, type ConfettiPiece } from "@/lib/game"

export default function PodiumClient({ session, players }: { session: any, players: any[] }) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [showPodium, setShowPodium] = useState(false)

  // Sort students by score descending, then by duration ascending
  const sortedStudents = [...players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return (a.durationSeconds || Infinity) - (b.durationSeconds || Infinity);
  })
  const top3 = sortedStudents.slice(0, 3)

  useEffect(() => {
    // Slight delay before showing podium for dramatic effect
    const timer = setTimeout(() => {
      setShowPodium(true)
      
      // Fire confetti if we have at least one player
      if (top3.length > 0) {
        setConfetti(createConfettiPieces())
        
        // Second burst for more excitement
        setTimeout(() => {
          setConfetti(prev => [...prev, ...createConfettiPieces()])
        }, 800)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [top3.length])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans" dir="rtl">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm z-50 pointer-events-none"
          style={{
            top: "-20px",
            left: piece.left,
            backgroundColor: piece.color,
            animationName: 'confetti-fall',
            animationDuration: piece.duration,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationDelay: piece.delay,
          }}
        />
      ))}
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_4s_ease-in-out_infinite]"></div>
      
      {/* Glowing Orb */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none z-0"
      />

      <div className="z-10 w-full max-w-5xl px-4 flex flex-col h-screen py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] mb-4">
            تتويج الأبطال
          </h1>
          <p className="text-indigo-200 text-xl font-bold flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            {session.gameName}
          </p>
        </motion.div>

        {/* Podium Area */}
        <div className="flex-1 flex items-end justify-center gap-4 sm:gap-8 max-w-4xl mx-auto w-full pb-10">
          
          {/* 2nd Place - Silver */}
          {top3[1] && showPodium && (
            <motion.div 
              initial={{ opacity: 0, y: 300 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4, delay: 0.5 }}
              className="flex flex-col items-center w-1/3 z-10"
            >
              <div className="text-white font-bold mb-16 text-center text-xl md:text-2xl w-full px-2 drop-shadow-md break-words line-clamp-2">
                {top3[1].name}
              </div>
              <div className="w-full bg-gradient-to-t from-slate-600 via-slate-400 to-slate-200 rounded-t-3xl h-48 md:h-64 flex flex-col items-center justify-start pt-8 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.4),0_10px_30px_rgba(0,0,0,0.5)] border-t-2 border-white/50">
                <div className="absolute -top-10 w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-400 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(148,163,184,0.6)]">
                  <Medal className="w-10 h-10 text-slate-700" />
                </div>
                <span className="text-slate-900 font-black text-5xl md:text-6xl mt-4 drop-shadow-sm">2</span>
                <span className="text-slate-800 font-bold text-lg mt-3 bg-white/40 px-5 py-1 rounded-full backdrop-blur-sm shadow-inner">{top3[1].totalScore}</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place - Gold */}
          {top3[0] && showPodium && (
            <motion.div 
              initial={{ opacity: 0, y: 400 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.5, delay: 1 }}
              className="flex flex-col items-center w-1/3 z-20"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-white font-black mb-20 text-center text-2xl md:text-4xl w-full px-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] break-words line-clamp-2"
              >
                {top3[0].name}
              </motion.div>
              <div className="w-full bg-gradient-to-t from-amber-700 via-amber-500 to-yellow-300 rounded-t-3xl h-64 md:h-80 flex flex-col items-center justify-start pt-10 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.4),0_10px_40px_rgba(245,158,11,0.5)] border-t-4 border-white/70">
                <div className="absolute -top-14 w-28 h-28 bg-gradient-to-br from-yellow-100 to-amber-400 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.8)] relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/50"></div>
                  <Crown className="w-14 h-14 text-amber-800 drop-shadow-md relative z-10" />
                </div>
                <span className="text-amber-900 font-black text-6xl md:text-8xl mt-6 drop-shadow-md">1</span>
                <span className="text-amber-900 font-black text-xl mt-4 bg-white/50 px-6 py-1.5 rounded-full backdrop-blur-sm shadow-inner">{top3[0].totalScore}</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place - Bronze */}
          {top3[2] && showPodium && (
            <motion.div 
              initial={{ opacity: 0, y: 250 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.3, delay: 0.2 }}
              className="flex flex-col items-center w-1/3 z-10"
            >
              <div className="text-white font-bold mb-14 text-center text-lg md:text-xl w-full px-2 drop-shadow-md break-words line-clamp-2">
                {top3[2].name}
              </div>
              <div className="w-full bg-gradient-to-t from-orange-800 via-orange-600 to-orange-400 rounded-t-3xl h-36 md:h-52 flex flex-col items-center justify-start pt-6 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.5)] border-t-2 border-white/40">
                <div className="absolute -top-8 w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                  <Award className="w-8 h-8 text-orange-900" />
                </div>
                <span className="text-orange-900 font-black text-4xl md:text-5xl mt-4 drop-shadow-sm">3</span>
                <span className="text-orange-900 font-bold text-base mt-2 bg-white/30 px-4 py-1 rounded-full backdrop-blur-sm shadow-inner">{top3[2].totalScore}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="mt-auto flex justify-center pb-8"
        >
          <Link 
            href="/dashboard/sessions"
            className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-4 rounded-2xl font-bold transition-all duration-300 border border-white/10 hover:border-white/30 hover:scale-105"
          >
            العودة إلى سجل الجلسات
            <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

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
