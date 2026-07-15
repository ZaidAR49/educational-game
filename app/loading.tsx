import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl animate-pulse opacity-40"></div>
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin relative z-10" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-900 font-bold text-lg animate-pulse">جاري التحميل</p>
          <p className="text-gray-400 text-sm">يرجى الانتظار قليلاً...</p>
        </div>
      </div>
    </div>
  )
}
