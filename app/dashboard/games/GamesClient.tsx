"use client"

import { useState, useEffect, useTransition } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { Game } from "@/components/games/types"
import { GameCard } from "@/components/games/GameCard"
import { GameShareModal } from "@/components/games/GameShareModal"
import { toast } from "sonner"
import { toggleGamePublishStatusAction, deleteGameAction } from "@/lib/actions/games.actions"
import { PaginationControls } from "@/components/shared/PaginationControls"
import { SearchAndFilter } from "@/components/shared/SearchAndFilter"

interface GamesClientProps {
  initialGames: Game[]
  totalPages: number
  currentPage: number
  showSearchAndFilter: boolean
}

export function GamesClient({ initialGames, totalPages, currentPage, showSearchAndFilter }: GamesClientProps) {
  const [shareGame, setShareGame] = useState<Game | null>(null)
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleGameStatus = (id: string) => {
    const game = initialGames.find(g => g.id === id);
    if (!game) return;

    startTransition(async () => {
      try {
        const isPublishing = game.status === 'draft';
        await toggleGamePublishStatusAction(id, isPublishing);
      } catch (error) {
        console.error("Failed to update status:", error);
        toast.error("حدث خطأ أثناء تحديث حالة اللعبة");
      }
    });
  }

  const handleDelete = () => {
    if (!gameToDelete) return;
    
    startTransition(async () => {
      try {
        await deleteGameAction(gameToDelete.id);
        setGameToDelete(null);
        toast.success("تم حذف اللعبة بنجاح");
      } catch (error) {
        console.error("Failed to delete game:", error);
        toast.error("حدث خطأ أثناء حذف اللعبة");
      }
    });
  }

  const initiateDelete = (game: Game) => {
    if (game.status === 'published') {
      toast.error("لا يمكنك حذف اللعبة أثناء وجود جلسة مباشرة. يرجى إنهاء الجلسة أولاً.");
      return;
    }
    setGameToDelete(game);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">ألعابي</h1>
          <p className="text-gray-500">
            إدارة الألعاب التي قمت بإنشائها. يمكنك إضافة ألعاب جديدة أو تعديل الحالية.
          </p>
        </div>
        <Link 
          href="/dashboard/games/new"
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة لعبة جديدة</span>
        </Link>
      </div>

      {showSearchAndFilter && (
        <SearchAndFilter 
          placeholder="ابحث عن لعبة..." 
          showStatusFilter={true} 
        />
      )}

      {/* Games Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isPending ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}`}>
        {initialGames.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onToggleStatus={toggleGameStatus} 
            onShare={setShareGame} 
            onDelete={initiateDelete} 
          />
        ))}

        {initialGames.length === 0 && (
          <Link 
            href="/dashboard/games/new"
            className="bg-emerald-50/50 rounded-2xl p-5 border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center gap-3 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold">إنشاء لعبة جديدة</span>
          </Link>
        )}
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} />

      {/* Share Modal */}
      {mounted && createPortal(
        <GameShareModal game={shareGame} onClose={() => setShareGame(null)} />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!gameToDelete}
        onClose={() => setGameToDelete(null)}
        onConfirm={handleDelete}
        title="حذف اللعبة"
        description={`هل أنت متأكد أنك تريد حذف لعبة "${gameToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="نعم، احذفها"
        cancelText="إلغاء"
        type="danger"
      />

    </div>
  )
}
