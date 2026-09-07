"use client"

import { motion } from "framer-motion"
import { Users, Crown, Medal, Award } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

type LivePodiumProps = {
  top3: any[]
  totalStudents: number
}

export function LivePodium({ top3, totalStudents }: LivePodiumProps) {
  const { t } = useLocale()

  return (
    <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-800 to-gray-900 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col items-center justify-end relative overflow-hidden h-[370px] lg:h-[390px]">
      {/* Decorative Animated Background */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_4s_ease-in-out_infinite]"></div>
      
      {/* Glowing orb behind first place */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>

      <h2 className="absolute top-4 sm:top-5 text-white text-lg sm:text-xl font-black flex items-center gap-2 drop-shadow-md z-20">
        <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
        <span>{t.liveSession.challengeLeaders}</span>
      </h2>

      {totalStudents > 0 ? (
        <div className="flex items-end justify-center gap-2 sm:gap-3.5 w-full relative z-10 h-52 sm:h-56 mt-auto">
          {/* 2nd Place - Silver */}
          {top3[1] && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center w-1/3 group"
            >
              <div className="text-white font-bold mb-4 text-center text-xs sm:text-sm truncate w-full group-hover:-translate-y-1 transition-transform">{top3[1].name}</div>
              <div className="w-full bg-gradient-to-t from-slate-400 via-slate-300 to-slate-200 rounded-t-xl sm:rounded-t-2xl h-28 sm:h-32 flex flex-col items-center justify-start pt-4 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.5)] border-t border-white/50">
                <div className="absolute -top-5 sm:-top-6 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-100 to-slate-300 rounded-full border-3 sm:border-4 border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(148,163,184,0.5)]">
                  <Medal className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-slate-800 font-black text-2xl sm:text-3xl mt-1 drop-shadow-sm">2</span>
                <span className="text-slate-700 font-bold text-xs sm:text-sm mt-0.5 bg-white/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-inner">{top3[1].score}</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place - Gold */}
          {top3[0] && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-1/3 z-20"
            >
              <div className="text-white font-black mb-5 sm:mb-6 text-center text-sm sm:text-base truncate w-full drop-shadow-md animate-[bounce_2s_ease-in-out_infinite]">{top3[0].name}</div>
              <div className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 rounded-t-xl sm:rounded-t-2xl h-38 sm:h-42 flex flex-col items-center justify-start pt-5 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(245,158,11,0.3)] border-t-2 border-white/60">
                <div className="absolute -top-7 sm:-top-8 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-100 to-amber-300 rounded-full border-3 sm:border-4 border-slate-900 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.6)] relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/40"></div>
                  <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-amber-700 drop-shadow-sm relative z-10" />
                </div>
                <span className="text-amber-900 font-black text-3xl sm:text-4xl mt-3 sm:mt-4 drop-shadow-md">1</span>
                <span className="text-amber-900 font-bold mt-1 bg-white/40 px-3 py-0.5 rounded-full backdrop-blur-sm shadow-inner text-xs sm:text-sm">{top3[0].score}</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place - Bronze */}
          {top3[2] && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center w-1/3 group"
            >
              <div className="text-white font-bold mb-4 text-center text-xs sm:text-sm truncate w-full group-hover:-translate-y-1 transition-transform">{top3[2].name}</div>
              <div className="w-full bg-gradient-to-t from-orange-600 via-orange-400 to-orange-300 rounded-t-xl sm:rounded-t-2xl h-20 sm:h-24 flex flex-col items-center justify-start pt-3 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.5)] border-t border-white/40">
                <div className="absolute -top-5 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-orange-100 to-orange-300 rounded-full border-3 sm:border-4 border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700" />
                </div>
                <span className="text-orange-900 font-black text-xl sm:text-2xl mt-1 drop-shadow-sm">3</span>
                <span className="text-orange-800 font-bold text-xs mt-0.5 bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-inner">{top3[2].score}</span>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
         <div className="text-white/60 font-bold z-10 flex flex-col items-center gap-2">
           <Users className="w-8 h-8 opacity-50" />
           <span className="text-sm sm:text-base">{t.liveSession.waitingStudents}</span>
         </div>
      )}
    </div>
  )
}
