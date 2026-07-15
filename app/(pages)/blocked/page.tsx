import Link from "next/link"
import { Ban, ShieldAlert, ArrowRight } from "lucide-react"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function BlockedPage() {
  // Fetch the super admin's email
  const superAdmin = await db.query.users.findFirst({
    where: eq(users.role, "super_admin"),
    columns: { email: true }
  });
  const supportEmail = superAdmin?.email || "support@example.com";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 relative">
            <ShieldAlert className="w-10 h-10" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 text-center">تم حظر حسابك</h1>
          <p className="text-gray-600 text-center text-sm max-w-xs">
            لقد تم إيقاف حسابك من قبل الإدارة ولا يمكنك الوصول إلى المنصة حالياً.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-1">ماذا يعني هذا؟</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>لا يمكنك الدخول إلى لوحة التحكم</li>
              <li>تم إيقاف جميع الألعاب المرتبطة بحسابك</li>
              <li>لا يمكنك التفاعل مع النظام</li>
            </ul>
          </div>

          <div className="pt-2">
            <Link 
              href={`mailto:${supportEmail}`}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md"
            >
              <span>التواصل مع الدعم الفني</span>
            </Link>
          </div>

          <div className="text-center">
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
  )
}
