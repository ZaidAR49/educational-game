"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Building2, 
  Gamepad2, 
  Settings, 
  LogOut,
  History
} from "lucide-react"
import { signOut } from "next-auth/react"
import uiContent from "@/data/ui-content-general.json"
import AppLogo from "@/app/icon.png"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
    { href: "/dashboard/organizations", label: "المؤسسات", icon: Building2 },
    { href: "/dashboard/games", label: "ألعابي", icon: Gamepad2 },
    { href: "/dashboard/sessions", label: "الجلسات", icon: History },
    { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
  ]

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-white border-l border-gray-100 flex flex-col pt-6 pb-6 px-4 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-10 px-2 group">
        <div className="w-10 h-10 overflow-hidden flex items-center justify-center rounded-lg">
          <Image src={AppLogo} alt="Logo" width={40} height={40} className="object-contain" priority />
        </div>
        <span className="text-xl font-black text-emerald-600 tracking-tight">
          {uiContent.app.name}
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = 
            link.href === "/dashboard" 
              ? pathname === "/dashboard" 
              : pathname.startsWith(link.href)
              
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto border-t border-gray-100 pt-4">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
