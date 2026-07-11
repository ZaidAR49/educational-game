"use client"

import { useState, useRef } from "react"
import { Building2, Save, Upload, X, Loader2, Image as ImageIcon, ArrowRight, Trash2 } from "lucide-react"
import { LivePreview } from "@/components/dashboard/LivePreview"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { uploadLogoAction } from "@/lib/actions/upload.actions"
import { createOrganizationAction, updateOrganizationAction } from "@/lib/actions/organizations.actions"
import { toast } from "sonner"

export type OrganizationFormData = {
  institutionName: string;
  logo: string | null;
  icon: string;
  mainTitle: string;
  subtitle: string;
  welcomeMessage: string;
  buttonText: string;
  resultTitle: string;
  resultSubtitle: string;
  resultMessage: string;
  orgMessage: string;
  resultPrimaryButtonText: string;
  resultSecondaryButtonText: string;
};

interface OrganizationFormProps {
  initialData?: Partial<OrganizationFormData>;
  organizationId?: string;
}

export function OrganizationForm({ initialData, organizationId }: OrganizationFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"welcome" | "result">("welcome")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isSaving, setIsSaving] = useState(false)
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
    resultTitle: initialData?.resultTitle || "لا بأس، استمر!",
    resultSubtitle: initialData?.resultSubtitle || "كل محاولة تعلّم جديد!",
    resultMessage: initialData?.resultMessage || "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!",
    orgMessage: initialData?.orgMessage || "أحسنت على مشاركتك! كل سؤال هو فرصة جديدة للتعلم والنمو. استمر في تطوير معلوماتك ومهاراتك، ونحن واثقون من قدراتك! 🌟",
    resultPrimaryButtonText: initialData?.resultPrimaryButtonText || "العب مرة أخرى 🔄",
    resultSecondaryButtonText: initialData?.resultSecondaryButtonText || "شارك نتيجتك 📊",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.institutionName.trim()) newErrors.institutionName = "الرجاء إدخال اسم المؤسسة"
    if (!formData.mainTitle.trim()) newErrors.mainTitle = "الرجاء إدخال العنوان الرئيسي"
    if (!formData.icon.trim()) newErrors.icon = "مطلوب"
    if (!formData.subtitle.trim()) newErrors.subtitle = "الرجاء إدخال العنوان الفرعي"
    if (!formData.welcomeMessage.trim()) newErrors.welcomeMessage = "الرجاء إدخال رسالة الترحيب"
    if (!formData.buttonText.trim()) newErrors.buttonText = "الرجاء إدخال نص الزر"
    if (!formData.resultTitle.trim()) newErrors.resultTitle = "الرجاء إدخال عنوان النتيجة"
    if (!formData.resultSubtitle.trim()) newErrors.resultSubtitle = "الرجاء إدخال الوصف القصير"
    if (!formData.resultMessage.trim()) newErrors.resultMessage = "الرجاء إدخال رسالة التشجيع"
    if (!formData.orgMessage.trim()) newErrors.orgMessage = "الرجاء إدخال رسالة المؤسسة"
    if (!formData.resultPrimaryButtonText.trim()) newErrors.resultPrimaryButtonText = "مطلوب"
    if (!formData.resultSecondaryButtonText.trim()) newErrors.resultSecondaryButtonText = "مطلوب"

    setErrors(newErrors)
    
    // Auto switch tab if error is in a different tab
    if (newErrors.resultTitle || newErrors.resultSubtitle || newErrors.resultMessage || newErrors.orgMessage || newErrors.resultPrimaryButtonText || newErrors.resultSecondaryButtonText) {
      if (!newErrors.mainTitle && !newErrors.subtitle && !newErrors.welcomeMessage && !newErrors.buttonText && !newErrors.icon) {
        setActiveTab("result")
      }
    } else if (newErrors.mainTitle || newErrors.subtitle || newErrors.welcomeMessage || newErrors.buttonText || newErrors.icon) {
       setActiveTab("welcome")
    }

    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.warning("الرجاء رفع ملف صورة صالح (PNG, JPG, إلخ)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("حجم الصورة يجب أن لا يتجاوز 5 ميجابايت");
      return;
    }

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData({ ...formData, logo: event.target.result as string })
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFormData({ ...formData, logo: null })
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("يوجد بعض الأخطاء في النموذج، يرجى مراجعتها.");
      return;
    }

    setIsSaving(true);
    try {
      let logoUrl = formData.logo;

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        logoUrl = await uploadLogoAction(uploadFormData);
      }

      const orgPayload = {
        name: formData.institutionName,
        logoPath: logoUrl,
        introduction: {
          title: formData.mainTitle,
          subtitle: formData.subtitle,
          welcome_box: {
            description: formData.welcomeMessage,
            closing_question: "هل أنت مستعد لاختبار معلوماتك?"
          },
          button_text: formData.buttonText,
          decorative_emojis: [formData.icon, "✨", "🌟"],
          back_link_text: "العودة للرئيسية"
        },
        resultScreen: {
          title: formData.resultTitle,
          small_description: formData.resultSubtitle,
          message: formData.resultMessage
        }
      };

      if (organizationId) {
        await updateOrganizationAction(organizationId, orgPayload);
      } else {
        await createOrganizationAction(orgPayload);
      }

      router.push("/dashboard/organizations");
    } catch (error) {
      console.error("Save error", error);
      toast.error("حدث خطأ أثناء حفظ المؤسسة. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Back Navigation */}
      <div>
        <Link 
          href="/dashboard/organizations" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمؤسسات</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">إعدادات المؤسسة</h1>
          <p className="text-gray-500">
            أكمل إعداد ملفك التعريفي لتتمكن من إنشاء الألعاب. هذه الإعدادات ستظهر للطلاب في جميع ألعابك.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Form Area (Right Side) */}
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
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${errors.institutionName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                {errors.institutionName && <p className="text-red-500 text-sm font-bold">{errors.institutionName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">شعار المؤسسة</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
                
                {formData.logo ? (
                  <div className="w-full h-40 border border-gray-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-white shadow-sm">
                    <div className="relative w-full h-full p-4 flex items-center justify-center group">
                      <Image 
                        src={formData.logo} 
                        alt="Logo Preview" 
                        fill 
                        className="object-contain p-4 transition-transform group-hover:scale-95" 
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          onClick={triggerFileInput}
                          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-gray-100"
                        >
                          تغيير الشعار
                        </button>
                        <button 
                          onClick={removeLogo}
                          className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={triggerFileInput}
                    className="w-full h-32 border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-2xl flex flex-col items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 opacity-50" />
                    <div className="text-sm font-bold">انقر لرفع صورة الشعار</div>
                    <div className="text-xs text-emerald-600/60 font-medium">PNG, JPG حتى 5MB</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Screen Tabs */}
          <div className="flex bg-gray-100/50 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab("welcome")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'welcome' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              شاشة الترحيب
            </button>
            <button 
              onClick={() => setActiveTab("result")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'result' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              شاشة النتيجة
            </button>
          </div>

          {/* Settings Card */}
          {activeTab === "welcome" && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-bold text-gray-700 block text-right">العنوان الرئيسي</label>
                  <input 
                    type="text" 
                    name="mainTitle"
                    value={formData.mainTitle}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right font-bold text-lg ${errors.mainTitle ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                  />
                  {errors.mainTitle && <p className="text-red-500 text-sm font-bold">{errors.mainTitle}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block text-right">الأيقونة</label>
                  <input 
                    type="text" 
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-center text-xl ${errors.icon ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                  />
                  {errors.icon && <p className="text-red-500 text-sm font-bold">{errors.icon}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">العنوان الفرعي</label>
                <input 
                  type="text" 
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right text-gray-600 ${errors.subtitle ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                {errors.subtitle && <p className="text-red-500 text-sm font-bold">{errors.subtitle}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">نص رسالة الترحيب</label>
                <textarea 
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right text-sm leading-relaxed resize-none ${errors.welcomeMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                {errors.welcomeMessage && <p className="text-red-500 text-sm font-bold">{errors.welcomeMessage}</p>}
                <p className="text-xs text-emerald-600/70 font-medium text-right">
                  يمكنك استخدام أسطر فارغة، سيتم تلوين السطر الأخير باللون الأخضر الغامق.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">نص زر البدء</label>
                <input 
                  type="text" 
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${errors.buttonText ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                {errors.buttonText && <p className="text-red-500 text-sm font-bold">{errors.buttonText}</p>}
              </div>

            </div>
          )}

          {activeTab === "result" && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">عنوان النتيجة (في حال الرسوب أو المحاولة)</label>
                <input 
                  type="text" 
                  name="resultTitle"
                  value={formData.resultTitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right font-bold text-lg text-emerald-700 ${errors.resultTitle ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                {errors.resultTitle && <p className="text-red-500 text-sm font-bold">{errors.resultTitle}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">الوصف القصير</label>
                <input 
                  type="text" 
                  name="resultSubtitle"
                  value={formData.resultSubtitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right text-gray-600 ${errors.resultSubtitle ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                {errors.resultSubtitle && <p className="text-red-500 text-sm font-bold">{errors.resultSubtitle}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">رسالة التشجيع</label>
                <textarea 
                  name="resultMessage"
                  value={formData.resultMessage}
                  onChange={handleChange}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right text-sm leading-relaxed resize-none ${errors.resultMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                {errors.resultMessage && <p className="text-red-500 text-sm font-bold">{errors.resultMessage}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block text-right">رسالة المؤسسة (تظهر أسفل النتيجة)</label>
                <textarea 
                  name="orgMessage"
                  value={formData.orgMessage}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right text-sm leading-relaxed resize-none ${errors.orgMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                />
                {errors.orgMessage && <p className="text-red-500 text-sm font-bold">{errors.orgMessage}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block text-right">نص الزر الرئيسي</label>
                  <input 
                    type="text" 
                    name="resultPrimaryButtonText"
                    value={formData.resultPrimaryButtonText}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${errors.resultPrimaryButtonText ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                  />
                  {errors.resultPrimaryButtonText && <p className="text-red-500 text-sm font-bold">{errors.resultPrimaryButtonText}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block text-right">نص الزر الثانوي</label>
                  <input 
                    type="text" 
                    name="resultSecondaryButtonText"
                    value={formData.resultSecondaryButtonText}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${errors.resultSecondaryButtonText ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'}`}
                  />
                  {errors.resultSecondaryButtonText && <p className="text-red-500 text-sm font-bold">{errors.resultSecondaryButtonText}</p>}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Live Preview Area (Left Side) */}
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
            resultTitle={formData.resultTitle}
            resultSubtitle={formData.resultSubtitle}
            resultMessage={formData.resultMessage}
            orgMessage={formData.orgMessage}
            resultPrimaryButtonText={formData.resultPrimaryButtonText}
            resultSecondaryButtonText={formData.resultSecondaryButtonText}
          />
        </div>

      </div>
    </div>
  )
}
