import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Maximize, Link as LinkIcon, Users } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import Link from "next/link"
import { toast } from "sonner"
import { Game } from "./types"

interface GameShareModalProps {
  game: Game | null
  onClose: () => void
  hideLiveSessionButton?: boolean
}

export function GameShareModal({ game, onClose, hideLiveSessionButton }: GameShareModalProps) {
  const [isQrFullscreen, setIsQrFullscreen] = useState(false)

  if (!game) return null

  return (
    <AnimatePresence>
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
            onClick={() => { onClose(); setIsQrFullscreen(false); }}
            className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center w-full my-auto">
            {!isQrFullscreen && (
              <div className="mb-6 shrink-0 mt-2">
                <h3 className="text-2xl font-black text-gray-900 mb-2">مشاركة اللعبة</h3>
                <p className="text-gray-500">شارك لعبة "{game.title}" مع طلابك ليبدأوا اللعب</p>
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
                  value={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/game/${game.id}`}
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
                      {`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/game/${game.id}`}
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/game/${game.id}`);
                        toast.success("تم نسخ الرابط بنجاح!");
                      }}
                      className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-5 font-bold transition-colors shrink-0"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>نسخ</span>
                    </button>
                  </div>
                </div>

                {hideLiveSessionButton ? (
                  <button
                    onClick={() => { onClose(); setIsQrFullscreen(false); }}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold transition-all shadow-sm"
                  >
                    <X className="w-5 h-5" />
                    <span>إغلاق</span>
                  </button>
                ) : (
                  <Link
                    href={`/dashboard/games/${game.id}/live`}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Users className="w-5 h-5" />
                    <span>عرض الجلسة المباشرة</span>
                    <div className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </div>
                  </Link>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
