"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { HeadphonesIcon, MessageSquare } from "lucide-react"

export function ContactCTA() {
  return (
    <section className="py-16 relative bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-800/40 border border-gray-700/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-right gap-3">
            <div className="flex items-center gap-4 mb-1">
              <div className="w-14 h-14 bg-gray-800/80 text-emerald-400 rounded-2xl flex items-center justify-center border border-gray-700 shadow-inner">
                <HeadphonesIcon className="w-7 h-7" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                هل لديك استفسار أو تحتاج مساعدة؟
              </h2>
            </div>
            <p className="text-gray-400 text-base md:text-lg max-w-xl md:mr-16">
              فريقنا متواجد دائماً للإجابة على أسئلتك ومساعدتك في توفير أفضل تجربة تعليمية لطلابك.
            </p>
          </div>
          
          <Link
            href="/contact"
            className="shrink-0 group flex items-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold px-8 py-4.5 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <span>تواصل معنا الآن</span>
            <MessageSquare className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-colors" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
