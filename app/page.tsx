import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-8xl mb-6 animate-bounce">🛡️</div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-4">
          بطل القرارات الصحيحة
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8">
          حملة توعوية من جمعية حماية الأسرة والطفولة
        </p>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 text-right">
          <p className="text-gray-700 leading-relaxed mb-4">
            لعبة تفاعلية تعليمية للأطفال والمراهقين تهدف إلى تعليمهم كيفية اتخاذ القرارات الصحيحة في مواقف الحياة اليومية.
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

        {/* Play Button */}
        <Link
          href="/game"
          className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          🚀 ابدأ اللعبة
        </Link>

        {/* Footer */}
        <p className="mt-8 text-gray-500 text-sm">
          جميع الحقوق محفوظة © جمعية حماية الأسرة 2026
        </p>
      </div>
    </main>
  )
}
