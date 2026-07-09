"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function CallToAction() {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-900">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            مستعد للارتقاء بتجربة طلابك التعليمية؟
          </h2>
          <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
            انضم إلى العديد من المعلمين الذين يستخدمون المنصة لجعل التعلم ممتعاً وتفاعلياً.
            إنشاء حسابك لن يستغرق سوى دقيقة واحدة.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-emerald-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-1"
            >
              <span>أنشئ حسابك</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
