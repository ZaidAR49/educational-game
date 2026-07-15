"use client"

import { useState, useTransition } from "react"
import { Save, UserCircle2, Mail, Loader2, Zap, Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateUserAction, deleteUserAccountAction } from "@/lib/actions/users.actions"
import { useSession, signOut } from "next-auth/react"

interface SettingsClientProps {
  session: any
  isSubscribed: boolean
  subscriptionPlan: string | null
}

export default function SettingsClient({ session, isSubscribed, subscriptionPlan }: SettingsClientProps) {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  const [error, setError] = useState<string>("")
  const [deleteError, setDeleteError] = useState<string>("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  // Use session data if available, fallback to mock data
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      setError("الرجاء إدخال الاسم الكامل")
      return;
    }
    
    startTransition(async () => {
      try {
        await updateUserAction({ name: formData.name });
        
        // This updates the client session without a full page reload
        await updateSession({ name: formData.name });
        
        // Refresh server components
        router.refresh();
      } catch (error) {
        console.error("Failed to save settings", error);
        toast.error("حدث خطأ أثناء الحفظ.");
      }
    });
  }

  const handleDeleteAccount = () => {
    const expectedName = session?.user?.name || "";
    if (deleteConfirmation !== expectedName) {
      setDeleteError(`الرجاء كتابة '${expectedName}' للتأكيد`)
      return;
    }
    
    startDeleteTransition(async () => {
      try {
        const result = await deleteUserAccountAction();
        if (result && !result.success) {
          setDeleteError(result.error || "حدث خطأ أثناء محاولة حذف الحساب.");
          return;
        }
        toast.success("تم حذف حسابك بنجاح");
        await signOut({ callbackUrl: '/' });
      } catch (error: any) {
        console.error("Failed to delete account", error);
        setDeleteError("حدث خطأ أثناء محاولة حذف الحساب.");
        toast.error("حدث خطأ أثناء حذف الحساب.");
      }
    });
  }

  const userImage = session?.user?.image

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">إعدادات الحساب</h1>
          <p className="text-gray-500">
            تحديث المعلومات الشخصية الخاصة بك.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{isPending ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
        </button>
      </div>

      {/* ── Subscription Status Card ── */}
      {isSubscribed ? (
        <div className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-5 bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
          {/* Decorative glow */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-300/20 rounded-full blur-2xl" />

          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-200 shrink-0">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>

          <div className="relative flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-lg font-black text-amber-900">باقة Pro مفعّلة</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3 fill-white" /> PRO
              </span>
            </div>
            <p className="text-sm text-amber-700">أنت تستمتع بكامل مميزات المنصة بدون قيود.</p>
          </div>

          <Star className="w-6 h-6 text-amber-400 fill-amber-200 shrink-0" />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-5 bg-gradient-to-l from-slate-50 to-gray-50 border border-gray-200 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-300 to-gray-400 flex items-center justify-center shadow-sm shrink-0">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-800 mb-0.5">الباقة المجانية</h3>
            <p className="text-sm text-gray-500">تواصل مع المسؤول للترقية إلى Pro والوصول لكامل المميزات.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-10">
        
        {/* Profile Picture Section (Read-only) */}
        <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative">
            {userImage ? (
              <Image src={userImage} alt="Profile" fill className="object-cover" />
            ) : (
              <UserCircle2 className="w-12 h-12 text-emerald-300" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">الصورة الشخصية</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              يتم سحب صورتك الشخصية تلقائياً من مزود تسجيل الدخول الخاص بك (مثل Google). لا يمكنك تغييرها من هنا.
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-emerald-500" />
            <span>المعلومات الشخصية</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">الاسم الكامل</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-4 pr-11 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                <UserCircle2 className={`w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed text-right font-sans"
                  dir="ltr"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-gray-500 font-medium">لا يمكن تغيير البريد الإلكتروني لأنه مرتبط بحساب Google الخاص بك.</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-6 pt-8 border-t border-red-100">
          <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100">
            <h3 className="text-lg font-bold text-red-900 mb-2">منطقة الخطر</h3>
            <p className="text-sm text-red-700 mb-6">
              بمجرد حذف حسابك، سيتم مسح جميع بياناتك، والمنظمات التي تمتلكها، والألعاب التي قمت بإنشائها نهائياً ولن تتمكن من استعادتها.
            </p>
            <button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setDeleteError("");
                setDeleteConfirmation("");
              }}
              className="bg-white border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
            >
              حذف الحساب نهائياً
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 transform transition-all animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-4">هل أنت متأكد من حذف الحساب؟</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              هذا الإجراء <strong>نهائي ولا يمكن التراجع عنه</strong>. سيتم حذف جميع الألعاب والمنظمات التابعة لك.<br/><br/>
              لتأكيد الحذف، الرجاء كتابة اسمك <strong>{session?.user?.name}</strong> أدناه.
            </p>
            
            <div className="space-y-4 mb-8">
              <input 
                type="text" 
                value={deleteConfirmation}
                onChange={(e) => {
                  setDeleteConfirmation(e.target.value);
                  setDeleteError("");
                }}
                placeholder={`اكتب '${session?.user?.name}' هنا...`}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${deleteError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-red-500 focus:ring-red-200'}`}
              />
              {deleteError && <p className="text-red-500 text-sm font-bold">{deleteError}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== (session?.user?.name || "")}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                <span>{isDeleting ? "جاري الحذف..." : "نعم، احذف حسابي"}</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
