import type { OrganizationFormData } from "./OrganizationForm"

type ResultTabFieldsProps = {
  formData: OrganizationFormData
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function ResultTabFields({ formData, errors, onChange }: ResultTabFieldsProps) {
  const field = (name: keyof OrganizationFormData, extra = "") =>
    `w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${extra} ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Result title */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">
          عنوان النتيجة (في حال الرسوب أو المحاولة)
        </label>
        <input
          type="text"
          name="resultTitle"
          value={formData.resultTitle}
          onChange={onChange}
          className={field("resultTitle", "font-bold text-lg text-emerald-700")}
        />
        {errors.resultTitle && <p className="text-red-500 text-sm font-bold">{errors.resultTitle}</p>}
      </div>

      {/* Result subtitle */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">الوصف القصير</label>
        <input
          type="text"
          name="resultSubtitle"
          value={formData.resultSubtitle}
          onChange={onChange}
          className={field("resultSubtitle", "text-gray-600")}
        />
        {errors.resultSubtitle && <p className="text-red-500 text-sm font-bold">{errors.resultSubtitle}</p>}
      </div>

      {/* Encouragement message */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">رسالة التشجيع</label>
        <textarea
          name="resultMessage"
          value={formData.resultMessage}
          onChange={onChange}
          rows={2}
          className={`${field("resultMessage")} text-sm leading-relaxed resize-none`}
        />
        {errors.resultMessage && <p className="text-red-500 text-sm font-bold">{errors.resultMessage}</p>}
      </div>

      {/* Org message */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">
          رسالة المؤسسة (تظهر أسفل النتيجة)
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

      {/* Button texts */}
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
  )
}
