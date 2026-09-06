"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, CalendarDays, Users, Trophy, Target, XCircle, Clock, Search } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

export interface PlayerDetails {
  id: string;
  name: string;
  totalScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  isFinished: boolean;
  durationSeconds: number;
}

export interface SessionData {
  id: string;
  gameName: string;
  date: string;
}

interface SessionDetailsClientProps {
  sessionData: SessionData;
  players: PlayerDetails[];
}

export default function SessionDetailsClient({ sessionData, players }: SessionDetailsClientProps) {
  const { t, isRTL } = useLocale()
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate Metrics
  const totalPlayers = players.length
  const finishedPlayers = players.filter(p => p.isFinished).length
  const avgScore = totalPlayers > 0 ? Math.round(players.reduce((acc, p) => acc + p.totalScore, 0) / totalPlayers) : 0
  const totalCorrect = players.reduce((acc, p) => acc + p.correctAnswers, 0)
  const totalWrong = players.reduce((acc, p) => acc + p.wrongAnswers, 0)

  // Filter players
  const filteredPlayers = players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Helper to format duration
  const formatDuration = (seconds: number) => {
    if (!seconds) return "--"
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}${isRTL ? "د" : "m"} ${s}${isRTL ? "ث" : "s"}`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboard/sessions" 
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
              title={t.sessionDetails.backToSessions}
            >
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </Link>
            <h1 className="text-3xl font-black text-gray-900">{t.sessionDetails.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-gray-500 font-medium rtl:mr-14 ltr:ml-14">
            <span className="text-lg text-gray-700 font-bold">{sessionData.gameName}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {new Date(sessionData.date).toLocaleString(isRTL ? 'ar-u-nu-latn' : 'en-US')}
            </div>
          </div>
        </div>

        {players.length > 0 && (
          <Link
            href={`/dashboard/sessions/${sessionData.id}/podium`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-3 rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Trophy className="w-5 h-5 text-yellow-200" />
            <span>{t.sessionDetails.viewPodium}</span>
          </Link>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">{t.sessionDetails.participatingStudents}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-gray-900">{totalPlayers}</h3>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">
                {t.sessionDetails.completedCount.replace('{count}', String(finishedPlayers))}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">{t.sessionDetails.avgScore}</p>
            <h3 className="text-2xl font-black text-gray-900">{avgScore}</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">{t.sessionDetails.totalCorrect}</p>
            <h3 className="text-2xl font-black text-gray-900">{totalCorrect}</h3>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <XCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">{t.sessionDetails.totalWrong}</p>
            <h3 className="text-2xl font-black text-gray-900">{totalWrong}</h3>
          </div>
        </div>
      </div>

      {/* Players Table Section */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            {t.sessionDetails.tableTitle}
          </h2>
          
          <div className="relative w-full md:w-72">
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <input 
              type="text" 
              placeholder={t.sessionDetails.searchPlayer} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 ${
                isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-500 text-sm text-start">{t.sessionDetails.thStudentName}</th>
                <th className="pb-4 font-bold text-gray-500 text-sm text-start">{t.sessionDetails.thStatus}</th>
                <th className="pb-4 font-bold text-gray-500 text-sm text-center">{t.sessionDetails.thCorrect}</th>
                <th className="pb-4 font-bold text-gray-500 text-sm text-center">{t.sessionDetails.thWrong}</th>
                <th className="pb-4 font-bold text-gray-500 text-sm text-center">{t.sessionDetails.thDuration}</th>
                <th className="pb-4 font-black text-gray-800 text-end">{t.sessionDetails.thScore}</th>
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
                          {t.sessionDetails.statusFinished}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100">
                          {t.sessionDetails.statusUnfinished}
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
                    <td className="py-4 text-end">
                      <span className="text-xl font-black text-gray-900">
                        {player.totalScore}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    {t.sessionDetails.noPlayersFound}
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
