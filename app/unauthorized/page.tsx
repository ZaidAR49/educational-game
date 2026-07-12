"use client"

import Link from "next/link"
import { ShieldAlert, ArrowRight, Home } from "lucide-react"
import { motion } from "framer-motion"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 text-right" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-center space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2"
          >
            <ShieldAlert className="w-12 h-12" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">عذراً، لا تملك صلاحية</h1>
            <p className="text-slate-500 leading-relaxed">
              يبدو أنك لا تملك الصلاحيات الكافية للوصول إلى هذه الصفحة، أو أن حسابك مقيد حالياً. يرجى التواصل مع الإدارة إذا كنت تعتقد أن هذا خطأ.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link 
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm group"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              الرجوع للصفحة السابقة
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
