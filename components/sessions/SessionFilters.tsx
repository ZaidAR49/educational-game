"use client"

import { Search } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

interface SessionFiltersProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  gameFilter: string
  setGameFilter: (val: string) => void
  sortBy: string
  setSortBy: (val: string) => void
  games: string[]
}

export function SessionFilters({
  searchQuery, setSearchQuery,
  gameFilter, setGameFilter,
  sortBy, setSortBy,
  games
}: SessionFiltersProps) {
  const { t, isRTL } = useLocale()
  const s = t.sessionsDashboard

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
        <input 
          type="text" 
          placeholder={s.searchPlaceholder} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-gray-700`}
        />
      </div>

      {/* Game Filter */}
      <div className="w-full md:w-64">
        <select 
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700 cursor-pointer"
        >
          {games.map(game => (
            <option key={game} value={game}>
              {game === "ALL" ? s.allGames : game}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="w-full md:w-48">
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700 cursor-pointer"
        >
          <option value="newest">{s.newestFirst}</option>
          <option value="oldest">{s.oldestFirst}</option>
        </select>
      </div>
    </div>
  )
}
