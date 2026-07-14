import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params.error;

  if (error === "AccessDenied") {
    redirect("/blocked");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-orange-50 p-8 flex flex-col items-center justify-center border-b border-orange-100">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 text-center">حدث خطأ في تسجيل الدخول</h1>
          <p className="text-gray-600 text-center text-sm max-w-xs">
            {error === "Configuration" 
              ? "يوجد خطأ في إعدادات الخادم. يرجى المحاولة لاحقاً."
              : "لم نتمكن من إتمام عملية تسجيل الدخول. يرجى المحاولة مرة أخرى."}
          </p>
        </div>

        <div className="p-8 space-y-6 text-center">
          <Link 
            href="/login" 
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md"
          >
            <span>المحاولة مرة أخرى</span>
          </Link>
          <div className="pt-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
