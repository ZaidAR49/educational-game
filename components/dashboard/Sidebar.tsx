"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Building2, 
  Gamepad2, 
  Settings, 
  LogOut,
  History,
  ShieldCheck,
  Zap,
  HelpCircle,
  Menu,
  X
} from "lucide-react"
import { signOut } from "next-auth/react"
import uiContent from "@/data/ui-content-general.json"
import AppLogo from "@/app/icon.png"

export function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname()
  const isPro = !!user?.isSubscribed
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar on path change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const links = [
    { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
    { href: "/dashboard/organizations", label: "المؤسسات", icon: Building2 },
    { href: "/dashboard/games", label: "ألعابي", icon: Gamepad2 },
    { href: "/dashboard/sessions", label: "الجلسات", icon: History },
    { href: "/dashboard/help", label: "دليل الاستخدام", icon: HelpCircle },
    { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
  ]

  return (
    <>
      {/* ── Mobile Header ── */}
      <div className="lg:hidden fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-gray-600 hover:text-emerald-600 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-lg font-black text-emerald-600 tracking-tight">{uiContent.app.name}</span>
          <div className="w-8 h-8 overflow-hidden flex items-center justify-center rounded-lg shrink-0">
            <Image src={AppLogo} alt="Logo" width={32} height={32} className="object-contain" priority />
          </div>
        </Link>
      </div>

      {/* ── Overlay ── */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed right-0 top-0 h-screen w-64 bg-white border-l border-gray-100 flex flex-col z-50 overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}>

        {/* ── Logo strip ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 overflow-hidden flex items-center justify-center rounded-lg shrink-0">
              <Image src={AppLogo} alt="Logo" width={32} height={32} className="object-contain" priority />
            </div>
            <span className="text-lg font-black text-emerald-600 tracking-tight">{uiContent.app.name}</span>
          </Link>
          <button 
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${
                isActive
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          )
        })}

        {/* Admin panel shortcut */}
        {user?.role && ["super_admin", "admin", "viewer"].includes(user.role) && (
          <>
            <div className="border-t border-gray-100 my-1.5" />
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
            >
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>لوحة التحكم الإدارية</span>
            </Link>
          </>
        )}
      </nav>

      {/* ── Bottom: user card + sign out ── */}
      <div className="px-3 pb-4 shrink-0 border-t border-gray-100 pt-3 space-y-2">

        {/* Profile card */}
        {user && (
          <div className={`rounded-2xl p-4 relative overflow-hidden ${
            isPro
              ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200/70"
              : "bg-gray-50 border border-gray-100"
          }`}>
            {isPro && (
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
            )}
            <div className="relative flex items-center gap-3">
              {/* Avatar */}
              <div className={`relative shrink-0 rounded-full ${
                isPro ? "p-[2.5px] bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400" : ""
              }`}>
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className={`w-11 h-11 rounded-full object-cover block ${isPro ? "border-2 border-amber-50" : ""}`}
                  />
                ) : (
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base ${
                    isPro ? "bg-amber-100 text-amber-700 border-2 border-amber-50" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              {/* Text */}
              <div className="min-w-0 flex-1">
                {isPro && (
                  <div className="mb-0.5">
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-black tracking-widest bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-0.5 rounded-full leading-none uppercase">
                      <Zap className="w-2 h-2 fill-white" /> Pro
                    </span>
                  </div>
                )}
                <p className={`text-sm font-bold truncate leading-tight ${isPro ? "text-amber-900" : "text-gray-900"}`}>
                  {user.name}
                </p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5 font-normal" dir="ltr">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
      </aside>
    </>
  )
}
