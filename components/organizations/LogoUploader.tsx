"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { compressLogoImage } from "@/lib/image-compression"
import { Image as ImageIcon, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useLocale } from "@/lib/i18n/LanguageContext"

type LogoUploaderProps = {
  logo: string | null
  onLogoChange: (dataUrl: string, file: File) => void
  onLogoRemove: () => void
}

export function LogoUploader({ logo, onLogoChange, onLogoRemove }: LogoUploaderProps) {
  const { t, locale } = useLocale()
  const o = t.orgForm
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.warning(locale === 'ar' ? "الرجاء رفع ملف صورة صالح (PNG, JPG, إلخ)" : "Please upload a valid image file (PNG, JPG, etc.)")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning(locale === 'ar' ? "حجم الصورة يجب أن لا يتجاوز 5 ميجابايت قبل الضغط" : "Image size must not exceed 5MB before compression")
      return
    }

    try {
      setIsCompressing(true)
      const compressedFile = await compressLogoImage(file)
      
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) onLogoChange(event.target.result as string, compressedFile)
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error("Compression error:", error)
      toast.error(locale === 'ar' ? "حدث خطأ أثناء ضغط الصورة" : "Error compressing image")
    } finally {
      setIsCompressing(false)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLogoRemove()
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 block text-start">{o.logoLabel}</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isCompressing}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      {logo ? (
        <div className="w-full h-40 border border-gray-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-white shadow-sm">
          <div className="relative w-full h-full p-4 flex items-center justify-center group">
            <Image src={logo} alt="Logo Preview" fill className="object-contain p-4 transition-transform group-hover:scale-95" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-gray-100"
              >
                {o.logoChange}
              </button>
              <button 
                type="button" 
                onClick={handleRemove} 
                className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600"
                aria-label="Remove logo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isCompressing && fileInputRef.current?.click()}
          className={`w-full h-32 border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-2xl flex flex-col items-center justify-center gap-2 text-emerald-600 transition-colors ${
            isCompressing ? "cursor-wait opacity-70" : "hover:bg-emerald-50 cursor-pointer"
          }`}
        >
          <ImageIcon className={`w-8 h-8 opacity-50 ${isCompressing ? 'animate-pulse' : ''}`} />
          <div className="text-sm font-bold">{isCompressing ? o.logoCompressing : o.logoUploadPrompt}</div>
          <div className="text-xs text-emerald-600/60 font-medium">{o.logoHint}</div>
        </div>
      )}
    </div>
  )
}
