"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { PlayCircle, ArrowLeft, Sparkles } from "lucide-react"
import { DemoGameCard } from "./DemoGameCard"

export function HeroSection({ content }: { content: any }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-blue-50/30 to-white min-h-[90vh] flex items-center pt-28 pb-20">

      {/* Abstract Glowing Blobs */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] animate-pulse duration-[8s]" />
        <div className="absolute top-[30%] -left-[10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] animate-pulse duration-[10s]" />
        <div className="absolute -bottom-[20%] right-[20%] w-[450px] h-[450px] bg-teal-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 mx-auto relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Right Side: Copy & CTA */}
          <div className="text-right flex flex-col items-start w-full lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-bold mb-6 text-sm shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin duration-[4s]" />
              <span>ألعاب تعليمية تفاعلية مدعومة بالذكاء الاصطناعي</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.15] mb-6 tracking-tight"
            >
              اصنع ألعابك التعليمية <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-blue-600">
                بلمسة ذكاء اصطناعي
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
            >
              منصة <span className="font-bold text-emerald-600">{content.app.name}</span> تمكّن المعلمين من توليد سيناريوهات تفاعلية مذهلة واختبارات شيقة في ثوانٍ. انضمام فوري للطلاب بلمح البصر دون أي حسابات أو تعقيدات.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                href="/login"
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>ابدأ مجاناً كمعلم</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/game/demo"
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-100 hover:border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlayCircle className="w-5 h-5 text-blue-600" />
                <span>جرب اللعب كطالب</span>
              </Link>
            </motion.div>
          </div>

          {/* Left Side: Interactive Demo Card */}
          <div className="w-full lg:col-span-5 relative">
            <DemoGameCard />
          </div>

        </div>
      </div>

      {/* Scroll Down Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <Link href="#features" className="flex flex-col items-center text-emerald-600 hover:text-emerald-700 transition-colors">
          <span className="text-xs font-bold mb-1 opacity-70">اكتشف الميزات بالكامل</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}
