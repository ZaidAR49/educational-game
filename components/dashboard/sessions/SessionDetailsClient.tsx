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
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <Link 
              href="/dashboard/sessions" 
              className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
              title={t.sessionDetails.backToSessions}
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{t.sessionDetails.title}</h1>
          </div>
          <div className="flex items-center gap-3 text-gray-500 font-medium text-sm rtl:mr-12 ltr:ml-12">
            <span className="text-base text-gray-700 font-bold">{sessionData.gameName}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {new Date(sessionData.date).toLocaleString(isRTL ? 'ar-u-nu-latn' : 'en-US')}
            </div>
          </div>
        </div>

        {players.length > 0 && (
          <Link
            href={`/dashboard/sessions/${sessionData.id}/podium`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Trophy className="w-4 h-4 text-yellow-200" />
            <span>{t.sessionDetails.viewPodium}</span>
          </Link>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-xs sm:text-sm mb-0.5">{t.sessionDetails.participatingStudents}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">{totalPlayers}</h3>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                {t.sessionDetails.completedCount.replace('{count}', String(finishedPlayers))}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-xs sm:text-sm mb-0.5">{t.sessionDetails.avgScore}</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">{avgScore}</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-xs sm:text-sm mb-0.5">{t.sessionDetails.totalCorrect}</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">{totalCorrect}</h3>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-xs sm:text-sm mb-0.5">{t.sessionDetails.totalWrong}</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">{totalWrong}</h3>
          </div>
        </div>
      </div>

      {/* Players Table Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
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
                    <td className="py-2.5 sm:py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                          index === 0 ? 'bg-amber-100 text-amber-700' : 
                          index === 1 ? 'bg-slate-200 text-slate-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-indigo-50 text-indigo-600'
                        }`}>
                          {index < 3 ? <Trophy className="w-4 h-4" /> : player.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base">
                          {player.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 sm:py-3">
                      {player.isFinished ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md text-xs font-bold border border-emerald-100">
                          {t.sessionDetails.statusFinished}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-md text-xs font-bold border border-amber-100">
                          {t.sessionDetails.statusUnfinished}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 sm:py-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md font-bold text-xs sm:text-sm">
                        {player.correctAnswers}
                      </span>
                    </td>
                    <td className="py-2.5 sm:py-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 bg-red-50 text-red-600 rounded-md font-bold text-xs sm:text-sm">
                        {player.wrongAnswers}
                      </span>
                    </td>
                    <td className="py-2.5 sm:py-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500 font-medium text-xs sm:text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(player.durationSeconds)}
                      </div>
                    </td>
                    <td className="py-2.5 sm:py-3 text-end">
                      <span className="text-lg sm:text-xl font-black text-gray-900">
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
