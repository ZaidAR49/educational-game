"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Info, X } from "lucide-react"

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
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  type = "danger"
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/50 transition-colors duration-500" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
              type === 'danger' ? 'bg-red-100 text-red-600' :
              type === 'warning' ? 'bg-amber-100 text-amber-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {type === 'info' ? <Info className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">{description}</p>

            <div className="flex w-full gap-3">
              <button 
                onClick={onConfirm}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-sm ${
                  type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:shadow-lg' :
                  type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 hover:shadow-lg' :
                  'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-lg'
                }`}
              >
                {confirmText}
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors shadow-sm"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
