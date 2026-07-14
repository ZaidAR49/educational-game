"use client"

import { motion } from "framer-motion"
import { Users, Crown, Medal, Award } from "lucide-react"

type LivePodiumProps = {
  top3: any[]
  totalStudents: number
}

export function LivePodium({ top3, totalStudents }: LivePodiumProps) {
  return (
    <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-800 to-gray-900 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-end relative overflow-hidden h-[450px]">
      {/* Decorative Animated Background */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_4s_ease-in-out_infinite]"></div>
      
      {/* Glowing orb behind first place */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>

      <h2 className="absolute top-8 text-white text-2xl font-black flex items-center gap-2 drop-shadow-md z-20">
        <Crown className="w-6 h-6 text-amber-400" />
        أوائل التحدي
      </h2>

      {totalStudents > 0 ? (
        <div className="flex items-end justify-center gap-2 sm:gap-4 w-full relative z-10 h-64 mt-auto">
          {/* 2nd Place - Silver */}
          {top3[1] && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center w-1/3 group"
            >
              <div className="text-white font-bold mb-6 text-center text-sm truncate w-full group-hover:-translate-y-1 transition-transform">{top3[1].name}</div>
              <div className="w-full bg-gradient-to-t from-slate-400 via-slate-300 to-slate-200 rounded-t-2xl h-32 flex flex-col items-center justify-start pt-6 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.5)] border-t border-white/50">
                <div className="absolute -top-7 w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-300 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(148,163,184,0.5)]">
                  <Medal className="w-6 h-6 text-slate-600" />
                </div>
                <span className="text-slate-800 font-black text-3xl mt-2 drop-shadow-sm">2</span>
                <span className="text-slate-700 font-bold text-sm mt-1 bg-white/30 px-3 py-0.5 rounded-full backdrop-blur-sm shadow-inner">{top3[1].score}</span>
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
              <div className="text-white font-black mb-8 text-center text-lg truncate w-full drop-shadow-md animate-[bounce_2s_ease-in-out_infinite]">{top3[0].name}</div>
              <div className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 rounded-t-2xl h-44 flex flex-col items-center justify-start pt-6 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(245,158,11,0.3)] border-t-2 border-white/60">
                <div className="absolute -top-10 w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-300 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.6)] relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/40"></div>
                  <Crown className="w-10 h-10 text-amber-700 drop-shadow-sm relative z-10" />
                </div>
                <span className="text-amber-900 font-black text-5xl mt-5 drop-shadow-md">1</span>
                <span className="text-amber-900 font-bold mt-2 bg-white/40 px-4 py-1 rounded-full backdrop-blur-sm shadow-inner text-lg">{top3[0].score}</span>
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
              <div className="text-white font-bold mb-6 text-center text-sm truncate w-full group-hover:-translate-y-1 transition-transform">{top3[2].name}</div>
              <div className="w-full bg-gradient-to-t from-orange-600 via-orange-400 to-orange-300 rounded-t-2xl h-24 flex flex-col items-center justify-start pt-5 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.5)] border-t border-white/40">
                <div className="absolute -top-6 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-300 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                  <Award className="w-5 h-5 text-orange-700" />
                </div>
                <span className="text-orange-900 font-black text-2xl mt-2 drop-shadow-sm">3</span>
                <span className="text-orange-800 font-bold text-xs mt-1 bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-inner">{top3[2].score}</span>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
         <div className="text-white/60 font-bold z-10 flex flex-col items-center gap-2">
           <Users className="w-10 h-10 opacity-50" />
           في انتظار انضمام الطلاب...
         </div>
      )}
    </div>
  )
}
