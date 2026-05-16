import Link from "next/link"
import { config } from "@/lib/config"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-8xl mb-6 animate-bounce">🛡️</div>

        <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-4">
          {config.appName}
        </h1>

        <p className="text-xl text-gray-600 mb-8">{config.campaignSubtitle}</p>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 text-right">
          <p className="text-gray-700 leading-relaxed mb-4">
            لعبة تفاعلية تعليمية للأطفال والمراهقين تهدف إلى تعليمهم كيفية اتخاذ
            القرارات الصحيحة في مواقف الحياة اليومية.
          </p>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-center gap-2 justify-center">
              <span>10 مواقف تفاعلية</span>
              <span>🎯</span>
            </li>
            <li className="flex items-center gap-2 justify-center">
              <span>رسائل توعوية إيجابية</span>
              <span>💡</span>
            </li>
            <li className="flex items-center gap-2 justify-center">
              <span>نظام نقاط ومكافآت</span>
              <span>⭐</span>
            </li>
            <li className="flex items-center gap-2 justify-center">
              <span>مناسبة لجميع الأعمار</span>
              <span>👨‍👩‍👧‍👦</span>
            </li>
          </ul>
        </div>

        <Link
          href={config.routes.game}
          className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          🚀 ابدأ اللعبة
        </Link>

        <p className="mt-8 text-gray-500 text-sm">{config.copyrightText}</p>
      </div>
    </main>
  )
}
