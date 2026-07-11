import Link from "next/link"
import { History, CalendarDays, Users, CheckCircle2 } from "lucide-react"
import { useLongPress } from "@/lib/hooks/use-long-press"
import { Session } from "./types"

interface SessionCardProps {
  session: Session
  isSelected: boolean
  isSelectionMode: boolean
  onToggleSelection: (id: string) => void
}

export function SessionCard({ session, isSelected, isSelectionMode, onToggleSelection }: SessionCardProps) {
  const longPressProps = useLongPress(
    (e) => {
      e?.preventDefault()
      onToggleSelection(session.id)
    },
    (e) => {
      if (isSelectionMode) {
        onToggleSelection(session.id)
      }
    },
    { delay: 500, shouldPreventDefault: false }
  )

  const handleLinkEvents = (e: React.SyntheticEvent) => {
    e.stopPropagation()
  }

  return (
    <div 
      {...longPressProps}
      className={`bg-white rounded-3xl border-2 transition-all shadow-sm overflow-hidden flex flex-col cursor-pointer select-none ${isSelected ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'}`}
    >
      <div className="p-6 flex-1 flex flex-col relative">
        
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-6 left-6 z-10 animate-in fade-in zoom-in duration-200">
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 bg-white'}`}>
              {isSelected && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4 pr-2">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{session.gameName}</h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-50">
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
              <CalendarDays className="w-4 h-4 text-emerald-500" />
              <span>{new Date(session.date).toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
              <Users className="w-4 h-4 text-blue-500" />
              <span>{session.playersCount} طلاب</span>
            </div>
          </div>
          
          <Link 
            href={`/dashboard/sessions/${session.id}`}
            onClick={handleLinkEvents}
            onMouseDown={handleLinkEvents}
            onTouchStart={handleLinkEvents}
            className="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
          >
            عرض التفاصيل
          </Link>
        </div>

      </div>
    </div>
  )
}
