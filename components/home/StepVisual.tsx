"use client"

import { motion } from "framer-motion"
import { QrCode, CheckCircle2 } from "lucide-react"

type StepVisualProps = {
  activeStep: number
}

export function StepVisual({ activeStep }: StepVisualProps) {
  switch (activeStep) {
    case 0:
      return (
        <motion.div
          key="step0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full bg-slate-900 rounded-[2rem] border border-slate-800 p-6 font-mono text-xs text-slate-300 text-right space-y-4 shadow-xl"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-slate-500 text-[10px]">المساعد الذكي - توليد فوري</span>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block mb-1">موضوع اللعبة المقترح:</span>
              <span className="text-white font-bold text-sm block">أجزاء الزهرة وظيفتها في التكاثر 🌺</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-950/60 relative overflow-hidden space-y-2">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold">
                <span>تم التوليد بنجاح!</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-white font-bold text-xs truncate">س١: أي جزء في الزهرة ينتج حبوب اللقاح؟</div>
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <div className="bg-emerald-950/40 border border-emerald-800/40 p-1.5 rounded text-emerald-300">المتك (صحيح) ✅</div>
                <div className="bg-slate-900 border border-slate-800 p-1.5 rounded">الميسم 📝</div>
              </div>
            </div>
          </div>
        </motion.div>
      )

    case 1:
      return (
        <motion.div
          key="step1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full bg-white rounded-[2rem] border border-gray-100 p-6 text-right space-y-4 shadow-xl flex flex-col justify-between min-h-[250px]"
        >
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-xs font-bold text-gray-800">إطلاق الجلسة المباشرة</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">نشط الآن</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            <div className="w-24 h-24 bg-gray-50 border-2 border-gray-100 rounded-2xl flex items-center justify-center p-2 relative">
              <div className="absolute inset-0 bg-emerald-500/5 animate-pulse rounded-2xl" />
              <QrCode className="w-full h-full text-gray-850" />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-bold text-gray-400 block">رابط الانضمام السريع</span>
              <span className="text-sm font-black text-gray-900 tracking-wider">eduplay.com/play/842-192</span>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span>28 طالب في الصف</span>
            </div>
            <span className="text-gray-450 font-bold">جلسة العلوم - أ1</span>
          </div>
        </motion.div>
      )

    case 2:
      return (
        <motion.div
          key="step2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-[280px] mx-auto bg-gray-950 rounded-[2.5rem] border-[6px] border-slate-800 p-4 pt-8 text-right shadow-2xl relative min-h-[320px] flex flex-col justify-between"
        >
          {/* Phone notch */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-full" />

          <div className="space-y-4 mt-2">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">نقاط: +10</span>
              <span className="text-[9px] text-gray-500">الزهرة والتكاثر</span>
            </div>

            <div className="space-y-2">
              <h5 className="text-[11px] font-black text-white leading-normal">أي جزء يحمل حبوب اللقاح؟</h5>
              <div className="space-y-1.5">
                <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-[10px] text-gray-400 font-bold">أ. الكأس</div>
                <div className="bg-emerald-900/40 border-2 border-emerald-500 p-2.5 rounded-xl text-[10px] text-emerald-100 font-bold flex justify-between items-center">
                  <span>ب. المتك</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-2xl text-[9px] text-slate-350 leading-relaxed">
            <span className="font-bold text-emerald-400 block mb-0.5">أحسنت! 🌟</span>
            المتك هو الجزء الذكري المسؤول عن تصنيع حبوب اللقاح.
          </div>
        </motion.div>
      )

    case 3:
      return (
        <motion.div
          key="step3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full bg-white rounded-[2rem] border border-gray-100 p-6 text-right space-y-4 shadow-xl"
        >
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-xs font-bold text-gray-850">تحليلات الجلسة الحية</span>
            <span className="text-[10px] font-bold text-gray-400">تحديث فوري</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-right">
            <div className="bg-blue-50 border border-blue-100/50 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-500 block mb-1">متوسط الدقة</span>
              <span className="text-2xl font-black text-blue-900">82%</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100/50 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-500 block mb-1">نسبة الإكمال</span>
              <span className="text-2xl font-black text-emerald-900">100%</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-gray-400 block">توزيع درجات الطلاب</span>
            <div className="flex items-end justify-between gap-1.5 h-20 pt-2 bg-gray-50/50 rounded-xl px-4 border border-gray-100/50">
              <div className="bg-red-400 w-full rounded-t" style={{ height: "25%" }} />
              <div className="bg-amber-400 w-full rounded-t" style={{ height: "40%" }} />
              <div className="bg-blue-400 w-full rounded-t" style={{ height: "65%" }} />
              <div className="bg-emerald-500 w-full rounded-t" style={{ height: "90%" }} />
            </div>
            <div className="flex justify-between text-[8px] text-gray-400 font-bold px-2">
              <span>0-5</span><span>6-8</span><span>9-10</span><span>متفوق</span>
            </div>
          </div>
        </motion.div>
      )

    default:
      return null
  }
}
