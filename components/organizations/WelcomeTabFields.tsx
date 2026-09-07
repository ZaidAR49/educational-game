"use client"

import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { improveOrganizationFormAction } from "@/lib/actions/ai.actions"
import { AiImproveButton } from "./AiImproveButton"
import type { OrganizationFormData } from "./OrganizationForm"
import { useLocale } from "@/lib/i18n/LanguageContext"

type WelcomeTabFieldsProps = {
  formData: OrganizationFormData
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBulkChange: (data: Partial<OrganizationFormData>) => void
  isGlobalLoading?: boolean
  onGlobalLoadingChange?: (isLoading: boolean) => void
}

export function WelcomeTabFields({ formData, errors, onChange, onBulkChange, isGlobalLoading, onGlobalLoadingChange }: WelcomeTabFieldsProps) {
  const { t, locale, isRTL } = useLocale()
  const o = t.orgForm

  const field = (name: keyof OrganizationFormData, error?: string, extra?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border focus:ring-2 outline-none transition-all text-start font-medium text-sm sm:text-base ${extra || ""} ${
      error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`

  const paddingForAi = isRTL ? "pl-12" : "pr-12"

  const handleEnhanceSection = async () => {
    if (onGlobalLoadingChange) onGlobalLoadingChange(true);
    const loadingToast = toast.loading(locale === 'ar' ? "جاري تحسين نصوص شاشة الترحيب..." : "Enhancing welcome screen texts...");
    try {
      const sectionData = {
        mainTitle: formData.mainTitle,
        subtitle: formData.subtitle,
        welcomeMessage: formData.welcomeMessage,
        buttonText: formData.buttonText,
      };
      
      const improvedData = await improveOrganizationFormAction(sectionData);
      onBulkChange(improvedData);
      toast.success(locale === 'ar' ? "تم تحسين نصوص الترحيب بنجاح!" : "Welcome texts enhanced successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(locale === 'ar' ? "حدث خطأ أثناء تحسين النصوص." : "Error enhancing texts.", { id: loadingToast });
    } finally {
      if (onGlobalLoadingChange) onGlobalLoadingChange(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4.5 sm:p-5 border border-gray-100 shadow-sm space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
      
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base">{o.welcomeTexts}</h3>
        <button
          type="button"
          onClick={handleEnhanceSection}
          disabled={isGlobalLoading}
          className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl font-bold transition-all text-xs sm:text-sm"
        >
          {isGlobalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{o.enhanceWelcome}</span>
        </button>
      </div>

      {/* Title + Icon row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5 md:col-span-3">
          <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{o.mainTitleLabel}</label>
          <div className="relative">
            <input
              type="text"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={onChange}
              className={`${field("mainTitle", errors.mainTitle, paddingForAi)} font-bold text-base sm:text-lg`}
            />
            <AiImproveButton 
              text={formData.mainTitle} 
              context="Improve the main title for the welcome screen. Make it engaging and concise."
              onImproved={(newText) => onChange({ target: { name: "mainTitle", value: newText } } as any)} 
              className="top-1/2 -translate-y-1/2" 
              isGlobalLoading={isGlobalLoading}
              onGlobalLoadingChange={onGlobalLoadingChange}
            />
          </div>
          {errors.mainTitle && <p className="text-red-500 text-xs sm:text-sm font-bold">{errors.mainTitle}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{o.iconLabel}</label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={onChange}
            className={`${field("icon", errors.icon)} text-center text-lg sm:text-xl`}
          />
          {errors.icon && <p className="text-red-500 text-xs sm:text-sm font-bold">{errors.icon}</p>}
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{o.subTitleLabel}</label>
        <div className="relative">
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={onChange}
            className={`${field("subtitle", errors.subtitle, paddingForAi)} text-gray-600`}
          />
          <AiImproveButton 
            text={formData.subtitle} 
            context={`Improve the subtitle for the welcome screen. The current main title is: "${formData.mainTitle}"`}
            onImproved={(newText) => onChange({ target: { name: "subtitle", value: newText } } as any)} 
            className="top-1/2 -translate-y-1/2" 
            isGlobalLoading={isGlobalLoading}
            onGlobalLoadingChange={onGlobalLoadingChange}
          />
        </div>
        {errors.subtitle && <p className="text-red-500 text-xs sm:text-sm font-bold">{errors.subtitle}</p>}
      </div>

      {/* Welcome message */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{o.welcomeMsgLabel}</label>
        <div className="relative">
          <textarea
            name="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={onChange}
            rows={4}
            className={`${field("welcomeMessage", errors.welcomeMessage, paddingForAi)} text-xs sm:text-sm leading-relaxed resize-none`}
          />
          <AiImproveButton 
            text={formData.welcomeMessage} 
            context={`Improve the welcome message for students. Main title: "${formData.mainTitle}", Subtitle: "${formData.subtitle}". Make it encouraging and clear.`}
            onImproved={(newText) => onChange({ target: { name: "welcomeMessage", value: newText } } as any)} 
            className="top-3" 
            isGlobalLoading={isGlobalLoading}
            onGlobalLoadingChange={onGlobalLoadingChange}
          />
        </div>
        {errors.welcomeMessage && <p className="text-red-500 text-xs sm:text-sm font-bold">{errors.welcomeMessage}</p>}
        <p className="text-xs text-emerald-600/70 font-medium text-start">
          {o.welcomeMsgHint}
        </p>
      </div>

      {/* Button text */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{o.buttonTextLabel}</label>
        <div className="relative">
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={onChange}
            className={field("buttonText", errors.buttonText, paddingForAi)}
          />
          <AiImproveButton 
            text={formData.buttonText} 
            context={`Improve the start button text. Make it enthusiastic and concise.`}
            onImproved={(newText) => onChange({ target: { name: "buttonText", value: newText } } as any)} 
            className="top-1/2 -translate-y-1/2" 
            isGlobalLoading={isGlobalLoading}
            onGlobalLoadingChange={onGlobalLoadingChange}
          />
        </div>
        {errors.buttonText && <p className="text-red-500 text-xs sm:text-sm font-bold">{errors.buttonText}</p>}
      </div>
    </div>
  )
}
