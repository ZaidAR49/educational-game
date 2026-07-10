"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight, CalendarDays, Users, Trophy, Target, XCircle, Clock, Search, Filter } from "lucide-react"

// Generate mock players for a session
const generateMockPlayers = () => {
  const names = ["أحمد محمد", "سارة خالد", "عمر عبدالله", "نورة سعد", "فهد عبدالعزيز", "ريم طارق", "خالد يوسف", "مها علي", "سعود الدوسري", "ليلى العتيبي"]
  
  return Array.from({ length: 15 }).map((_, i) => {
    const totalQuestions = 20
    const correct = Math.floor(Math.random() * (totalQuestions + 1))
    const wrong = totalQuestions - correct
    const score = correct * 100
    const duration = Math.floor(Math.random() * 300) + 60 // 60s to 360s
    const isFinished = Math.random() > 0.1 // 90% finished
    
    return {
      id: `player-${i + 1}`,
      name: names[Math.floor(Math.random() * names.length)] + (i > 9 ? ` ${i}` : ""),
      totalScore: score,
      correctAnswers: correct,
      wrongAnswers: wrong,
      durationSeconds: duration,
      isFinished: isFinished,
    }
  })
}

export default function SessionDetailsPage() {
  const params = useParams()
  const sessionId = params.id as string

  const [players, setPlayers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Mock Session Metadata
  const sessionData = {
    id: sessionId,
    gameName: "تحدي الثقافة العامة",
    date: new Date().toISOString(),
  }

  useEffect(() => {
    setPlayers(generateMockPlayers().sort((a, b) => b.totalScore - a.totalScore))
  }, [])

  // Calculate Metrics
  const totalPlayers = players.length
  const finishedPlayers = players.filter(p => p.isFinished).length
  const avgScore = totalPlayers > 0 ? Math.round(players.reduce((acc, p) => acc + p.totalScore, 0) / totalPlayers) : 0
  const totalCorrect = players.reduce((acc, p) => acc + p.correctAnswers, 0)
  const totalWrong = players.reduce((acc, p) => acc + p.wrongAnswers, 0)

  // Filter players
  const filteredPlayers = players.filter(p => p.name.includes(searchQuery))

  // Helper to format duration
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}د ${s}ث`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboard/sessions" 
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-black text-gray-900">تفاصيل الجلسة</h1>
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold ml-4 border border-gray-200">
              ID: {sessionData.id}
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500 font-medium mr-14">
            <span className="text-lg text-gray-700 font-bold">{sessionData.gameName}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {new Date(sessionData.date).toLocaleString('ar-SA')}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">الطلاب المشاركين</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-gray-900">{totalPlayers}</h3>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{finishedPlayers} أكملوا</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">متوسط الدرجات</p>
            <h3 className="text-2xl font-black text-gray-900">{avgScore}</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">إجمالي الإجابات الصحيحة</p>
            <h3 className="text-2xl font-black text-gray-900">{totalCorrect}</h3>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">إجمالي الإجابات الخاطئة</p>
            <h3 className="text-2xl font-black text-gray-900">{totalWrong}</h3>
          </div>
        </div>
      </div>

      {/* Players Table Section */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            نتائج الطلاب
          </h2>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="البحث عن طالب..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-500 text-sm">اسم الطالب</th>
                <th className="pb-4 font-bold text-gray-500 text-sm">الحالة</th>
                <th className="pb-4 font-bold text-gray-500 text-sm text-center">الإجابات الصحيحة</th>
                <th className="pb-4 font-bold text-gray-500 text-sm text-center">الإجابات الخاطئة</th>
                <th className="pb-4 font-bold text-gray-500 text-sm text-center">مدة اللعب</th>
                <th className="pb-4 font-black text-gray-800 text-left">النتيجة النهائية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <tr key={player.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-amber-100 text-amber-700' : 
                          index === 1 ? 'bg-slate-200 text-slate-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-indigo-50 text-indigo-600'
                        }`}>
                          {index < 3 ? <Trophy className="w-5 h-5" /> : player.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {player.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      {player.isFinished ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                          أكمل
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100">
                          قيد اللعب
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-sm">
                        {player.correctAnswers}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-lg font-bold text-sm">
                        {player.wrongAnswers}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-500 font-medium text-sm">
                        <Clock className="w-4 h-4" />
                        {formatDuration(player.durationSeconds)}
                      </div>
                    </td>
                    <td className="py-4 text-left">
                      <span className="text-xl font-black text-gray-900">
                        {player.totalScore}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    لم يتم العثور على أي طلاب مطابقين للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
