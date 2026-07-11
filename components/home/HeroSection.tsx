"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { PlayCircle, GraduationCap, ArrowLeft } from "lucide-react"
import { config } from "@/lib/config"

export function HeroSection({ content }: { content: any }) {
  return (
    <div className="relative overflow-hidden bg-emerald-50 min-h-[75vh] flex items-center pt-24 pb-24 md:pb-16">
      {/* Background Animated Shapes */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none hidden md:block">
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-300/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 -left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 mx-auto relative z-10 max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="text-right flex flex-col items-start w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-emerald-100 text-emerald-700 font-medium mb-6 shadow-sm"
            >
              <GraduationCap className="w-5 h-5" />
              <span>منصة تعليمية تفاعلية</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6"
            >
              صمم ألعابك <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-blue-600">
                التعليمية
              </span> بسهولة
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl xl:text-2xl text-gray-600 mb-8 max-w-lg xl:max-w-2xl leading-relaxed"
            >
              منصة {content.app.name} تتيح للمعلمين إنشاء سيناريوهات تفاعلية واختبارات شيقة للطلاب بدون الحاجة لإنشاء حسابات للطلاب.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 justify-start w-full sm:w-auto"
            >
              <Link
                href="/login"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:-translate-y-1"
              >
                <span>ابدأ كمعلم</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/game/00000000-0000-0000-0000-000000000003"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <PlayCircle className="w-5 h-5 text-blue-600" />
                <span>جرب لعبة كطالب</span>
              </Link>
            </motion.div>
          </div>

          {/* Graphical Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-white rounded-[3rem] rotate-3 shadow-xl border border-white/50 backdrop-blur-sm"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] -rotate-3 shadow-lg border border-emerald-50 overflow-hidden p-8 flex flex-col justify-between">
                {/* Abstract UI Elements */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
                     <div className="w-8 h-8 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="w-32 h-4 bg-gray-100 rounded-full ml-auto"></div>
                    <div className="w-24 h-3 bg-gray-50 rounded-full ml-auto"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-center justify-end gap-4 transform transition-all hover:scale-105 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 cursor-default">
                      <div className="flex-1 space-y-2">
                         <div className="w-3/4 h-3 bg-gray-200 rounded-full ml-auto"></div>
                         <div className="w-1/2 h-2 bg-gray-100 rounded-full ml-auto"></div>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 ${i === 1 ? 'bg-blue-100' : i === 2 ? 'bg-purple-100' : 'bg-orange-100'}`}></div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm">
                    إجابة صحيحة
                  </div>
                  <div className="flex -space-x-2 space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-200 border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <Link href="#features" className="flex flex-col items-center text-emerald-600 hover:text-emerald-700 transition-colors">
          <span className="text-sm font-medium mb-2 opacity-70">اكتشف المزيد</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-white/50 backdrop-blur border border-emerald-100 flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}
