"use client"

import { motion } from "framer-motion"
import { Users, CheckCircle2, XCircle } from "lucide-react"

type LiveLeaderboardTableProps = {
  sortedStudents: any[]
}

export function LiveLeaderboardTable({ sortedStudents }: LiveLeaderboardTableProps) {
  return (
    <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col h-[450px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">ترتيب الطلاب</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {sortedStudents.length > 0 ? sortedStudents.map((student, index) => (
          <motion.div 
            key={student.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border ${
              index === 0 ? 'bg-amber-50 border-amber-200' : 
              index === 1 ? 'bg-slate-50 border-slate-200' : 
              index === 2 ? 'bg-orange-50 border-orange-200' : 
              'bg-white border-gray-100'
            }`}
          >
            {/* Rank Number */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
              index === 0 ? 'bg-amber-400 text-white' : 
              index === 1 ? 'bg-slate-400 text-white' : 
              index === 2 ? 'bg-orange-400 text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              {index + 1}
            </div>
            
            {/* Student Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 truncate">{student.name}</h4>
                {!student.isConnected && (
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">أكمل الاختبار</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs font-medium mt-1">
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {student.correct} صح
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <XCircle className="w-3.5 h-3.5" />
                  {student.wrong} خطأ
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="shrink-0 text-right">
              <div className="text-xl font-black text-gray-900">{student.score}</div>
              <div className="text-xs text-gray-400 font-medium">نقطة</div>
            </div>
          </motion.div>
        )) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Users className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-bold">لا يوجد طلاب متصلين حالياً</p>
          </div>
        )}
      </div>
    </div>
  )
}
