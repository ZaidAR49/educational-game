"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Plus, Settings2, Trash2, Play, Users, Trophy, Share2, HelpCircle, X, Maximize, Link as LinkIcon, Eye, EyeOff } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { ConfirmModal } from "@/components/shared/ConfirmModal"

type Game = {
  id: string
  title: string
  description: string
  icon: string
  status: string
  playCount: number
  createdAt: string
}

export default function GamesListPage() {
  const [shareGame, setShareGame] = useState<Game | null>(null)
  const [isQrFullscreen, setIsQrFullscreen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null)

  // Needed so the modal can be portaled to document.body (avoids document
  // being undefined during SSR, and ensures we only portal after mount)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleGameStatus = (id: string) => {
    setGames(games.map(game => 
      game.id === id 
        ? { ...game, status: game.status === 'published' ? 'draft' : 'published' }
        : game
    ))
  }

  // Mock data for games
  const [games, setGames] = useState([
    {
      id: "1",
      title: "اختبار المسار المهني",
      description: "لعبة تفاعلية لمساعدة الطلاب على اكتشاف مسارهم المهني.",
      icon: "🎯",
      status: "published",
      playCount: 1540,
      createdAt: "2026-07-01",
    },
    {
      id: "2",
      title: "تحدي الثقافة العامة",
      description: "مجموعة من الأسئلة المنوعة لتنشيط العقل.",
      icon: "🧠",
      status: "published",
      playCount: 320,
      createdAt: "2026-07-05",
    },
    {
      id: "3",
      title: "لعبة التوعية الصحية",
      description: "تعرف على أهم العادات الصحية للوقاية من الأمراض.",
      icon: "🍎",
      status: "draft",
      playCount: 0,
      createdAt: "2026-07-08",
    }
  ])

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
          <div key={game.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100">
                  {game.icon}
                </div>
                {game.status === 'published' ? (
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                    منشورة
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                    مسودة
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 flex-1">
                {game.description}
              </p>

              <div className="flex items-center gap-4 text-sm font-bold text-gray-500 bg-gray-50/50 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5" title="عدد المرات التي لُعبت فيها هذه اللعبة">
                  <Play className="w-4 h-4 text-emerald-500" />
                  <span>{game.playCount.toLocaleString()}</span>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help hover:text-emerald-500 transition-colors" />
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="flex items-center gap-1.5" title="متوسط نسبة النجاح والإجابات الصحيحة للطلاب">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>{game.playCount > 0 ? "85%" : "0%"}</span>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help hover:text-amber-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Actions Footer - Always visible now */}
            <div className="border-t border-gray-50 p-2 sm:p-3 flex gap-1.5 sm:gap-2 bg-gray-50/50 flex-wrap">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xl:inline">تجربة</span>
              </button>
              <Link 
                href={`/dashboard/games/new`} 
                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm"
              >
                <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xl:inline">تعديل</span>
              </Link>
              <button 
                onClick={() => setShareGame(game)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xl:inline">مشاركة</span>
              </button>
              <Link 
                href={`/dashboard/games/${game.id}/live`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 hover:text-purple-600 hover:bg-purple-50 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-100 shadow-sm"
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xl:inline">مباشر</span>
              </Link>
              
              <button 
                onClick={() => toggleGameStatus(game.id)}
                title={game.status === 'published' ? 'إلغاء التفعيل' : 'تفعيل'}
                className={`flex items-center justify-center w-9 sm:w-11 bg-white hover:bg-amber-50 rounded-xl transition-colors border border-gray-100 shadow-sm shrink-0 ${
                  game.status === 'published' ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {game.status === 'published' ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
              <button 
                onClick={() => setGameToDelete(game)}
                title="حذف اللعبة"
                className="flex items-center justify-center w-9 sm:w-11 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-gray-100 shadow-sm shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Share Modal — portaled to document.body so `fixed inset-0` is
          positioned against the real viewport instead of the animated
          (transformed) wrapper above, which was breaking vertical centering
          and the fullscreen QR sizing. */}
      {mounted && createPortal(
        <AnimatePresence>
          {shareGame && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 transition-colors duration-500">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative flex flex-col items-center text-center bg-white shadow-2xl overflow-y-auto custom-scrollbar transition-all duration-500 ${
                  isQrFullscreen 
                    ? 'w-auto max-w-[95vw] max-h-[95vh] p-8 md:p-12 rounded-[3rem]' 
                    : 'w-full max-w-xl max-h-[90vh] p-6 sm:p-10 rounded-3xl'
                }`}
              >
                {/* Close Button */}
                <button 
                  onClick={() => { setShareGame(null); setIsQrFullscreen(false); }}
                  className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center w-full my-auto">
                  {!isQrFullscreen && (
                    <div className="mb-6 shrink-0 mt-2">
                      <h3 className="text-2xl font-black text-gray-900 mb-2">مشاركة اللعبة</h3>
                      <p className="text-gray-500">شارك لعبة "{shareGame.title}" مع طلابك ليبدأوا اللعب</p>
                    </div>
                  )}

                  {/* QR Code Container */}
                  <div 
                    className={`flex items-center justify-center bg-white border-2 border-gray-100 shadow-sm group cursor-pointer transition-all hover:border-emerald-500 hover:shadow-md shrink-0 ${
                      isQrFullscreen 
                        ? 'rounded-[2rem] p-4 md:p-6' 
                        : 'w-64 h-64 rounded-3xl p-4'
                    }`}
                    style={isQrFullscreen ? { width: 'min(60vh, 75vw)', height: 'min(60vh, 75vw)' } : undefined}
                    onClick={() => setIsQrFullscreen(!isQrFullscreen)}
                    title={isQrFullscreen ? "انقر للعودة للحجم الطبيعي" : "انقر لتكبير رمز الاستجابة السريعة (QR)"}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <QRCodeCanvas
                        value={`https://your-domain.com/game/${shareGame.id}`}
                        size={1000} // High res internal canvas
                        level="H"
                        fgColor="#064e3b"
                        bgColor="#ffffff"
                        style={{ width: '100%', height: '100%' }}
                        imageSettings={{
                          src: "/logo.png",
                          height: 120,
                          width: 120,
                          excavate: true,
                        }}
                      />
                      {!isQrFullscreen && (
                        <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                          <Maximize className="w-10 h-10 text-emerald-600" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h2 className={`font-black text-emerald-600 shrink-0 mt-6 md:mt-8 ${isQrFullscreen ? 'text-4xl md:text-5xl' : 'text-xl'}`}>
                    امسح الرمز للبدء! 👇
                  </h2>

                  {!isQrFullscreen && (
                    <>
                      <div className="w-full space-y-2 mt-6 shrink-0">
                        <label className="text-sm font-bold text-gray-500 block text-right">أو انسخ الرابط المباشر</label>
                        <div className="flex rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                          <div className="flex-1 px-4 py-3 bg-transparent text-gray-600 font-sans text-left min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" dir="ltr">
                            {`https://your-domain.com/game/${shareGame.id}`}
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`https://your-domain.com/game/${shareGame.id}`);
                              alert("تم نسخ الرابط!");
                            }}
                            className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-5 font-bold transition-colors shrink-0"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span>نسخ</span>
                          </button>
                        </div>
                      </div>

                      <Link
                        href={`/dashboard/games/${shareGame.id}/live`}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20"
                      >
                        <Users className="w-5 h-5" />
                        <span>عرض الجلسة المباشرة</span>
                        <div className="relative flex h-3 w-3 mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
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