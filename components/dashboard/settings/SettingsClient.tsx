"use client"

import { useState, useEffect, useTransition } from "react"
import { Save, UserCircle2, Mail, Loader2, Zap, Star, Globe } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateUserAction, deleteUserAccountAction } from "@/lib/actions/users.actions"
import { useSession, signOut } from "next-auth/react"
import { useLocale } from "@/lib/i18n/LanguageContext"

interface SettingsClientProps {
  session: any
  isSubscribed: boolean
  subscriptionPlan: string | null
  initialLocale?: string
}

export default function SettingsClient({ session, isSubscribed, subscriptionPlan, initialLocale = "ar" }: SettingsClientProps) {
  const router = useRouter()
  const { t, isRTL, locale: activeLocale, setLocale } = useLocale()
  const s = t.settings
  const { update: updateSession } = useSession()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  const [error, setError] = useState<string>("")
  const [deleteError, setDeleteError] = useState<string>("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    locale: (activeLocale === "ar" || activeLocale === "en") ? activeLocale : (initialLocale || "ar"),
  })

  // Sync formData.locale if activeLocale changes (e.g. from navbar switcher)
  useEffect(() => {
    if (activeLocale && (activeLocale === "ar" || activeLocale === "en")) {
      setFormData((prev) => ({ ...prev, locale: activeLocale }))
    }
  }, [activeLocale])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      setError(s.fullNameReq)
      return;
    }
    
    startTransition(async () => {
      try {
        const targetLocale = (formData.locale === "ar" || formData.locale === "en")
          ? formData.locale
          : (activeLocale || "ar");

        await updateUserAction({ name: formData.name, locale: targetLocale });
        await updateSession({ name: formData.name, locale: targetLocale });
        setLocale(targetLocale as "ar" | "en");
        toast.success(s.savedToast);
        router.refresh();
      } catch (err) {
        console.error("Failed to save settings", err);
        toast.error(s.saveErrorToast);
      }
    });
  }

  const handleDeleteAccount = () => {
    const expectedName = session?.user?.name || "";
    if (deleteConfirmation !== expectedName) {
      setDeleteError(s.deleteConfirmError.replace("{name}", expectedName))
      return;
    }
    
    startDeleteTransition(async () => {
      try {
        const result = await deleteUserAccountAction();
        if (result && !result.success) {
          setDeleteError(result.error || s.deleteErrorToast);
          return;
        }
        toast.success(s.deletedToast);
        await signOut({ callbackUrl: '/' });
      } catch (err: any) {
        console.error("Failed to delete account", err);
        setDeleteError(s.deleteErrorToast);
        toast.error(s.deleteErrorToast);
      }
    });
  }

  const userImage = session?.user?.image

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{s.title}</h1>
          <p className="text-gray-500">
            {s.subtitle}
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{isPending ? s.saving : s.saveChanges}</span>
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
              <h3 className="text-lg font-black text-amber-900">{s.proActiveTitle}</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3 fill-white" /> PRO
              </span>
            </div>
            <p className="text-sm text-amber-700">{s.proActiveDesc}</p>
          </div>

          <Star className="w-6 h-6 text-amber-400 fill-amber-200 shrink-0" />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-5 bg-gradient-to-l from-slate-50 to-gray-50 border border-gray-200 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-300 to-gray-400 flex items-center justify-center shadow-sm shrink-0">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-800 mb-0.5">{s.freePlanTitle}</h3>
            <p className="text-sm text-gray-500">{s.freePlanDesc}</p>
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
            <h3 className="text-lg font-bold text-gray-900 mb-1">{s.profilePicTitle}</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              {s.profilePicDesc}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-emerald-500" />
            <span>{s.personalInfoTitle}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">{s.fullName}</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full ${isRTL ? 'pl-4 pr-11 text-right' : 'pr-4 pl-11 text-left'} py-3 rounded-xl border focus:ring-2 outline-none transition-all ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                <UserCircle2 className={`w-5 h-5 absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">{s.email}</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  disabled
                  className={`w-full ${isRTL ? 'pl-4 pr-11' : 'pr-4 pl-11'} py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-sans`}
                  dir="ltr"
                />
                <Mail className={`w-5 h-5 text-gray-400 absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{s.emailNotice}</p>
            </div>
          </div>

          {/* Language Preferences */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <span>{s.languageTitle}</span>
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {s.languageDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, locale: "ar" }))
                  setLocale("ar")
                }}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-start ${
                  formData.locale === "ar"
                    ? "border-emerald-500 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇸🇦</span>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{s.langArabic}</div>
                    <div className="text-[11px] text-gray-500">اللغة العربية (الافتراضية)</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.locale === "ar" ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300"
                }`}>
                  {formData.locale === "ar" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, locale: "en" }))
                  setLocale("en")
                }}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-start ${
                  formData.locale === "en"
                    ? "border-emerald-500 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇺🇸</span>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{s.langEnglish}</div>
                    <div className="text-[11px] text-gray-500">English language</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.locale === "en" ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300"
                }`}>
                  {formData.locale === "en" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-6 pt-8 border-t border-red-100">
          <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100">
            <h3 className="text-lg font-bold text-red-900 mb-2">{s.dangerZone}</h3>
            <p className="text-sm text-red-700 mb-6">
              {s.dangerZoneDesc}
            </p>
            <button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setDeleteError("");
                setDeleteConfirmation("");
              }}
              className="bg-white border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
            >
              {s.deleteAccountBtn}
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir={isRTL ? "rtl" : "ltr"}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 transform transition-all animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-4">{s.deleteModalTitle}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {s.deleteModalDesc1} <strong className="text-red-600 font-black">{s.deleteModalDescBold}</strong>. {s.deleteModalDesc2}<br/><br/>
              {s.deleteModalPrompt.replace("{name}", session?.user?.name || "")}
            </p>
            
            <div className="space-y-4 mb-8">
              <input 
                type="text" 
                value={deleteConfirmation}
                onChange={(e) => {
                  setDeleteConfirmation(e.target.value);
                  setDeleteError("");
                }}
                placeholder={s.deleteModalPlaceholder.replace("{name}", session?.user?.name || "")}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${deleteError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-red-500 focus:ring-red-200'}`}
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
                <span>{isDeleting ? s.saving : s.confirmDeleteBtn}</span>
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all"
              >
                {s.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
