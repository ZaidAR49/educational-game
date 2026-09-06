"use client"

import { CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { improveOrganizationFormAction } from "@/lib/actions/ai.actions"
import { AiImproveButton } from "./AiImproveButton"
import type { OrganizationFormData } from "./OrganizationForm"
import { useLocale } from "@/lib/i18n/LanguageContext"

type ResultTabFieldsProps = {
  formData: OrganizationFormData
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBulkChange: (data: Partial<OrganizationFormData>) => void
  resultView: "pass" | "fail"
  onResultViewChange: (view: "pass" | "fail") => void
  isGlobalLoading?: boolean
  onGlobalLoadingChange?: (isLoading: boolean) => void
}

export function ResultTabFields({ formData, errors, onChange, onBulkChange, resultView, onResultViewChange, isGlobalLoading, onGlobalLoadingChange }: ResultTabFieldsProps) {
  const { t, locale, isRTL } = useLocale()
  const o = t.orgForm
  const paddingForAi = isRTL ? "pl-12" : "pr-12"

  const field = (name: keyof OrganizationFormData, extra = "") =>
    `w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-start ${extra} ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`

  const isPass = resultView === "pass"

  const handleEnhancePassSection = async () => {
    if (onGlobalLoadingChange) onGlobalLoadingChange(true);
    const loadingToast = toast.loading(locale === 'ar' ? "جاري تحسين نصوص النجاح..." : "Enhancing success texts...");
    try {
      const sectionData = {
        resultTitlePass: formData.resultTitlePass,
        resultSubtitlePass: formData.resultSubtitlePass,
        resultMessagePass: formData.resultMessagePass,
        orgMessage: formData.orgMessage,
        resultPrimaryButtonText: formData.resultPrimaryButtonText,
        resultSecondaryButtonText: formData.resultSecondaryButtonText,
      };
      
      const improvedData = await improveOrganizationFormAction(sectionData);
      onBulkChange(improvedData);
      toast.success(locale === 'ar' ? "تم تحسين نصوص النجاح بنجاح!" : "Success texts enhanced successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(locale === 'ar' ? "حدث خطأ أثناء تحسين النصوص." : "Error enhancing texts.", { id: loadingToast });
    } finally {
      if (onGlobalLoadingChange) onGlobalLoadingChange(false);
    }
  };

  const handleEnhanceFailSection = async () => {
    if (onGlobalLoadingChange) onGlobalLoadingChange(true);
    const loadingToast = toast.loading(locale === 'ar' ? "جاري تحسين نصوص الرسوب..." : "Enhancing retry texts...");
    try {
      const sectionData = {
        resultTitleFail: formData.resultTitleFail,
        resultSubtitleFail: formData.resultSubtitleFail,
        resultMessageFail: formData.resultMessageFail,
        orgMessage: formData.orgMessage,
        resultPrimaryButtonText: formData.resultPrimaryButtonText,
        resultSecondaryButtonText: formData.resultSecondaryButtonText,
      };
      
      const improvedData = await improveOrganizationFormAction(sectionData);
      onBulkChange(improvedData);
      toast.success(locale === 'ar' ? "تم تحسين نصوص الرسوب بنجاح!" : "Retry texts enhanced successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(locale === 'ar' ? "حدث خطأ أثناء تحسين النصوص." : "Error enhancing texts.", { id: loadingToast });
    } finally {
      if (onGlobalLoadingChange) onGlobalLoadingChange(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-200">
      
      {/* State Switcher */}
      <div className="flex bg-gray-50 p-1 rounded-xl mb-4 border border-gray-100">
        <button
          type="button"
          onClick={() => onResultViewChange("pass")}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${isPass ? "bg-white text-emerald-600 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
        >
          {o.passState}
        </button>
        <button
          type="button"
          onClick={() => onResultViewChange("fail")}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${!isPass ? "bg-white text-amber-600 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
        >
          {o.failState}
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {resultView === "pass" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> <span>{o.passMessages}</span>
              </h3>
              <button
                type="button"
                onClick={handleEnhancePassSection}
                disabled={isGlobalLoading}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-bold transition-all text-sm"
              >
                {isGlobalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{o.enhancePass}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-start">{o.resultTitleLabel}</label>
              <div className="relative">
                <input
                  type="text"
                  name="resultTitlePass"
                  value={formData.resultTitlePass}
                  onChange={onChange}
                  className={`${field("resultTitlePass", paddingForAi)} text-emerald-600 font-black text-xl`}
                />
                <AiImproveButton 
                  text={formData.resultTitlePass} 
                  context="Improve the result title when a student passes. Make it a brief, energetic congratulatory phrase."
                  onImproved={(newText) => onChange({ target: { name: "resultTitlePass", value: newText } } as any)} 
                  className="top-1/2 -translate-y-1/2" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultTitlePass && <p className="text-red-500 text-sm font-bold">{errors.resultTitlePass}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-start">{o.resultDescPassLabel}</label>
              <div className="relative">
                <input
                  type="text"
                  name="resultSubtitlePass"
                  value={formData.resultSubtitlePass}
                  onChange={onChange}
                  className={field("resultSubtitlePass", `text-gray-600 ${paddingForAi}`)}
                />
                <AiImproveButton 
                  text={formData.resultSubtitlePass} 
                  context={`Improve the short description for passing. Current title: "${formData.resultTitlePass}"`}
                  onImproved={(newText) => onChange({ target: { name: "resultSubtitlePass", value: newText } } as any)} 
                  className="top-1/2 -translate-y-1/2" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultSubtitlePass && <p className="text-red-500 text-sm font-bold">{errors.resultSubtitlePass}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-start">{o.resultMsgPassLabel}</label>
              <div className="relative">
                <textarea
                  name="resultMessagePass"
                  value={formData.resultMessagePass}
                  onChange={onChange}
                  rows={4}
                  className={`${field("resultMessagePass", paddingForAi)} text-sm leading-relaxed resize-none text-gray-600`}
                />
                <AiImproveButton 
                  text={formData.resultMessagePass} 
                  context={`Improve the motivational pass message for students. Title: "${formData.resultTitlePass}", Subtitle: "${formData.resultSubtitlePass}".`}
                  onImproved={(newText) => onChange({ target: { name: "resultMessagePass", value: newText } } as any)} 
                  className="top-3" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultMessagePass && <p className="text-red-500 text-sm font-bold">{errors.resultMessagePass}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-bold text-red-500 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> <span>{o.failMessages}</span>
              </h3>
              <button
                type="button"
                onClick={handleEnhanceFailSection}
                disabled={isGlobalLoading}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-bold transition-all text-sm"
              >
                {isGlobalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{o.enhanceFail}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-start">{o.resultTitleLabel}</label>
              <div className="relative">
                <input
                  type="text"
                  name="resultTitleFail"
                  value={formData.resultTitleFail}
                  onChange={onChange}
                  className={`${field("resultTitleFail", paddingForAi)} text-red-500 font-black text-xl`}
                />
                <AiImproveButton 
                  text={formData.resultTitleFail} 
                  context="Improve the result title when a student fails or retries. Make it an inspiring phrase to motivate another attempt."
                  onImproved={(newText) => onChange({ target: { name: "resultTitleFail", value: newText } } as any)} 
                  className="top-1/2 -translate-y-1/2" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultTitleFail && <p className="text-red-500 text-sm font-bold">{errors.resultTitleFail}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-start">{o.resultDescFailLabel}</label>
              <div className="relative">
                <input
                  type="text"
                  name="resultSubtitleFail"
                  value={formData.resultSubtitleFail}
                  onChange={onChange}
                  className={field("resultSubtitleFail", `text-gray-600 ${paddingForAi}`)}
                />
                <AiImproveButton 
                  text={formData.resultSubtitleFail} 
                  context={`Improve the short description for retrying. Current title: "${formData.resultTitleFail}"`}
                  onImproved={(newText) => onChange({ target: { name: "resultSubtitleFail", value: newText } } as any)} 
                  className="top-1/2 -translate-y-1/2" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultSubtitleFail && <p className="text-red-500 text-sm font-bold">{errors.resultSubtitleFail}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-start">{o.resultMsgFailLabel}</label>
              <div className="relative">
                <textarea
                  name="resultMessageFail"
                  value={formData.resultMessageFail}
                  onChange={onChange}
                  rows={4}
                  className={`${field("resultMessageFail", paddingForAi)} text-sm leading-relaxed resize-none text-gray-600`}
                />
                <AiImproveButton 
                  text={formData.resultMessageFail} 
                  context={`Improve the motivational retry message for students. Title: "${formData.resultTitleFail}", Subtitle: "${formData.resultSubtitleFail}".`}
                  onImproved={(newText) => onChange({ target: { name: "resultMessageFail", value: newText } } as any)} 
                  className="top-3" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultMessageFail && <p className="text-red-500 text-sm font-bold">{errors.resultMessageFail}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Common Result Fields */}
      <div className="pt-6 border-t border-gray-100 space-y-6">
        <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">{o.generalResultSettings}</h4>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block text-start">{o.orgMsgLabel}</label>
          <div className="relative">
            <textarea
              name="orgMessage"
              value={formData.orgMessage}
              onChange={onChange}
              rows={4}
              className={`${field("orgMessage", paddingForAi)} text-sm leading-relaxed resize-none`}
            />
            <AiImproveButton 
              text={formData.orgMessage} 
              context="Improve the organization closing message that is always shown to students."
              onImproved={(newText) => onChange({ target: { name: "orgMessage", value: newText } } as any)} 
              className="top-3" 
              isGlobalLoading={isGlobalLoading}
              onGlobalLoadingChange={onGlobalLoadingChange}
            />
          </div>
          {errors.orgMessage && <p className="text-red-500 text-sm font-bold">{errors.orgMessage}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-start">{o.primaryBtnLabel}</label>
            <div className="relative">
              <input
                type="text"
                name="resultPrimaryButtonText"
                value={formData.resultPrimaryButtonText}
                onChange={onChange}
                className={field("resultPrimaryButtonText", paddingForAi)}
              />
              <AiImproveButton 
                text={formData.resultPrimaryButtonText} 
                context="Improve the primary result button text (e.g. Play Again, Restart)."
                onImproved={(newText) => onChange({ target: { name: "resultPrimaryButtonText", value: newText } } as any)} 
                className="top-1/2 -translate-y-1/2" 
                isGlobalLoading={isGlobalLoading}
                onGlobalLoadingChange={onGlobalLoadingChange}
              />
            </div>
            {errors.resultPrimaryButtonText && (
              <p className="text-red-500 text-sm font-bold">{errors.resultPrimaryButtonText}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-start">{o.secondaryBtnLabel}</label>
            <div className="relative">
              <input
                type="text"
                name="resultSecondaryButtonText"
                value={formData.resultSecondaryButtonText}
                onChange={onChange}
                className={field("resultSecondaryButtonText", paddingForAi)}
              />
              <AiImproveButton 
                text={formData.resultSecondaryButtonText} 
                context="Improve the secondary result button text (e.g. Share Result)."
                onImproved={(newText) => onChange({ target: { name: "resultSecondaryButtonText", value: newText } } as any)} 
                className="top-1/2 -translate-y-1/2" 
                isGlobalLoading={isGlobalLoading}
                onGlobalLoadingChange={onGlobalLoadingChange}
              />
            </div>
            {errors.resultSecondaryButtonText && (
              <p className="text-red-500 text-sm font-bold">{errors.resultSecondaryButtonText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
