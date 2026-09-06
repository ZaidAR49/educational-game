"use client"

import { useState, useMemo, useEffect, useTransition } from "react"
import { History, Info, ChevronRight, ChevronLeft, CheckCircle2, Trash2, Loader2 } from "lucide-react"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { Session } from "@/components/sessions/types"
import { SessionCard } from "@/components/sessions/SessionCard"
import { SessionFilters } from "@/components/sessions/SessionFilters"
import { deleteSessionsAction } from "@/lib/actions/sessions.actions"
import { useLocale } from "@/lib/i18n/LanguageContext"

const ITEMS_PER_PAGE = 9

interface SessionsClientProps {
  initialSessions: Session[];
}

export default function SessionsClient({ initialSessions }: SessionsClientProps) {
  const { t, isRTL } = useLocale()
  const s = t.sessionsDashboard

  const PrevPageIcon = isRTL ? ChevronRight : ChevronLeft
  const NextPageIcon = isRTL ? ChevronLeft : ChevronRight

  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [searchQuery, setSearchQuery] = useState("")
  const [gameFilter, setGameFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedSessions, setSelectedSessions] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Update sessions if initial data changes (e.g. after server action refetch)
  useEffect(() => {
    setSessions(initialSessions)
  }, [initialSessions])

  // Get unique game names for filter
  const GAMES = useMemo(() => {
    const names = new Set(initialSessions.map(sess => sess.gameName))
    return ["ALL", ...Array.from(names)]
  }, [initialSessions])

  const filteredSessions = useMemo(() => {
    let result = sessions

    if (searchQuery) {
      result = result.filter(sess => sess.gameName.includes(searchQuery) || sess.id.includes(searchQuery))
    }

    if (gameFilter !== "ALL") {
      result = result.filter(sess => sess.gameName === gameFilter)
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })

    return result
  }, [sessions, searchQuery, gameFilter, sortBy])

  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE)
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [filteredSessions.length, totalPages, currentPage])

  const toggleSelection = (id: string) => {
    setSelectedSessions(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedSessions.length === paginatedSessions.length) {
      setSelectedSessions(prev => prev.filter(id => !paginatedSessions.find(sess => sess.id === id)))
    } else {
      const newSelected = new Set(selectedSessions)
      paginatedSessions.forEach(sess => newSelected.add(sess.id))
      setSelectedSessions(Array.from(newSelected))
    }
  }

  const handleDeleteSelected = () => {
    startTransition(async () => {
      await deleteSessionsAction(selectedSessions);
      setSelectedSessions([])
      setShowDeleteModal(false)
    })
  }

  const isAllCurrentPageSelected = paginatedSessions.length > 0 && paginatedSessions.every(sess => selectedSessions.includes(sess.id))

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Header & Notice */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
              <History className="w-8 h-8 text-indigo-600" />
              <span>{s.title}</span>
            </h1>
            <p className="text-gray-500">
              {s.subtitle}
            </p>
          </div>
          
          {selectedSessions.length > 0 && (
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={isPending}
              className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all shadow-sm border border-red-100 shrink-0"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              <span>{s.deleteSelected.replace("{count}", selectedSessions.length.toString())}</span>
            </button>
          )}
        </div>

        {/* Retention Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">
            {s.retentionNotice}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <SessionFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        gameFilter={gameFilter}
        setGameFilter={setGameFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        games={GAMES}
      />

      {/* Select All Row */}
      {paginatedSessions.length > 0 && selectedSessions.length > 0 && (
        <div className="flex items-center gap-3 px-2">
          <button 
            onClick={toggleAll}
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isAllCurrentPageSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 bg-white hover:border-indigo-400'}`}
          >
            {isAllCurrentPageSelected && <CheckCircle2 className="w-4 h-4" />}
          </button>
          <span className="text-sm font-bold text-gray-600 cursor-pointer select-none" onClick={toggleAll}>
            {s.selectAllPage}
          </span>
        </div>
      )}

      {/* Sessions Grid */}
      {paginatedSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              isSelected={selectedSessions.includes(session.id)}
              isSelectionMode={selectedSessions.length > 0}
              onToggleSelection={toggleSelection}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
            <History className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{s.emptyTitle}</h3>
          <p className="text-gray-500 max-w-sm">{s.emptyDesc}</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <PrevPageIcon className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold transition-colors ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <NextPageIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <ConfirmModal 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteSelected}
          title={s.deleteModalTitle}
          description={s.deleteModalDesc.replace("{count}", selectedSessions.length.toString())}
          confirmText={isPending ? (t.common?.saving || (isRTL ? "جاري الحذف..." : "Deleting...")) : s.confirmDelete}
          cancelText={t.common?.cancel || (isRTL ? "إلغاء" : "Cancel")}
          type="danger"
        />
      )}
    </div>
  )
}
