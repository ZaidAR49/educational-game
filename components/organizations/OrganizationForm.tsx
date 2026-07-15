"use client"

import { useState } from "react"
import { Building2, Save, Loader2, ArrowRight, Sparkles } from "lucide-react"
import { LivePreview } from "@/components/dashboard/LivePreview"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { uploadLogoAction } from "@/lib/actions/upload.actions"
import { createOrganizationAction, updateOrganizationAction } from "@/lib/actions/organizations.actions"
import { improveOrganizationFormAction } from "@/lib/actions/ai.actions"
import { toast } from "sonner"
import { LogoUploader } from "./LogoUploader"
import { WelcomeTabFields } from "./WelcomeTabFields"
import { ResultTabFields } from "./ResultTabFields"

export type OrganizationFormData = {
  institutionName: string
  logo: string | null
  icon: string
  mainTitle: string
  subtitle: string
  welcomeMessage: string
  buttonText: string
  resultTitlePass: string
  resultSubtitlePass: string
  resultMessagePass: string
  resultTitleFail: string
  resultSubtitleFail: string
  resultMessageFail: string
  orgMessage: string
  resultPrimaryButtonText: string
  resultSecondaryButtonText: string
}

interface OrganizationFormProps {
  initialData?: Partial<OrganizationFormData>
  organizationId?: string
}

export function OrganizationForm({ initialData, organizationId }: OrganizationFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"welcome" | "result">("welcome")
  const [resultView, setResultView] = useState<"pass" | "fail">("pass")
  const [isSaving, setIsSaving] = useState(false)
  const [isGlobalAiLoading, setIsGlobalAiLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<OrganizationFormData>({
    institutionName: initialData?.institutionName || "مؤسسة جديدة",
    logo: initialData?.logo || null,
    icon: initialData?.icon || "👋",
    mainTitle: initialData?.mainTitle || "اختبر معلوماتك",
    subtitle: initialData?.subtitle || "لعبة تفاعلية تعليمية للجميع",
    welcomeMessage: initialData?.welcomeMessage || "مرحباً بك! 👋\n\nستواجه في هذا الاختبار مجموعة من الأسئلة المتنوعة.\n\nاختر الإجابة الصحيحة في كل سؤال واجمع أكبر عدد من النقاط!\n\nهل أنت مستعد لاختبار معلوماتك؟",
    buttonText: initialData?.buttonText || "ابدأ الاختبار 🚀",
    resultTitlePass: initialData?.resultTitlePass || "ممتاز!",
    resultSubtitlePass: initialData?.resultSubtitlePass || "لقد أثبتّ جدارتك!",
    resultMessagePass: initialData?.resultMessagePass || "أحسنت صنعاً! لقد أتممت الاختبار بنجاح مبهر.",
    resultTitleFail: initialData?.resultTitleFail || "لا بأس، استمر!",
    resultSubtitleFail: initialData?.resultSubtitleFail || "كل محاولة تعلّم جديد!",
    resultMessageFail: initialData?.resultMessageFail || "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!",
    orgMessage: initialData?.orgMessage || "أحسنت على مشاركتك! كل سؤال هو فرصة جديدة للتعلم والنمو. استمر في تطوير معلوماتك ومهاراتك، ونحن واثقون من قدراتك! 🌟",
    resultPrimaryButtonText: initialData?.resultPrimaryButtonText || "العب مرة أخرى 🔄",
    resultSecondaryButtonText: initialData?.resultSecondaryButtonText || "شارك نتيجتك 📊",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.institutionName.trim()) newErrors.institutionName = "الرجاء إدخال اسم المؤسسة"
    if (!formData.mainTitle.trim()) newErrors.mainTitle = "الرجاء إدخال العنوان الرئيسي"
    if (!formData.icon.trim()) newErrors.icon = "مطلوب"
    if (!formData.subtitle.trim()) newErrors.subtitle = "الرجاء إدخال العنوان الفرعي"
    if (!formData.welcomeMessage.trim()) newErrors.welcomeMessage = "الرجاء إدخال رسالة الترحيب"
    if (!formData.buttonText.trim()) newErrors.buttonText = "الرجاء إدخال نص الزر"
    if (!formData.resultTitlePass.trim()) newErrors.resultTitlePass = "مطلوب"
    if (!formData.resultSubtitlePass.trim()) newErrors.resultSubtitlePass = "مطلوب"
    if (!formData.resultMessagePass.trim()) newErrors.resultMessagePass = "مطلوب"
    if (!formData.resultTitleFail.trim()) newErrors.resultTitleFail = "مطلوب"
    if (!formData.resultSubtitleFail.trim()) newErrors.resultSubtitleFail = "مطلوب"
    if (!formData.resultMessageFail.trim()) newErrors.resultMessageFail = "مطلوب"
    if (!formData.orgMessage.trim()) newErrors.orgMessage = "الرجاء إدخال رسالة المؤسسة"
    if (!formData.resultPrimaryButtonText.trim()) newErrors.resultPrimaryButtonText = "مطلوب"
    if (!formData.resultSecondaryButtonText.trim()) newErrors.resultSecondaryButtonText = "مطلوب"

    setErrors(newErrors)
    // Auto-switch tab to the one containing errors
    const hasResultErrors = newErrors.resultTitlePass || newErrors.resultSubtitlePass || newErrors.resultMessagePass || newErrors.resultTitleFail || newErrors.resultSubtitleFail || newErrors.resultMessageFail || newErrors.orgMessage || newErrors.resultPrimaryButtonText || newErrors.resultSecondaryButtonText
    const hasWelcomeErrors = newErrors.mainTitle || newErrors.subtitle || newErrors.welcomeMessage || newErrors.buttonText || newErrors.icon
    if (hasResultErrors && !hasWelcomeErrors) setActiveTab("result")
    else if (hasWelcomeErrors) setActiveTab("welcome")

    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("يوجد بعض الأخطاء في النموذج، يرجى مراجعتها.")
      return
    }

    setIsSaving(true)
    try {
      let logoUrl = formData.logo
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", selectedFile)
        logoUrl = await uploadLogoAction(uploadFormData)
      }

      const orgPayload = {
        name: formData.institutionName,
        logoPath: logoUrl,
        introduction: {
          title: formData.mainTitle,
          subtitle: formData.subtitle,
          welcome_box: { description: formData.welcomeMessage, closing_question: "هل أنت مستعد لاختبار معلوماتك?" },
          button_text: formData.buttonText,
          decorative_emojis: [formData.icon, "✨", "🌟"],
          back_link_text: "العودة للرئيسية",
        },
        resultScreen: {
          pass: {
            title: formData.resultTitlePass,
            small_description: formData.resultSubtitlePass,
            message: formData.resultMessagePass,
          },
          fail: {
            title: formData.resultTitleFail,
            small_description: formData.resultSubtitleFail,
            message: formData.resultMessageFail,
          }
        },
      }

      if (organizationId) {
        await updateOrganizationAction(organizationId, orgPayload)
      } else {
        await createOrganizationAction(orgPayload)
      }
      router.push("/dashboard/organizations")
    } catch (error) {
      console.error("Save error", error)
      toast.error("حدث خطأ أثناء حفظ المؤسسة. الرجاء المحاولة مرة أخرى.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Navigation */}
      <Link
        href="/dashboard/organizations"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للمؤسسات</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">إعدادات المؤسسة</h1>
          <p className="text-gray-500">
            أكمل إعداد ملفك التعريفي لتتمكن من إنشاء الألعاب. هذه الإعدادات ستظهر للطلاب في جميع ألعابك.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">المعلومات الأساسية</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">اسم المؤسسة</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  placeholder="مثال: مدرسة الأمل"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${
                    errors.institutionName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                  }`}
                />
                {errors.institutionName && <p className="text-red-500 text-sm font-bold">{errors.institutionName}</p>}
              </div>

              <LogoUploader
                logo={formData.logo}
                onLogoChange={(dataUrl, file) => { 
                  setFormData({ ...formData, logo: dataUrl });
                  setSelectedFile(file);
                }}
                onLogoRemove={() => { setFormData({ ...formData, logo: null }); setSelectedFile(null) }}
              />
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-100/50 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("welcome")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "welcome" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              شاشة الترحيب
            </button>
            <button
              onClick={() => setActiveTab("result")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "result" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              شاشة النتيجة
            </button>
          </div>

          {activeTab === "welcome" && (
            <WelcomeTabFields 
              formData={formData} 
              errors={errors} 
              onChange={handleChange} 
              onBulkChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
              isGlobalLoading={isGlobalAiLoading}
              onGlobalLoadingChange={setIsGlobalAiLoading}
            />
          )}
          {activeTab === "result" && (
            <ResultTabFields 
              formData={formData} 
              errors={errors} 
              onChange={handleChange} 
              onBulkChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
              resultView={resultView}
              onResultViewChange={setResultView}
              isGlobalLoading={isGlobalAiLoading}
              onGlobalLoadingChange={setIsGlobalAiLoading}
            />
          )}

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md w-full md:w-auto text-lg"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 sticky top-8">
          <LivePreview
            previewMode={activeTab}
            institutionName={formData.institutionName}
            logo={formData.logo}
            mainTitle={formData.mainTitle}
            subtitle={formData.subtitle}
            welcomeMessage={formData.welcomeMessage}
            buttonText={formData.buttonText}
            icon={formData.icon}
            resultTitlePass={formData.resultTitlePass}
            resultSubtitlePass={formData.resultSubtitlePass}
            resultMessagePass={formData.resultMessagePass}
            resultTitleFail={formData.resultTitleFail}
            resultSubtitleFail={formData.resultSubtitleFail}
            resultMessageFail={formData.resultMessageFail}
            orgMessage={formData.orgMessage}
            resultPrimaryButtonText={formData.resultPrimaryButtonText}
            resultSecondaryButtonText={formData.resultSecondaryButtonText}
            resultPreviewState={resultView}
            onResultPreviewStateChange={setResultView}
          />
        </div>
      </div>
    </div>
  )
}
