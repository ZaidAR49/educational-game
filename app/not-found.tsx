import Link from "next/link"
import { Home, Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-200/40 blur-3xl rounded-full scale-150 -z-10"></div>
          <div className="relative flex justify-center">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center rotate-[15deg] hover:rotate-0 transition-all duration-500 ease-out group">
              <Compass className="w-16 h-16 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-500" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-8xl font-black text-gray-900 tracking-tighter drop-shadow-sm">404</h1>
          <h2 className="text-2xl font-bold text-gray-800">عفواً، الصفحة غير موجودة</h2>
          <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
            يبدو أنك ضللت الطريق. الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى رابط آخر.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            <Home className="w-5 h-5" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
