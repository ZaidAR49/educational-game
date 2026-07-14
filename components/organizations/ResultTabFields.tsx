import { useState } from "react"
import type { OrganizationFormData } from "./OrganizationForm"

type ResultTabFieldsProps = {
  formData: OrganizationFormData
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  resultView: "pass" | "fail"
  onResultViewChange: (view: "pass" | "fail") => void
}

export function ResultTabFields({ formData, errors, onChange, resultView, onResultViewChange }: ResultTabFieldsProps) {

  const field = (name: keyof OrganizationFormData, extra = "") =>
    `w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${extra} ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`

  const isPass = resultView === "pass"

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
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

      {isPass ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">عنوان النتيجة (النجاح)</label>
            <input
              type="text"
              name="resultTitlePass"
              value={formData.resultTitlePass}
              onChange={onChange}
              className={field("resultTitlePass", "font-bold text-lg text-emerald-700")}
            />
            {errors.resultTitlePass && <p className="text-red-500 text-sm font-bold">{errors.resultTitlePass}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">الوصف القصير (النجاح)</label>
            <input
              type="text"
              name="resultSubtitlePass"
              value={formData.resultSubtitlePass}
              onChange={onChange}
              className={field("resultSubtitlePass", "text-gray-600")}
            />
            {errors.resultSubtitlePass && <p className="text-red-500 text-sm font-bold">{errors.resultSubtitlePass}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">رسالة التشجيع (النجاح)</label>
            <textarea
              name="resultMessagePass"
              value={formData.resultMessagePass}
              onChange={onChange}
              rows={2}
              className={`${field("resultMessagePass")} text-sm leading-relaxed resize-none`}
            />
            {errors.resultMessagePass && <p className="text-red-500 text-sm font-bold">{errors.resultMessagePass}</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">عنوان النتيجة (الرسوب)</label>
            <input
              type="text"
              name="resultTitleFail"
              value={formData.resultTitleFail}
              onChange={onChange}
              className={field("resultTitleFail", "font-bold text-lg text-amber-700")}
            />
            {errors.resultTitleFail && <p className="text-red-500 text-sm font-bold">{errors.resultTitleFail}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">الوصف القصير (الرسوب)</label>
            <input
              type="text"
              name="resultSubtitleFail"
              value={formData.resultSubtitleFail}
              onChange={onChange}
              className={field("resultSubtitleFail", "text-gray-600")}
            />
            {errors.resultSubtitleFail && <p className="text-red-500 text-sm font-bold">{errors.resultSubtitleFail}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">رسالة التشجيع (الرسوب)</label>
            <textarea
              name="resultMessageFail"
              value={formData.resultMessageFail}
              onChange={onChange}
              rows={2}
              className={`${field("resultMessageFail")} text-sm leading-relaxed resize-none`}
            />
            {errors.resultMessageFail && <p className="text-red-500 text-sm font-bold">{errors.resultMessageFail}</p>}
          </div>
        </div>
      )}

      {/* Common Result Fields */}
      <div className="pt-6 border-t border-gray-100 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block text-right">
            رسالة المؤسسة (تظهر أسفل النتيجة في كلتا الحالتين)
          </label>
          <textarea
            name="orgMessage"
            value={formData.orgMessage}
            onChange={onChange}
            rows={4}
            className={`${field("orgMessage")} text-sm leading-relaxed resize-none`}
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
              onChange={onChange}
              className={field("resultPrimaryButtonText")}
            />
            {errors.resultPrimaryButtonText && (
              <p className="text-red-500 text-sm font-bold">{errors.resultPrimaryButtonText}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">نص الزر الثانوي</label>
            <input
              type="text"
              name="resultSecondaryButtonText"
              value={formData.resultSecondaryButtonText}
              onChange={onChange}
              className={field("resultSecondaryButtonText")}
            />
            {errors.resultSecondaryButtonText && (
              <p className="text-red-500 text-sm font-bold">{errors.resultSecondaryButtonText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
