import { Search } from "lucide-react"

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
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="البحث برقم الجلسة أو اسم اللعبة..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-gray-700"
        />
      </div>

      {/* Game Filter */}
      <div className="w-full md:w-64">
        <select 
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700 cursor-pointer appearance-none"
        >
          {games.map(game => (
            <option key={game} value={game}>{game}</option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="w-full md:w-48">
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700 cursor-pointer appearance-none"
        >
          <option value="newest">الأحدث أولاً</option>
          <option value="oldest">الأقدم أولاً</option>
        </select>
      </div>
    </div>
  )
}
