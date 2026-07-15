"use client"

import { useEffect } from "react"
import { AlertOctagon, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl"></div>

        <div className="flex justify-center relative">
          <div className="w-24 h-24 bg-red-50 rounded-[1.5rem] flex items-center justify-center border-4 border-red-100 relative shadow-inner">
            <div className="absolute inset-0 bg-red-500/10 animate-pulse rounded-[1.25rem]"></div>
            <AlertOctagon className="w-12 h-12 text-red-500 relative z-10 drop-shadow-sm" />
          </div>
        </div>
        
        <div className="space-y-3 relative z-10">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">حدث خطأ غير متوقع</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            نعتذر عن هذا الخلل. يبدو أن هناك مشكلة ما حدثت أثناء معالجة طلبك.
          </p>
        </div>

        <div className="pt-6 relative z-10">
          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-600/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            <RotateCcw className="w-5 h-5" />
            <span>حاول مرة أخرى</span>
          </button>
        </div>
      </div>
    </div>
  )
}
