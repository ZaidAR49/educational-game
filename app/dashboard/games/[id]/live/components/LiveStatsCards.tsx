"use client"

import { Users, Trophy, Activity } from "lucide-react"

type LiveStatsCardsProps = {
  activePlayers: number
  totalStudents: number
  avgScore: number
  correctPercentage: number
}

export function LiveStatsCards({ activePlayers, totalStudents, avgScore, correctPercentage }: LiveStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative bg-white rounded-3xl p-6 border border-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.1)] flex items-center gap-4 overflow-hidden group">
        <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-indigo-50 opacity-20 blur-xl animate-pulse pointer-events-none"></div>
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center relative z-10">
          <Users className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-white"></span>
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-gray-500 font-medium mb-1">الطلاب المتصلين</p>
          <h3 className="text-3xl font-black text-gray-900">{activePlayers} <span className="text-lg text-gray-400 font-medium">/ {totalStudents}</span></h3>
        </div>
      </div>
      
      <div className="relative bg-white rounded-3xl p-6 border border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center gap-4 overflow-hidden group">
        <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-3xl animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-emerald-50 opacity-20 blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center relative z-10">
          <Trophy className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-gray-500 font-medium mb-1">متوسط الدرجات</p>
          <h3 className="text-3xl font-black text-gray-900">{avgScore}</h3>
        </div>
      </div>
      
      <div className="relative bg-white rounded-3xl p-6 border border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex items-center gap-4 overflow-hidden group">
        <div className="absolute inset-0 border-2 border-amber-400/30 rounded-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-100 to-amber-50 opacity-20 blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center relative z-10">
          <Activity className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white"></span>
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-gray-500 font-medium mb-1">معدل الإجابات الصحيحة</p>
          <h3 className="text-3xl font-black text-gray-900">{correctPercentage}%</h3>
        </div>
      </div>
    </div>
  )
}
