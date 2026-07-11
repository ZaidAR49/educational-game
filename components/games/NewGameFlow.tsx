"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Bot, PenTool, ArrowRight } from "lucide-react"
import Link from "next/link"
import { GameWizard } from "./GameWizard"
import { ByoAiWizard } from "./ByoAiWizard"
import { AutoAiWizard } from "./AutoAiWizard"
import { OrganizationOption } from "./wizard/BasicInfoStep"

interface NewGameFlowProps {
  organizations: OrganizationOption[];
}

type CreationMethod = 'select' | 'manual' | 'byo-ai' | 'auto-ai';

export function NewGameFlow({ organizations }: NewGameFlowProps) {
  const [method, setMethod] = useState<CreationMethod>('select')

  if (method === 'manual') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setMethod('select')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لطرق الإنشاء</span>
        </button>
        <GameWizard isEdit={false} organizations={organizations} />
      </div>
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
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20" dir="rtl">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mt-8">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">كيف تود إنشاء لعبتك؟</h1>
        <p className="text-gray-500 font-medium text-lg">
          اختر الطريقة التي تفضلها للبدء. يمكنك بناء اللعبة بنفسك أو الاستعانة بالذكاء الاصطناعي لتسريع العملية!
        </p>
      </div>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Manual Method */}
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMethod('manual')}
          className="bg-white rounded-[2rem] p-8 border-2 border-gray-100 hover:border-emerald-500 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] transition-all text-right group flex flex-col items-start text-right"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <PenTool className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">بناء يدوي</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-1">
            ابنِ اللعبة من الصفر باستخدام محررنا البسيط. أضف أسئلتك وخياراتك وتغذيتك الراجعة خطوة بخطوة.
          </p>
          <div className="text-emerald-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            <span>ابدأ البناء</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </div>
        </motion.button>

        {/* BYO AI Method */}
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMethod('byo-ai')}
          className="bg-white rounded-[2rem] p-8 border-2 border-gray-100 hover:border-purple-500 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)] transition-all text-right group flex flex-col items-start relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3 relative z-10">بناء عبر موجه (Prompt)</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-1 relative z-10">
            سنوفر لك أمر برمجي (Prompt) احترافي لتستخدمه مع أي ذكاء اصطناعي (مثل ChatGPT). الصق النتيجة هنا وسنقوم بالباقي!
          </p>
          <div className="text-purple-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all relative z-10">
            <span>استخدم الموجه</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </motion.button>

        {/* Auto AI Method */}
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMethod('auto-ai')}
          className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[2rem] p-8 border-2 border-transparent shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] transition-all text-right group flex flex-col items-start relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-[pulse_4s_ease-in-out_infinite]"></div>
          
          <div className="w-16 h-16 bg-white/20 text-white backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 relative z-10 flex items-center gap-2">
            بناء بالذكاء الاصطناعي
            <span className="bg-white text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">جديد</span>
          </h3>
          <p className="text-emerald-50 font-medium leading-relaxed mb-6 flex-1 relative z-10">
            أدخل فكرتك فقط، وسيقوم الذكاء الاصطناعي الخاص بنا بتوليد اللعبة بالكامل لك في ثوانٍ معدودة!
          </p>
          <div className="text-white font-bold flex items-center gap-2 group-hover:gap-3 transition-all relative z-10">
            <span>جرب السحر</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </div>
        </motion.button>

      </div>
    </div>
  )
}
