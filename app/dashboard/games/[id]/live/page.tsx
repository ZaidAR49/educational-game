"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Users, Activity, Trophy, Medal, Award, Crown, CheckCircle2, XCircle } from "lucide-react"

// Mock real-time data for students
const MOCK_STUDENTS = [
  { id: 1, name: "أحمد محمد", score: 950, correct: 9, wrong: 1, isConnected: true },
  { id: 2, name: "سارة خالد", score: 880, correct: 8, wrong: 2, isConnected: true },
  { id: 3, name: "عمر عبدالله", score: 820, correct: 8, wrong: 2, isConnected: true },
  { id: 4, name: "نورة سعد", score: 750, correct: 7, wrong: 3, isConnected: true },
  { id: 5, name: "فهد عبدالعزيز", score: 640, correct: 6, wrong: 4, isConnected: false },
  { id: 6, name: "ريم طارق", score: 580, correct: 5, wrong: 5, isConnected: true },
  { id: 7, name: "يوسف علي", score: 420, correct: 4, wrong: 6, isConnected: true },
]

export default function LiveSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [students, setStudents] = useState(MOCK_STUDENTS)

  // Sort students by score descending
  const sortedStudents = [...students].sort((a, b) => b.score - a.score)
  const top3 = sortedStudents.slice(0, 3)
  const others = sortedStudents.slice(3)

  const activePlayers = students.filter(s => s.isConnected).length
  const avgScore = Math.round(students.reduce((acc, curr) => acc + curr.score, 0) / students.length)

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboard/games" 
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-black text-gray-900">الجلسة المباشرة</h1>
            <div className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold ml-4">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </div>
              مباشر الآن
            </div>
          </div>
          <p className="text-gray-500 mr-14">
            تحدي الثقافة العامة (ID: {id})
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">الطلاب المتصلين</p>
            <h3 className="text-3xl font-black text-gray-900">{activePlayers} <span className="text-lg text-gray-400 font-medium">/ {students.length}</span></h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">متوسط الدرجات</p>
            <h3 className="text-3xl font-black text-gray-900">{avgScore}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">معدل الإجابات الصحيحة</p>
            <h3 className="text-3xl font-black text-gray-900">72%</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Podium (Top 3) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center justify-end relative overflow-hidden h-[450px]">
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          
          <h2 className="absolute top-8 text-white text-2xl font-black flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            أوائل التحدي
          </h2>

          <div className="flex items-end justify-center gap-4 w-full relative z-10 h-64 mt-auto">
            {/* 2nd Place - Silver */}
            {top3[1] && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center w-1/3"
              >
                <div className="text-white font-bold mb-8 text-center text-sm truncate w-full">{top3[1].name}</div>
                <div className="w-full bg-slate-300 rounded-t-xl h-32 flex flex-col items-center justify-start pt-4 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)]">
                  <div className="absolute -top-6 w-12 h-12 bg-slate-200 rounded-full border-4 border-gray-800 flex items-center justify-center shadow-lg">
                    <Medal className="w-6 h-6 text-slate-500" />
                  </div>
                  <span className="text-slate-700 font-black text-2xl mt-4">2</span>
                  <span className="text-slate-600 font-bold text-sm mt-1">{top3[1].score}</span>
                </div>
              </motion.div>
            )}

            {/* 1st Place - Gold */}
            {top3[0] && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center w-1/3 z-10"
              >
                <div className="text-white font-bold mb-10 text-center text-lg truncate w-full">{top3[0].name}</div>
                <div className="w-full bg-amber-400 rounded-t-xl h-44 flex flex-col items-center justify-start pt-4 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)]">
                  <div className="absolute -top-8 w-16 h-16 bg-amber-300 rounded-full border-4 border-gray-800 flex items-center justify-center shadow-lg">
                    <Crown className="w-8 h-8 text-amber-700" />
                  </div>
                  <span className="text-amber-800 font-black text-4xl mt-6">1</span>
                  <span className="text-amber-700 font-bold mt-1">{top3[0].score}</span>
                </div>
              </motion.div>
            )}

            {/* 3rd Place - Bronze */}
            {top3[2] && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center w-1/3"
              >
                <div className="text-white font-bold mb-8 text-center text-sm truncate w-full">{top3[2].name}</div>
                <div className="w-full bg-orange-300 rounded-t-xl h-24 flex flex-col items-center justify-start pt-4 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)]">
                  <div className="absolute -top-6 w-12 h-12 bg-orange-200 rounded-full border-4 border-gray-800 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-orange-800 font-black text-2xl mt-4">3</span>
                  <span className="text-orange-700 font-bold text-sm mt-1">{top3[2].score}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">ترتيب الطلاب</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {sortedStudents.map((student, index) => (
              <motion.div 
                key={student.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${
                  index === 0 ? 'bg-amber-50 border-amber-200' : 
                  index === 1 ? 'bg-slate-50 border-slate-200' : 
                  index === 2 ? 'bg-orange-50 border-orange-200' : 
                  'bg-white border-gray-100'
                }`}
              >
                {/* Rank Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  index === 0 ? 'bg-amber-400 text-white' : 
                  index === 1 ? 'bg-slate-400 text-white' : 
                  index === 2 ? 'bg-orange-400 text-white' : 
                  'bg-gray-100 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                
                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 truncate">{student.name}</h4>
                    {!student.isConnected && (
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">غير متصل</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium mt-1">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {student.correct} صح
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="w-3.5 h-3.5" />
                      {student.wrong} خطأ
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="shrink-0 text-right">
                  <div className="text-xl font-black text-gray-900">{student.score}</div>
                  <div className="text-xs text-gray-400 font-medium">نقطة</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
