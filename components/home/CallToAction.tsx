"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Sparkles, Trophy } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

export function CallToAction() {
  const { messages: t } = useLocale()

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">

      {/* Decorative background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-48 end-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] transform translate-x-1/2" />
        <div className="absolute -bottom-48 start-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] transform -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/[0.02] backdrop-blur-md rounded-[3rem] p-10 md:p-16 border border-white/5 shadow-2xl overflow-hidden"
        >
          {/* Corner decorations — logical positioning */}
          <div className="absolute top-6 end-6 text-emerald-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-6 start-6 text-blue-500/20">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-snug">
              {t.cta.heading1} <br />
              {t.cta.heading2}{" "}
              <span className="text-transparent bg-clip-text rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-emerald-400 to-emerald-300">
                {t.cta.heading3}
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-emerald-100/70 mb-10 leading-relaxed font-medium">
              {t.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/login"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-slate-950 font-black px-10 py-4.5 rounded-2xl text-lg transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{t.cta.button}</span>
                <ArrowLeft className="w-5 h-5 rtl:block ltr:hidden rtl:group-hover:-translate-x-1 transition-transform" />
                <ArrowRight className="w-5 h-5 ltr:block rtl:hidden ltr:group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
