import Link from "next/link"
import { Settings2, Trash2, Play, Users, Trophy, Share2, Power, PowerOff, FileQuestion } from "lucide-react"
import { Game } from "./types"

interface GameCardProps {
  game: Game
  onToggleStatus: (id: string) => void
  onShare: (game: Game) => void
  onDelete: (game: Game) => void
}

export function GameCard({ game, onToggleStatus, onShare, onDelete }: GameCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
            {game.icon}
          </div>
          <div className="flex items-center gap-2">
            {game.status === 'published' ? (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                منشورة
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                مسودة
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{game.title}</h3>
          {game.organizationName && (
            <div className="flex items-center gap-1.5 mt-1.5 text-indigo-500 font-bold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>مقدمة من: {game.organizationName}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {game.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-gray-500 bg-gray-50/50 p-2 sm:p-3 rounded-2xl">
          <div className="relative group/stat flex items-center gap-1.5 cursor-help hover:bg-gray-200/50 p-1 -m-1 rounded-lg transition-colors">
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
            <span>{game.playCount.toLocaleString()}</span>
            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover/stat:opacity-100 transition-all shadow-lg pointer-events-none z-10 whitespace-nowrap translate-y-1 group-hover/stat:translate-y-0">
              عدد مرات اللعب
              <div className="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>

          <div className="w-1 h-1 rounded-full bg-gray-300"></div>

          <div className="relative group/stat flex items-center gap-1.5 cursor-help hover:bg-gray-200/50 p-1 -m-1 rounded-lg transition-colors">
            <FileQuestion className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
            <span>{game.questionsCount}</span>
            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover/stat:opacity-100 transition-all shadow-lg pointer-events-none z-10 whitespace-nowrap translate-y-1 group-hover/stat:translate-y-0">
              عدد الأسئلة في اللعبة
              <div className="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>

          <div className="w-1 h-1 rounded-full bg-gray-300"></div>

          <div className="relative group/stat flex items-center gap-1.5 cursor-help hover:bg-gray-200/50 p-1 -m-1 rounded-lg transition-colors">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <span>{game.playCount > 0 ? "85%" : "0%"}</span>
            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover/stat:opacity-100 transition-all shadow-lg pointer-events-none z-10 whitespace-nowrap translate-y-1 group-hover/stat:translate-y-0">
              متوسط نسبة النجاح
              <div className="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-50 p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 bg-gray-50/50">
        <div className="flex gap-1.5 sm:gap-2">
          <Link 
            href={`/game/${game.id}?preview=true`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xl:inline">تجربة</span>
          </Link>
          <Link 
            href={`/dashboard/games/${game.id}/edit`} 
            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm"
          >
            <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xl:inline">تعديل</span>
          </Link>
          <button 
            onClick={() => onDelete(game)}
            title="حذف اللعبة"
            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-red-500 hover:text-red-600 hover:bg-red-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xl:inline">حذف</span>
          </button>
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          <button 
            onClick={() => onShare(game)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xl:inline">مشاركة</span>
          </button>
          {game.status === 'published' ? (
            <Link 
              href={`/dashboard/games/${game.id}/live`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 hover:text-purple-600 hover:bg-purple-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xl:inline">مباشر</span>
            </Link>
          ) : (
            <button 
              disabled
              title="يجب بدء اللعبة أولاً"
              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-400 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-gray-100 shadow-sm cursor-not-allowed opacity-75"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xl:inline">مباشر</span>
            </button>
          )}
          <button 
            onClick={() => onToggleStatus(game.id)}
            title={game.status === 'published' ? 'إنهاء اللعبة' : 'بدء اللعبة'}
            className={`flex-1 flex items-center justify-center gap-1.5 bg-white py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm ${
              game.status === 'published' ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {game.status === 'published' ? (
              <>
                <PowerOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xl:inline">إنهاء</span>
              </>
            ) : (
              <>
                <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xl:inline">بدء</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
