"use client"

import { Users, Trophy, Activity } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

type LiveStatsCardsProps = {
  activePlayers: number
  totalStudents: number
  avgScore: number
  correctPercentage: number
}

export function LiveStatsCards({ activePlayers, totalStudents, avgScore, correctPercentage }: LiveStatsCardsProps) {
  const { t } = useLocale()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.08)] flex items-center gap-3.5 overflow-hidden group">
        <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-2xl animate-pulse pointer-events-none"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-indigo-50 opacity-20 blur-xl animate-pulse pointer-events-none"></div>
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 relative z-10">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 border-2 border-white"></span>
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-0.5">{t.liveSession.connectedStudents}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{activePlayers} <span className="text-sm sm:text-base text-gray-400 font-medium">/ {totalStudents}</span></h3>
        </div>
      </div>
      
      <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.08)] flex items-center gap-3.5 overflow-hidden group">
        <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-2xl animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-emerald-50 opacity-20 blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 relative z-10">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-0.5">{t.liveSession.avgScore}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{avgScore}</h3>
        </div>
      </div>
      
      <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.08)] flex items-center gap-3.5 overflow-hidden group">
        <div className="absolute inset-0 border-2 border-amber-400/30 rounded-2xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-100 to-amber-50 opacity-20 blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 relative z-10">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border-2 border-white"></span>
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-0.5">{t.liveSession.correctRate}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{correctPercentage}%</h3>
        </div>
      </div>
    </div>
  )
}
