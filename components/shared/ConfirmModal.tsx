"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Info, X } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  type = "danger"
}: ConfirmModalProps) {
  const { t, isRTL } = useLocale()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const resolvedConfirmText = confirmText || t.common?.confirm || (isRTL ? "تأكيد" : "Confirm")
  const resolvedCancelText = cancelText || t.common?.cancel || (isRTL ? "إلغاء" : "Cancel")

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-colors duration-300" 
          dir={isRTL ? "rtl" : "ltr"}
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-3 end-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
              type === 'danger' ? 'bg-red-100 text-red-600' :
              type === 'warning' ? 'bg-amber-100 text-amber-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {type === 'info' ? <Info className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1.5">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-5 leading-relaxed">{description}</p>

            <div className="flex w-full gap-2.5">
              <button 
                onClick={onConfirm}
                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs ${
                  type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20' :
                  type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' :
                  'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                }`}
              >
                {resolvedConfirmText}
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                {resolvedCancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
