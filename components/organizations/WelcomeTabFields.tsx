import type { OrganizationFormData } from "./OrganizationForm"

type WelcomeTabFieldsProps = {
  formData: OrganizationFormData
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function WelcomeTabFields({ formData, errors, onChange }: WelcomeTabFieldsProps) {
  const field = (name: keyof OrganizationFormData, error?: string) =>
    `w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-right ${
      error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Title + Icon row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2 md:col-span-3">
          <label className="text-sm font-bold text-gray-700 block text-right">العنوان الرئيسي</label>
          <input
            type="text"
            name="mainTitle"
            value={formData.mainTitle}
            onChange={onChange}
            className={`${field("mainTitle", errors.mainTitle)} font-bold text-lg`}
          />
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
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={onChange}
          className={`${field("subtitle", errors.subtitle)} text-gray-600`}
        />
        {errors.subtitle && <p className="text-red-500 text-sm font-bold">{errors.subtitle}</p>}
      </div>

      {/* Welcome message */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">نص رسالة الترحيب</label>
        <textarea
          name="welcomeMessage"
          value={formData.welcomeMessage}
          onChange={onChange}
          rows={5}
          className={`${field("welcomeMessage", errors.welcomeMessage)} text-sm leading-relaxed resize-none`}
        />
        {errors.welcomeMessage && <p className="text-red-500 text-sm font-bold">{errors.welcomeMessage}</p>}
        <p className="text-xs text-emerald-600/70 font-medium text-right">
          يمكنك استخدام أسطر فارغة، سيتم تلوين السطر الأخير باللون الأخضر الغامق.
        </p>
      </div>

      {/* Button text */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 block text-right">نص زر البدء</label>
        <input
          type="text"
          name="buttonText"
          value={formData.buttonText}
          onChange={onChange}
          className={field("buttonText", errors.buttonText)}
        />
        {errors.buttonText && <p className="text-red-500 text-sm font-bold">{errors.buttonText}</p>}
      </div>
    </div>
  )
}
