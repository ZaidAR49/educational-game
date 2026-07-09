"use client"

import Link from "next/link"
import { Gamepad2, Users, Target, Trophy, ArrowLeft, Plus } from "lucide-react"

// Static mockup data
const STATS = [
  { label: "إجمالي الألعاب", value: "12", icon: Gamepad2, color: "bg-blue-50 text-blue-600" },
  { label: "إجمالي اللاعبين", value: "1,248", icon: Users, color: "bg-emerald-50 text-emerald-600" },
  { label: "معدل الإكمال", value: "84%", icon: Target, color: "bg-purple-50 text-purple-600" },
  { label: "متوسط النقاط", value: "85/100", icon: Trophy, color: "bg-amber-50 text-amber-600" },
]

const RECENT_GAMES = [
  { id: "1", title: "لعبة التوعية الأسرية", status: "published", plays: 842, date: "2026-07-08" },
  { id: "2", title: "اختبار حقوق الطفل", status: "draft", plays: 0, date: "2026-07-09" },
  { id: "3", title: "تحدي التربية الإيجابية", status: "published", plays: 406, date: "2026-07-01" },
]

export default function OverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">نظرة عامة</h1>
          <p className="text-gray-500">مرحباً بك مجدداً! إليك ملخص لأداء ألعابك ونشاط الطلاب.</p>
        </div>
        <Link 
          href="/dashboard/games/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء لعبة جديدة</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Games & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Games Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">أحدث الألعاب</h2>
            <Link href="/dashboard/games" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              <span>عرض الكل</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50/50 text-gray-500 text-sm">
                <tr>
                  <th className="font-bold py-4 px-6">اسم اللعبة</th>
                  <th className="font-bold py-4 px-6">الحالة</th>
                  <th className="font-bold py-4 px-6">مرات اللعب</th>
                  <th className="font-bold py-4 px-6">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {RECENT_GAMES.map((game) => (
                  <tr key={game.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6 font-bold text-gray-900">{game.title}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        game.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {game.status === 'published' ? 'منشورة' : 'مسودة'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">{game.plays}</td>
                    <td className="py-4 px-6 text-gray-500">{game.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tips / News */}
        <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
          {/* Decorative Background */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full opacity-50 blur-3xl mix-blend-screen" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-700 rounded-full opacity-50 blur-3xl mix-blend-multiply" />
          
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl mb-6">
              💡
            </div>
            <h3 className="text-xl font-black">نصيحة اليوم</h3>
            <p className="text-emerald-50 leading-relaxed text-sm">
              استخدام شاشات نتيجة مخصصة ورسائل تشجيعية من مؤسستك يزيد من حماس الطلاب للعب مرة أخرى وتحسين نتائجهم بنسبة 40%.
            </p>
            <Link 
              href="/dashboard/organizations/new" 
              className="inline-block mt-4 bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm"
            >
              تحديث شاشة النتيجة
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}
