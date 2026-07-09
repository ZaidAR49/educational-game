"use client"

import { useState } from "react"
import { Save, UserCircle2, Mail } from "lucide-react"
import Image from "next/image"

interface SettingsClientProps {
  session: any
}

export default function SettingsClient({ session }: SettingsClientProps) {
  // Use session data if available, fallback to mock data
  const [formData, setFormData] = useState({
    name: session?.user?.name || "Zaid Radaideh",
    email: session?.user?.email || "ziedradaideh1975@gmail.com",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const userImage = session?.user?.image

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">إعدادات الحساب</h1>
          <p className="text-gray-500">
            تحديث المعلومات الشخصية الخاصة بك.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0">
          <Save className="w-5 h-5" />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-10">
        
        {/* Profile Picture Section (Read-only) */}
        <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative">
            {userImage ? (
              <Image src={userImage} alt="Profile" fill className="object-cover" />
            ) : (
              <UserCircle2 className="w-12 h-12 text-emerald-300" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">الصورة الشخصية</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              يتم سحب صورتك الشخصية تلقائياً من مزود تسجيل الدخول الخاص بك (مثل Google). لا يمكنك تغييرها من هنا.
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-emerald-500" />
            <span>المعلومات الشخصية</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">الاسم الكامل</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-right"
                />
                <UserCircle2 className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed text-right font-sans"
                  dir="ltr"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-gray-500 font-medium">لا يمكن تغيير البريد الإلكتروني لأنه مرتبط بحساب Google الخاص بك.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
