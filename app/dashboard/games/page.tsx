"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { Game } from "@/components/games/types"
import { GameCard } from "@/components/games/GameCard"
import { GameShareModal } from "@/components/games/GameShareModal"

export default function GamesListPage() {
  const [shareGame, setShareGame] = useState<Game | null>(null)
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      title: "اختبار المسار المهني",
      description: "لعبة تفاعلية لمساعدة الطلاب على اكتشاف مسارهم المهني.",
      icon: "🎯",
      status: "published",
      playCount: 1540,
      questionsCount: 10,
      createdAt: "2026-07-01",
    },
    {
      id: "2",
      title: "تحدي الثقافة العامة",
      description: "مجموعة من الأسئلة المنوعة لتنشيط العقل.",
      icon: "🧠",
      status: "published",
      playCount: 320,
      questionsCount: 15,
      createdAt: "2026-07-05",
    },
    {
      id: "3",
      title: "لعبة التوعية الصحية",
      description: "تعرف على أهم العادات الصحية للوقاية من الأمراض.",
      icon: "🍎",
      status: "draft",
      playCount: 0,
      questionsCount: 5,
      createdAt: "2026-07-08",
    }
  ])

  const toggleGameStatus = (id: string) => {
    setGames(games.map(game => 
      game.id === id 
        ? { ...game, status: game.status === 'published' ? 'draft' : 'published' }
        : game
    ))
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

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onToggleStatus={toggleGameStatus} 
            onShare={setShareGame} 
            onDelete={setGameToDelete} 
          />
        ))}
      </div>

      {/* Share Modal */}
      {mounted && createPortal(
        <GameShareModal game={shareGame} onClose={() => setShareGame(null)} />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!gameToDelete}
        onClose={() => setGameToDelete(null)}
        onConfirm={() => {
          if (gameToDelete) {
            setGames(games.filter(g => g.id !== gameToDelete.id))
            setGameToDelete(null)
          }
        }}
        title="حذف اللعبة"
        description={`هل أنت متأكد أنك تريد حذف لعبة "${gameToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="نعم، احذفها"
        cancelText="إلغاء"
        type="danger"
      />

    </div>
  )
}