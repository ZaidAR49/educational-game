"use client"

import { useState, useEffect } from "react"
import { Building2, Save, Loader2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
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
import { useLocale } from "@/lib/i18n/LanguageContext"

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

export const DEFAULT_ORG_FORM_AR: OrganizationFormData = {
  institutionName: "مؤسسة جديدة",
  logo: null,
  icon: "👋",
  mainTitle: "اختبر معلوماتك",
  subtitle: "لعبة تفاعلية تعليمية للجميع",
  welcomeMessage: "مرحباً بك! 👋\n\nستواجه في هذا الاختبار مجموعة من الأسئلة المتنوعة.\n\nاختر الإجابة الصحيحة في كل سؤال واجمع أكبر عدد من النقاط!\n\nهل أنت مستعد لاختبار معلوماتك؟",
  buttonText: "ابدأ الاختبار 🚀",
  resultTitlePass: "ممتاز!",
  resultSubtitlePass: "لقد أثبتّ جدارتك!",
  resultMessagePass: "أحسنت صنعاً! لقد أتممت الاختبار بنجاح مبهر.",
  resultTitleFail: "لا بأس، استمر!",
  resultSubtitleFail: "كل محاولة تعلّم جديد!",
  resultMessageFail: "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!",
  orgMessage: "أحسنت على مشاركتك! كل سؤال هو فرصة جديدة للتعلم والنمو. استمر في تطوير معلوماتك ومهاراتك، ونحن واثقون من قدراتك! 🌟",
  resultPrimaryButtonText: "العب مرة أخرى 🔄",
  resultSecondaryButtonText: "شارك نتيجتك 📊",
}

export const DEFAULT_ORG_FORM_EN: OrganizationFormData = {
  institutionName: "New Organization",
  logo: null,
  icon: "👋",
  mainTitle: "Test Your Knowledge",
  subtitle: "Interactive educational quiz for everyone",
  welcomeMessage: "Welcome! 👋\n\nIn this quiz, you will face a variety of interesting questions.\n\nChoose the correct answer for each question and score maximum points!\n\nAre you ready to test your knowledge?",
  buttonText: "Start Quiz 🚀",
  resultTitlePass: "Excellent!",
  resultSubtitlePass: "You proved your skills!",
  resultMessagePass: "Well done! You completed the quiz with impressive results.",
  resultTitleFail: "Don't give up, keep going!",
  resultSubtitleFail: "Every attempt is a new lesson!",
  resultMessageFail: "Don't lose hope! Every mistake is an opportunity to learn something new. Try again!",
  orgMessage: "Great job participating! Every question is a chance to learn and grow. Keep developing your skills, we believe in you! 🌟",
  resultPrimaryButtonText: "Play Again 🔄",
  resultSecondaryButtonText: "Share Result 📊",
}

interface OrganizationFormProps {
  initialData?: Partial<OrganizationFormData>
  organizationId?: string
}

export function OrganizationForm({ initialData, organizationId }: OrganizationFormProps) {
  const router = useRouter()
  const { t, isRTL } = useLocale()
  const o = t.orgForm

  const [activeTab, setActiveTab] = useState<"welcome" | "result">("welcome")
  const [resultView, setResultView] = useState<"pass" | "fail">("pass")
  const [isSaving, setIsSaving] = useState(false)
  const [isGlobalAiLoading, setIsGlobalAiLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<OrganizationFormData>(() => {
    const defaults = isRTL ? DEFAULT_ORG_FORM_AR : DEFAULT_ORG_FORM_EN
    return {
      ...defaults,
      ...initialData,
    }
  })

  // Synchronize defaults with selected language if fields haven't been customized by the user
  useEffect(() => {
    if (organizationId) return
    setFormData((prev) => {
      const targetDefaults = isRTL ? DEFAULT_ORG_FORM_AR : DEFAULT_ORG_FORM_EN
      const otherDefaults = isRTL ? DEFAULT_ORG_FORM_EN : DEFAULT_ORG_FORM_AR

      const shouldUpdate = (val: string, key: keyof OrganizationFormData) =>
        !val || val === otherDefaults[key] || val === targetDefaults[key]

      return {
        ...prev,
        institutionName: shouldUpdate(prev.institutionName, "institutionName") ? targetDefaults.institutionName : prev.institutionName,
        mainTitle: shouldUpdate(prev.mainTitle, "mainTitle") ? targetDefaults.mainTitle : prev.mainTitle,
        subtitle: shouldUpdate(prev.subtitle, "subtitle") ? targetDefaults.subtitle : prev.subtitle,
        welcomeMessage: shouldUpdate(prev.welcomeMessage, "welcomeMessage") ? targetDefaults.welcomeMessage : prev.welcomeMessage,
        buttonText: shouldUpdate(prev.buttonText, "buttonText") ? targetDefaults.buttonText : prev.buttonText,
        resultTitlePass: shouldUpdate(prev.resultTitlePass, "resultTitlePass") ? targetDefaults.resultTitlePass : prev.resultTitlePass,
        resultSubtitlePass: shouldUpdate(prev.resultSubtitlePass, "resultSubtitlePass") ? targetDefaults.resultSubtitlePass : prev.resultSubtitlePass,
        resultMessagePass: shouldUpdate(prev.resultMessagePass, "resultMessagePass") ? targetDefaults.resultMessagePass : prev.resultMessagePass,
        resultTitleFail: shouldUpdate(prev.resultTitleFail, "resultTitleFail") ? targetDefaults.resultTitleFail : prev.resultTitleFail,
        resultSubtitleFail: shouldUpdate(prev.resultSubtitleFail, "resultSubtitleFail") ? targetDefaults.resultSubtitleFail : prev.resultSubtitleFail,
        resultMessageFail: shouldUpdate(prev.resultMessageFail, "resultMessageFail") ? targetDefaults.resultMessageFail : prev.resultMessageFail,
        orgMessage: shouldUpdate(prev.orgMessage, "orgMessage") ? targetDefaults.orgMessage : prev.orgMessage,
        resultPrimaryButtonText: shouldUpdate(prev.resultPrimaryButtonText, "resultPrimaryButtonText") ? targetDefaults.resultPrimaryButtonText : prev.resultPrimaryButtonText,
        resultSecondaryButtonText: shouldUpdate(prev.resultSecondaryButtonText, "resultSecondaryButtonText") ? targetDefaults.resultSecondaryButtonText : prev.resultSecondaryButtonText,
      }
    })
  }, [isRTL, organizationId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.institutionName.trim()) newErrors.institutionName = isRTL ? "الرجاء إدخال اسم المؤسسة" : "Please enter organization name"
    if (!formData.mainTitle.trim()) newErrors.mainTitle = isRTL ? "الرجاء إدخال العنوان الرئيسي" : "Please enter main title"
    if (!formData.icon.trim()) newErrors.icon = isRTL ? "مطلوب" : "Required"
    if (!formData.subtitle.trim()) newErrors.subtitle = isRTL ? "الرجاء إدخال العنوان الفرعي" : "Please enter subtitle"
    if (!formData.welcomeMessage.trim()) newErrors.welcomeMessage = isRTL ? "الرجاء إدخال رسالة الترحيب" : "Please enter welcome message"
    if (!formData.buttonText.trim()) newErrors.buttonText = isRTL ? "الرجاء إدخال نص الزر" : "Please enter button text"
    if (!formData.resultTitlePass.trim()) newErrors.resultTitlePass = isRTL ? "مطلوب" : "Required"
    if (!formData.resultSubtitlePass.trim()) newErrors.resultSubtitlePass = isRTL ? "مطلوب" : "Required"
    if (!formData.resultMessagePass.trim()) newErrors.resultMessagePass = isRTL ? "مطلوب" : "Required"
    if (!formData.resultTitleFail.trim()) newErrors.resultTitleFail = isRTL ? "مطلوب" : "Required"
    if (!formData.resultSubtitleFail.trim()) newErrors.resultSubtitleFail = isRTL ? "مطلوب" : "Required"
    if (!formData.resultMessageFail.trim()) newErrors.resultMessageFail = isRTL ? "مطلوب" : "Required"
    if (!formData.orgMessage.trim()) newErrors.orgMessage = isRTL ? "الرجاء إدخال رسالة المؤسسة" : "Please enter organization message"
    if (!formData.resultPrimaryButtonText.trim()) newErrors.resultPrimaryButtonText = isRTL ? "مطلوب" : "Required"
    if (!formData.resultSecondaryButtonText.trim()) newErrors.resultSecondaryButtonText = isRTL ? "مطلوب" : "Required"

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
      toast.error(o.validationError)
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
          welcome_box: { description: formData.welcomeMessage, closing_question: isRTL ? "هل أنت مستعد لاختبار معلوماتك?" : "Are you ready to test your knowledge?" },
          button_text: formData.buttonText,
          decorative_emojis: [formData.icon, "✨", "🌟"],
          back_link_text: o.backToOrgs,
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
      toast.error(o.saveError)
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
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{o.backToOrgs}</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {organizationId ? o.editTitle : o.newTitle}
          </h1>
          <p className="text-gray-500">
            {organizationId ? o.editSubtitle : o.newSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Form Area */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl p-4.5 sm:p-5 border border-gray-100 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{o.basicInfo}</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{o.orgNameLabel}</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  placeholder={o.orgNamePlaceholder}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:ring-2 outline-none transition-all text-start font-medium text-sm sm:text-base ${
                    errors.institutionName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                  }`}
                />
                {errors.institutionName && <p className="text-red-500 text-xs sm:text-sm font-bold">{errors.institutionName}</p>}
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
          <div className="flex bg-gray-100/50 p-1 rounded-xl sm:rounded-2xl">
            <button
              onClick={() => setActiveTab("welcome")}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === "welcome" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {o.tabWelcome}
            </button>
            <button
              onClick={() => setActiveTab("result")}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === "result" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {o.tabResult}
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
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm w-full md:w-auto text-sm sm:text-base"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? o.saving : o.saveChanges}</span>
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
