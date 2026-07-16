import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Link as LinkIcon, Download } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import Link from "next/link"
import { toast } from "sonner"

interface GameSuccessModalProps {
  show: boolean;
  onClose: () => void;
  gameTitle: string;
  gameSlug: string;
  gameUrl: string;
  qrLogo: string;
  onDownloadQR: () => void;
}

export function GameSuccessModal({
  show,
  onClose,
  gameTitle,
  gameSlug,
  gameUrl,
  qrLogo,
  onDownloadQR
}: GameSuccessModalProps) {
  const copyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(gameUrl);
      toast.success("تم نسخ الرابط بنجاح!");
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 pointer-events-auto"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl p-8 md:p-10 w-full max-w-xl shadow-2xl flex flex-col items-center text-center space-y-8 z-10 pointer-events-auto"
          >
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">تم نشر اللعبة بنجاح! 🎉</h3>
              <p className="text-gray-500 font-medium text-base max-w-sm mx-auto">
                لعبتك "{gameTitle}" أصبحت متاحة الآن للعب باستخدام الرابط أو رمز الاستجابة السريعة (QR).
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
              <div className="p-4 rounded-2xl border-2 border-gray-100 flex justify-center items-center bg-white">
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={gameUrl}
                  size={200}
                  level="H"
                  fgColor="#064e3b"
                  bgColor="#ffffff"
                  imageSettings={{
                    src: qrLogo,
                    height: 48,
                    width: 48,
                    excavate: true,
                    crossOrigin: "anonymous",
                  }}
                />
              </div>
              
              <button 
                onClick={onDownloadQR}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold transition-colors w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                <span>تحميل كصورة</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full mt-4">
              <button
                onClick={copyLink}
                className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-6 py-4 rounded-xl flex-1 transition-colors border-2 border-emerald-100"
              >
                <LinkIcon className="w-5 h-5" />
                <span>نسخ الرابط</span>
              </button>
              
              <Link 
                href="/dashboard/games"
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold px-6 py-4 rounded-xl flex-1 transition-colors shadow-lg shadow-gray-900/20"
              >
                <span>لوحة التحكم</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
