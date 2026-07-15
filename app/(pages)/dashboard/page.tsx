export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { Gamepad2, Users, Target, Trophy, ArrowLeft, Plus, Building2, ListChecks, Zap, AlertTriangle } from "lucide-react"
import { getDashboardOverviewAction } from "@/lib/actions/dashboard.actions"
import { requireAuth } from "@/lib/actions/utils"
import DashboardCharts from "@/components/dashboard/DashboardCharts"

export default async function OverviewPage() {
  const user = await requireAuth();
  const data = await getDashboardOverviewAction();

  const STATS = [
    { label: "إجمالي الألعاب", value: data.stats.totalGames.toString(), icon: Gamepad2, color: "bg-blue-50 text-blue-600" },
    { label: "إجمالي اللاعبين", value: data.stats.totalPlayers.toLocaleString(), icon: Users, color: "bg-emerald-50 text-emerald-600" },
    { label: "المؤسسات التابعة لك", value: data.stats.totalOrgs.toString(), icon: Building2, color: "bg-purple-50 text-purple-600" },
    { label: "إجمالي الأسئلة", value: data.stats.totalScenarios.toString(), icon: ListChecks, color: "bg-amber-50 text-amber-600" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img src={user.image} alt={user.name || "Profile"} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <h1 className="text-xl font-black text-gray-900 mb-0.5">مرحباً بك، {user.name} 👋</h1>
            <p className="text-gray-500 font-medium text-sm">إليك ملخص لأداء ألعابك ونشاط الطلاب اليوم.</p>
          </div>
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
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-xl font-black text-gray-900">{stat.value}</h3>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Token Usage */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        
        {/* Left side: Icon + Title */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">استهلاك الذكاء الاصطناعي</h2>
            <p className="text-sm font-medium text-gray-500">
              إجمالي الرصيد المستخدم هذا الشهر (توليد الألعاب)
            </p>
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="flex-1 w-full flex flex-col gap-2 max-w-xl md:mx-auto">
          <div className="flex justify-between items-end text-sm mb-1">
            <span className="font-bold text-gray-900 text-lg">
              {data.aiUsage.used.toLocaleString()} <span className="text-gray-500 font-medium text-sm">توكن مستخدم</span>
            </span>
            <span className="font-bold text-gray-900 text-sm">
              <span className="text-gray-500 font-medium">الحد الأقصى</span> {data.aiUsage.limit.toLocaleString()}
            </span>
          </div>
          
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${data.aiUsage.isOverLimit ? 'bg-red-500' : 'bg-indigo-500'}`}
              style={{ width: `${Math.min((data.aiUsage.used / data.aiUsage.limit) * 100, 100)}%` }}
            />
          </div>

          {data.aiUsage.isOverLimit && (
            <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 mt-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              لقد استنفدت الحد المسموح به لهذا الشهر. يرجى الانتظار لتجديد الرصيد.
            </p>
          )}
        </div>

        {/* Right side: Total requests */}
        <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-r border-gray-100 pt-4 md:pt-0 md:pr-6 shrink-0">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">الطلبات الكلية</p>
            <p className="text-2xl font-black text-gray-900">{data.aiUsage.requests}</p>
          </div>
        </div>
      </div>

      {/* Student Behavior Analytics Charts */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">تحليل سلوك الطلاب</h2>
        <DashboardCharts
          scoreDistribution={data.scoreDistribution}
          accuracyData={data.accuracyData}
          completionData={data.completionData}
        />
      </div>

      {/* Recent Games & Activity */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Recent Games Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">أحدث الألعاب</h2>
            <Link href="/dashboard/games" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              <span>عرض الكل</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {data.recentGames.length > 0 ? (
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
                  {data.recentGames.map((game) => (
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
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد ألعاب بعد</h3>
                <p className="text-gray-500 mb-6">قم بإنشاء لعبتك الأولى لتبدأ برؤية الإحصائيات هنا.</p>
                <Link 
                  href="/dashboard/games/new"
                  className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-xl font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء لعبة جديدة</span>
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
