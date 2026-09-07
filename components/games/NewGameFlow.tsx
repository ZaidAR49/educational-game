"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Bot, PenTool, ArrowRight, ArrowLeft, Building2, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { GameWizard } from "./GameWizard"
import { ByoAiWizard } from "./ByoAiWizard"
import { AutoAiWizard } from "./AutoAiWizard"
import { OrganizationOption } from "./wizard/BasicInfoStep"

interface NewGameFlowProps {
  organizations: OrganizationOption[];
}

type CreationMethod = 'select' | 'manual' | 'byo-ai' | 'auto-ai';

export function NewGameFlow({ organizations }: NewGameFlowProps) {
  const { t, isRTL } = useLocale()
  const [method, setMethod] = useState<CreationMethod>('select')

  if (organizations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-3xl shadow-sm border-2 border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-4">{t.gameCreation.noOrgTitle}</h1>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          {t.gameCreation.noOrgDesc}
        </p>
        <Link 
          href="/dashboard/organizations"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md text-base"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t.gameCreation.createOrgBtn}</span>
        </Link>
      </div>
    )
  }

  if (method === 'manual') {
    return (
      <GameWizard 
        isEdit={false} 
        organizations={organizations}
        customTopActions={
          <button 
            onClick={() => setMethod('select')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t.gameCreation.backToMethods}</span>
          </button>
        }
      />
    )
  }

  if (method === 'byo-ai') {
    return <ByoAiWizard organizations={organizations} onBack={() => setMethod('select')} />
  }

  if (method === 'auto-ai') {
    return <AutoAiWizard organizations={organizations} onBack={() => setMethod('select')} />
  }

  // Select Method Screen
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mt-4">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 tracking-tight">{t.gameCreation.howToCreate}</h1>
        <p className="text-gray-500 font-medium text-sm sm:text-base">
          {t.gameCreation.howToCreateDesc}
        </p>
      </div>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        
        {/* Manual Method */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMethod('manual')}
          className="bg-white rounded-2xl p-4.5 sm:p-5 border-2 border-gray-100 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col items-start text-start"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <PenTool className="w-5 h-5" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1.5">{t.gameCreation.manualTitle}</h3>
          <p className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed mb-3.5 flex-1">
            {t.gameCreation.manualDesc}
          </p>
          <div className="text-emerald-600 font-bold text-sm sm:text-base flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            <span>{t.gameCreation.manualBtn}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </motion.button>

        {/* BYO AI Method */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMethod('byo-ai')}
          className="bg-white rounded-2xl p-4.5 sm:p-5 border-2 border-gray-100 hover:border-purple-500 hover:shadow-lg transition-all group flex flex-col items-start text-start relative overflow-hidden"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform relative z-10">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1.5 relative z-10">{t.gameCreation.byoTitle}</h3>
          <p className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed mb-3.5 flex-1 relative z-10">
            {t.gameCreation.byoDesc}
          </p>
          <div className="text-purple-600 font-bold text-sm sm:text-base flex items-center gap-1.5 group-hover:gap-2.5 transition-all relative z-10">
            <span>{t.gameCreation.byoBtn}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </motion.button>

        {/* Auto AI Method */}
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMethod('auto-ai')}
          className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-4.5 sm:p-5 border-2 border-transparent shadow-lg hover:shadow-xl transition-all group flex flex-col items-start text-start relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-[pulse_4s_ease-in-out_infinite]"></div>
          
          <div className="w-full flex items-center justify-between mb-3 relative z-10">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 text-white backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="bg-white text-emerald-800 text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-black shadow-sm tracking-wide whitespace-nowrap">
              {t.gameCreation.autoAiBadge}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white mb-1.5 relative z-10">
            {t.gameCreation.autoAiTitle}
          </h3>
          <p className="text-emerald-50 font-medium text-xs sm:text-sm leading-relaxed mb-3.5 flex-1 relative z-10">
            {t.gameCreation.autoAiDesc}
          </p>
          <div className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5 group-hover:gap-2.5 transition-all relative z-10">
            <span>{t.gameCreation.autoAiBtn}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </motion.button>

      </div>
    </div>
  )
}
