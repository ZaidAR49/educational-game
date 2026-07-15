import { useState } from "react"
import { CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { improveOrganizationFormAction } from "@/lib/actions/ai.actions"
import { AiImproveButton } from "./AiImproveButton"

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

  const field = (name: keyof OrganizationFormData, extra = "") =>
    `w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${extra} ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`

  const isPass = resultView === "pass"

  const handleEnhancePassSection = async () => {
    if (onGlobalLoadingChange) onGlobalLoadingChange(true);
    const loadingToast = toast.loading("جاري تحسين نصوص النجاح...");
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
      toast.success("تم تحسين نصوص النجاح بنجاح!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحسين النصوص.", { id: loadingToast });
    } finally {
      if (onGlobalLoadingChange) onGlobalLoadingChange(false);
    }
  };

  const handleEnhanceFailSection = async () => {
    if (onGlobalLoadingChange) onGlobalLoadingChange(true);
    const loadingToast = toast.loading("جاري تحسين نصوص الرسوب...");
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
      toast.success("تم تحسين نصوص الرسوب بنجاح!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحسين النصوص.", { id: loadingToast });
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
          حالة النجاح
        </button>
        <button
          type="button"
          onClick={() => onResultViewChange("fail")}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${!isPass ? "bg-white text-amber-600 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
        >
          حالة المحاولة / الرسوب
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {resultView === "pass" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> رسائل النجاح
              </h3>
              <button
                onClick={handleEnhancePassSection}
                disabled={isGlobalLoading}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-bold transition-all text-sm"
              >
                {isGlobalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>تحسين نصوص النجاح</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-right">عنوان النتيجة</label>
              <div className="relative">
                <input
                  type="text"
                  name="resultTitlePass"
                  value={formData.resultTitlePass}
                  onChange={onChange}
                  className={`${field("resultTitlePass", "pl-12")} text-emerald-600 font-black text-xl`}
                />
                <AiImproveButton 
                  text={formData.resultTitlePass} 
                  context="أنت تقوم بتحسين 'عنوان النتيجة' عند نجاح الطالب. اجعله كلمة أو جملة قصيرة جداً للتهنئة."
                  onImproved={(newText) => onChange({ target: { name: "resultTitlePass", value: newText } } as any)} 
                  className="top-1/2 -translate-y-1/2" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultTitlePass && <p className="text-red-500 text-sm font-bold">{errors.resultTitlePass}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-right">الوصف القصير (النجاح)</label>
              <div className="relative">
                <input
                  type="text"
                  name="resultSubtitlePass"
                  value={formData.resultSubtitlePass}
                  onChange={onChange}
                  className={field("resultSubtitlePass", "text-gray-600 pl-12")}
                />
                <AiImproveButton 
                  text={formData.resultSubtitlePass} 
                  context={`أنت تقوم بتحسين 'الوصف القصير' للنجاح. عنوان النتيجة الحالي هو: "${formData.resultTitlePass}"`}
                  onImproved={(newText) => onChange({ target: { name: "resultSubtitlePass", value: newText } } as any)} 
                  className="top-1/2 -translate-y-1/2" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultSubtitlePass && <p className="text-red-500 text-sm font-bold">{errors.resultSubtitlePass}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-right">رسالة النجاح التشجيعية</label>
              <div className="relative">
                <textarea
                  name="resultMessagePass"
                  value={formData.resultMessagePass}
                  onChange={onChange}
                  rows={4}
                  className={`${field("resultMessagePass", "pl-12")} text-sm leading-relaxed resize-none text-gray-600`}
                />
                <AiImproveButton 
                  text={formData.resultMessagePass} 
                  context={`أنت تقوم بتحسين 'رسالة النجاح التشجيعية' للطلاب.
عنوان النتيجة هو: "${formData.resultTitlePass}"
الوصف القصير هو: "${formData.resultSubtitlePass}"
اجعل الرسالة متوافقة ومشجعة جداً وتناسب الإنجاز.`}
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
                <XCircle className="w-5 h-5" /> رسائل الرسوب
              </h3>
              <button
                onClick={handleEnhanceFailSection}
                disabled={isGlobalLoading}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-bold transition-all text-sm"
              >
                {isGlobalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>تحسين نصوص الرسوب</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-right">عنوان النتيجة</label>
              <div className="relative">
                <input
                  type="text"
                  name="resultTitleFail"
                  value={formData.resultTitleFail}
                  onChange={onChange}
                  className={`${field("resultTitleFail", "pl-12")} text-red-500 font-black text-xl`}
                />
                <AiImproveButton 
                  text={formData.resultTitleFail} 
                  context="أنت تقوم بتحسين 'عنوان النتيجة' عند رسوب الطالب. اجعله كلمة أو جملة قصيرة جداً ومحفزة للمحاولة مرة أخرى."
                  onImproved={(newText) => onChange({ target: { name: "resultTitleFail", value: newText } } as any)} 
                  className="top-1/2 -translate-y-1/2" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultTitleFail && <p className="text-red-500 text-sm font-bold">{errors.resultTitleFail}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-right">الوصف القصير (الرسوب)</label>
              <div className="relative">
                <input
                  type="text"
                  name="resultSubtitleFail"
                  value={formData.resultSubtitleFail}
                  onChange={onChange}
                  className={field("resultSubtitleFail", "text-gray-600 pl-12")}
                />
                <AiImproveButton 
                  text={formData.resultSubtitleFail} 
                  context={`أنت تقوم بتحسين 'الوصف القصير' للرسوب. عنوان النتيجة الحالي هو: "${formData.resultTitleFail}"`}
                  onImproved={(newText) => onChange({ target: { name: "resultSubtitleFail", value: newText } } as any)} 
                  className="top-1/2 -translate-y-1/2" 
                  isGlobalLoading={isGlobalLoading}
                  onGlobalLoadingChange={onGlobalLoadingChange}
                />
              </div>
              {errors.resultSubtitleFail && <p className="text-red-500 text-sm font-bold">{errors.resultSubtitleFail}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block text-right">رسالة الرسوب التشجيعية</label>
              <div className="relative">
                <textarea
                  name="resultMessageFail"
                  value={formData.resultMessageFail}
                  onChange={onChange}
                  rows={4}
                  className={`${field("resultMessageFail", "pl-12")} text-sm leading-relaxed resize-none text-gray-600`}
                />
                <AiImproveButton 
                  text={formData.resultMessageFail} 
                  context={`أنت تقوم بتحسين 'رسالة الرسوب' التشجيعية للطلاب.
عنوان النتيجة هو: "${formData.resultTitleFail}"
الوصف القصير هو: "${formData.resultSubtitleFail}"
اجعل الرسالة محفزة على التعلم من الأخطاء والنجاح في المحاولة القادمة.`}
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
        <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">إعدادات عامة للنتيجة</h4>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block text-right">رسالة المؤسسة (تظهر دائماً)</label>
          <div className="relative">
            <textarea
              name="orgMessage"
              value={formData.orgMessage}
              onChange={onChange}
              rows={4}
              className={`${field("orgMessage", "pl-12")} text-sm leading-relaxed resize-none`}
            />
            <AiImproveButton 
              text={formData.orgMessage} 
              context="أنت تقوم بتحسين 'رسالة المؤسسة' التي تظهر كخاتمة للطلاب بغض النظر عن نتيجتهم. اجعلها تبرز اهتمام المؤسسة بنجاحهم ومستقبلهم."
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
            <label className="text-sm font-bold text-gray-700 block text-right">نص الزر الأساسي (Primary)</label>
            <div className="relative">
              <input
                type="text"
                name="resultPrimaryButtonText"
                value={formData.resultPrimaryButtonText}
                onChange={onChange}
                className={field("resultPrimaryButtonText", "pl-12")}
              />
              <AiImproveButton 
                text={formData.resultPrimaryButtonText} 
                context="أنت تقوم بتحسين 'نص الزر الأساسي' في شاشة النتيجة. اجعله يحفز الطالب على بدء تحدي جديد أو إغلاق الشاشة."
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
            <label className="text-sm font-bold text-gray-700 block text-right">نص الزر الثانوي (Secondary)</label>
            <div className="relative">
              <input
                type="text"
                name="resultSecondaryButtonText"
                value={formData.resultSecondaryButtonText}
                onChange={onChange}
                className={field("resultSecondaryButtonText", "pl-12")}
              />
              <AiImproveButton 
                text={formData.resultSecondaryButtonText} 
                context="أنت تقوم بتحسين 'نص الزر الثانوي' في شاشة النتيجة. عادة يكون لمشاركة النتيجة مع الأصدقاء."
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
