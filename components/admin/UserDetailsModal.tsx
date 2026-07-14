"use client"

import { motion } from "framer-motion"
import { Building2, Gamepad2, Users } from "lucide-react"

type UserDetailsModalProps = {
  user: any
  onClose: () => void
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">تفاصيل الحساب</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{user.name}</div>
              <div className="text-slate-500 text-sm">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">المنظمات</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{user.organizations}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Gamepad2 className="w-4 h-4" />
                <span className="text-sm font-medium">الألعاب</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{user.games}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">إجمالي اللاعبين</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{user.totalPlayers}</div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  )
}
