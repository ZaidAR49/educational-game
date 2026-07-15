import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { improveOrganizationFormAction } from "@/lib/actions/ai.actions"
import { AiImproveButton } from "./AiImproveButton"
import type { OrganizationFormData } from "./OrganizationForm"

type WelcomeTabFieldsProps = {
  formData: OrganizationFormData
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBulkChange: (data: Partial<OrganizationFormData>) => void
  isGlobalLoading?: boolean
  onGlobalLoadingChange?: (isLoading: boolean) => void
}

export function WelcomeTabFields({ formData, errors, onChange, onBulkChange, isGlobalLoading, onGlobalLoadingChange }: WelcomeTabFieldsProps) {
  const field = (name: keyof OrganizationFormData, error?: string, extra?: string) =>
    `w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${extra || ""} ${
      error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`

  const handleEnhanceSection = async () => {
    if (onGlobalLoadingChange) onGlobalLoadingChange(true);
    const loadingToast = toast.loading("جاري تحسين نصوص شاشة الترحيب...");
    try {
      const sectionData = {
        mainTitle: formData.mainTitle,
        subtitle: formData.subtitle,
        welcomeMessage: formData.welcomeMessage,
        buttonText: formData.buttonText,
      };
      
      const improvedData = await improveOrganizationFormAction(sectionData);
      onBulkChange(improvedData);
      toast.success("تم تحسين نصوص الترحيب بنجاح!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحسين النصوص.", { id: loadingToast });
    } finally {
      if (onGlobalLoadingChange) onGlobalLoadingChange(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">نصوص شاشة الترحيب</h3>
        <button
          onClick={handleEnhanceSection}
          disabled={isGlobalLoading}
          className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-bold transition-all text-sm"
        >
          {isGlobalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>تحسين نصوص الترحيب</span>
        </button>
      </div>

      {/* Title + Icon row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2 md:col-span-3">
          <label className="text-sm font-bold text-gray-700 block text-right">العنوان الرئيسي</label>
          <div className="relative">
            <input
              type="text"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={onChange}
              className={`${field("mainTitle", errors.mainTitle, "pl-12")} font-bold text-lg`}
            />
            <AiImproveButton 
              text={formData.mainTitle} 
              context="أنت تقوم بتحسين 'العنوان الرئيسي' لشاشة الترحيب."
              onImproved={(newText) => onChange({ target: { name: "mainTitle", value: newText } } as any)} 
              className="top-1/2 -translate-y-1/2" 
              isGlobalLoading={isGlobalLoading}
              onGlobalLoadingChange={onGlobalLoadingChange}
            />
          </div>
          {errors.mainTitle && <p className="text-red-500 text-sm font-bold">{errors.mainTitle}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block text-right">الأيقونة</label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={onChange}
            className={`${field("icon", errors.icon)} text-center text-xl`}
          />
          {errors.icon && <p className="text-red-500 text-sm font-bold">{errors.icon}</p>}
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">العنوان الفرعي</label>
        <div className="relative">
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={onChange}
            className={`${field("subtitle", errors.subtitle, "pl-12")} text-gray-600`}
          />
          <AiImproveButton 
            text={formData.subtitle} 
            context={`أنت تقوم بتحسين 'العنوان الفرعي' لشاشة الترحيب. العنوان الرئيسي الحالي هو: "${formData.mainTitle}"`}
            onImproved={(newText) => onChange({ target: { name: "subtitle", value: newText } } as any)} 
            className="top-1/2 -translate-y-1/2" 
            isGlobalLoading={isGlobalLoading}
            onGlobalLoadingChange={onGlobalLoadingChange}
          />
        </div>
        {errors.subtitle && <p className="text-red-500 text-sm font-bold">{errors.subtitle}</p>}
      </div>

      {/* Welcome message */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">نص رسالة الترحيب</label>
        <div className="relative">
          <textarea
            name="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={onChange}
            rows={5}
            className={`${field("welcomeMessage", errors.welcomeMessage, "pl-12")} text-sm leading-relaxed resize-none`}
          />
          <AiImproveButton 
            text={formData.welcomeMessage} 
            context={`أنت تقوم بتحسين 'رسالة الترحيب' للطلاب. 
العنوان الرئيسي هو: "${formData.mainTitle}"
العنوان الفرعي هو: "${formData.subtitle}"
تأكد من أن الرسالة متناسقة مع العناوين السابقة ومشجعة للطلاب.`}
            onImproved={(newText) => onChange({ target: { name: "welcomeMessage", value: newText } } as any)} 
            className="top-3" 
            isGlobalLoading={isGlobalLoading}
            onGlobalLoadingChange={onGlobalLoadingChange}
          />
        </div>
        {errors.welcomeMessage && <p className="text-red-500 text-sm font-bold">{errors.welcomeMessage}</p>}
        <p className="text-xs text-emerald-600/70 font-medium text-right">
          يمكنك استخدام أسطر فارغة، سيتم تلوين السطر الأخير باللون الأخضر الغامق.
        </p>
      </div>

      {/* Button text */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">نص زر البدء</label>
        <div className="relative">
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={onChange}
            className={field("buttonText", errors.buttonText, "pl-12")}
          />
          <AiImproveButton 
            text={formData.buttonText} 
            context={`أنت تقوم بتحسين 'نص زر البدء'. اجعله حماسياً وقصيراً. (مثال: ابدأ اللعب، اختبر معلوماتك، إلخ)`}
            onImproved={(newText) => onChange({ target: { name: "buttonText", value: newText } } as any)} 
            className="top-1/2 -translate-y-1/2" 
            isGlobalLoading={isGlobalLoading}
            onGlobalLoadingChange={onGlobalLoadingChange}
          />
        </div>
        {errors.buttonText && <p className="text-red-500 text-sm font-bold">{errors.buttonText}</p>}
      </div>
    </div>
  )
}
