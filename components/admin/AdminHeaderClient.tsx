"use client"

import { useLocale } from "@/lib/i18n/LanguageContext"
import { LanguageDropdown } from "@/components/shared/LanguageDropdown"
import Image from "next/image"

interface AdminHeaderClientProps {
  adminName: string
  adminInitial: string
  userImage: string | null
}

export function AdminHeaderClient({ adminName, adminInitial, userImage }: AdminHeaderClientProps) {
  const { t } = useLocale()

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between rtl:pr-16 rtl:pl-4 ltr:pl-16 ltr:pr-4 md:px-8 sticky top-0 z-10 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 truncate">{t.nav.adminPanel}</h2>
      <div className="flex items-center gap-3">
        <LanguageDropdown variant="compact" />
        <span className="text-sm font-medium text-slate-700 hidden sm:block">{adminName}</span>
        {userImage ? (
          <div className="w-9 h-9 rounded-full overflow-hidden shadow-md border-2 border-white ring-2 ring-indigo-200">
            <Image
              src={userImage}
              alt={adminName}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
            {adminInitial}
          </div>
        )}
      </div>
    </header>
  )
}
