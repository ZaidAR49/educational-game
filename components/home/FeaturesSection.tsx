"use client"

import { motion } from "framer-motion"
import {
  Wand2,
  Bot,
  Zap,
  Lightbulb,
  BarChart3,
  Building2,
  Copy,
  Sparkles,
  Play
} from "lucide-react"
import { useState } from "react"
import { useLocale } from "@/lib/i18n/LanguageContext"

export function FeaturesSection() {
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const { messages: t } = useLocale()

  const handleCopyMockPrompt = () => {
    navigator.clipboard.writeText(t.features.byoPromptText)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">

        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.features.sectionBadge}</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {t.features.sectionHeading1}{" "}
            <span className="text-transparent bg-clip-text rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-emerald-600 to-blue-600">
              {t.features.sectionHeading2}
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.features.sectionDescription}
          </p>
        </div>

        {/* 1. AI Spotlight */}
        <div className="mb-20">
          {/* justify-start = inline-start (right in RTL, left in LTR) */}
          <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Bot className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              {t.features.aiSpotlightTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Card 1: Auto AI Wizard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-[2.5rem] p-8 md:p-10 border border-emerald-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px] group"
            >
              <div className="absolute -top-24 -start-24 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-emerald-500/20 shadow-md">
                  <Wand2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-2xl font-black mb-4">{t.features.autoAiTitle}</h4>
                <p className="text-emerald-100/80 font-medium leading-relaxed text-sm md:text-base mb-8">
                  {t.features.autoAiDescription}
                </p>
              </div>

              {/* Visual Demo */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 relative overflow-hidden text-start z-10">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-3">
                  <span>{t.features.autoAiProcessingLabel}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="space-y-2">
                  <div className="bg-white/10 px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-between">
                    <span>{t.features.autoAiTopicLabel}</span>
                    <Play className="w-3 h-3 text-emerald-400 fill-current" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-[10px] text-emerald-100 font-bold">{t.features.autoAiOption1}</div>
                    <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-[10px] text-emerald-100 font-bold">{t.features.autoAiOption2}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: BYO Prompt Engine */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-950 to-purple-900 text-white rounded-[2.5rem] p-8 md:p-10 border border-purple-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px] group"
            >
              <div className="absolute -top-24 -start-24 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="w-7 h-7 text-purple-400" />
                </div>
                <h4 className="text-2xl font-black mb-4">{t.features.byoPromptTitle}</h4>
                <p className="text-purple-100/80 font-medium leading-relaxed text-sm md:text-base mb-8">
                  {t.features.byoPromptDescription}
                </p>
              </div>

              {/* Visual Prompt Copy */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center justify-between text-start z-10">
                <div className="overflow-hidden max-w-[70%]">
                  <div className="text-[10px] text-purple-300 font-bold mb-1">{t.features.byoPromptLabel}</div>
                  <div className="text-xs font-mono text-purple-100 truncate">
                    You are an expert educational game designer. Generate JSON...
                  </div>
                </div>
                <button
                  onClick={handleCopyMockPrompt}
                  className="bg-white text-purple-950 hover:bg-purple-50 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPrompt ? t.features.byoPromptCopied : t.features.byoPromptCopy}</span>
                </button>
              </div>
            </motion.div>

          </div>
        </div>

        {/* 2. Core Platform Features */}
        <div>
          <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-blue-100">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              {t.features.coreFeaturesTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-between p-6 md:p-8 rounded-3xl shadow-xl border-2 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-default group min-h-[380px]"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{t.features.feature1Title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{t.features.feature1Description}</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group flex items-start gap-6 text-start"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Lightbulb className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{t.features.feature2Title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{t.features.feature2Description}</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 group flex items-start gap-6 text-start"
            >
              <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{t.features.feature3Title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{t.features.feature3Description}</p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 group flex items-start gap-6 text-start"
            >
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{t.features.feature4Title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{t.features.feature4Description}</p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  )
}
