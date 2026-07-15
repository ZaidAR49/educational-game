"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

type AddAdminModalProps = {
  isPending: boolean
  actionError: string | null
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function AddAdminModal({ isPending, actionError, onClose, onSubmit }: AddAdminModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">إضافة مسؤول جديد</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4">
            {actionError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {actionError}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
              <input
                required name="name" type="text"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="مثال: خالد محمد"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                required name="email" type="email" dir="ltr"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-left"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الصلاحية</label>
              <select name="role" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                <option value="super_admin">مدير النظام — صلاحيات كاملة</option>
                <option value="admin">مسؤول — يمكنه إدارة المستخدمين</option>
                <option value="viewer">مشاهد — عرض فقط بدون تعديل</option>
              </select>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">
              إلغاء
            </button>
            <button type="submit" disabled={isPending} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "منح الصلاحية"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
