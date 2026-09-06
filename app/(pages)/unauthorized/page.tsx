"use client"

import Link from "next/link"
import { ShieldAlert, ArrowRight, Home } from "lucide-react"
import { motion } from "framer-motion"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { LanguageDropdown } from "@/components/shared/LanguageDropdown"

export default function UnauthorizedPage() {
  const { messages: t } = useLocale()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 relative">
      {/* Top Floating Bar */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-8 max-w-5xl mx-auto flex items-center justify-between pointer-events-none z-40">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-xl font-bold text-sm shadow-sm border border-gray-200/80 backdrop-blur-md transition-all hover:scale-105"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{t.unauthorized.backHome}</span>
        </Link>
        <div className="pointer-events-auto">
          <LanguageDropdown variant="glass" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden pt-12 sm:pt-0"
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
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {t.unauthorized.title}
            </h1>
            <p className="text-slate-500 leading-relaxed">
              {t.unauthorized.description}
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm group"
            >
              <Home className="w-5 h-5" />
              <span>{t.unauthorized.backHome}</span>
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <ArrowRight className="w-5 h-5 rtl:rotate-180 transition-transform" />
              <span>{t.unauthorized.goBack}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
