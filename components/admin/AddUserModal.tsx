"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

type AddUserModalProps = {
  isPending: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function AddUserModal({ isPending, onClose, onSubmit }: AddUserModalProps) {
  const { isRTL } = useLocale()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{isRTL ? "إضافة مستخدم جديد" : "Add New User"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{isRTL ? "الاسم الكامل" : "Full Name"}</label>
              <input
                required
                name="name"
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-start"
                placeholder={isRTL ? "مثال: محمد أحمد" : "e.g. John Doe"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{isRTL ? "البريد الإلكتروني" : "Email Address"}</label>
              <input
                required
                name="email"
                type="email"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-start"
                dir="ltr"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{isRTL ? "الباقة" : "Plan"}</label>
              <select
                name="plan"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-start"
              >
                <option value="free">{isRTL ? "مجاني" : "Free"}</option>
                <option value="pro">{isRTL ? "برو (Pro)" : "Pro"}</option>
              </select>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : isRTL ? "إضافة" : "Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
