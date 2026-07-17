"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, LayoutDashboard, Settings, LogOut, Gamepad2, Menu, X, Bell } from "lucide-react"
import Image from "next/image"
import AppLogo from "@/app/icon.png"
import uiContent from "@/data/ui-content-general.json"
import { signOut } from "next-auth/react"

interface AdminSidebarProps {
  user?: { name: string; image: string | null }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navItems = [
    { name: "الحسابات", href: "/admin/accounts", icon: Users },
    { name: "الإحصائيات", href: "/admin/analytics", icon: LayoutDashboard },
    { name: "الإشعارات", href: "/admin/notifications", icon: Bell },
    { name: "الإعدادات", href: "/admin/settings", icon: Settings },
  ]

  const initial = user?.name?.charAt(0).toUpperCase() ?? "A"

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-5 right-4 z-30 p-2 bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-700 transition-colors"
        aria-label="Open admin menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40 transition-opacity backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`w-64 bg-slate-900 text-white flex-col flex fixed h-full right-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
              <Image src={AppLogo} alt="Logo" width={40} height={40} className="object-contain" priority />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:from-blue-300 group-hover:to-indigo-300 transition-all">
                {uiContent.app.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">العودة للرئيسية</p>
            </div>
          </Link>
          <button 
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 font-medium" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}

        {/* Teacher dashboard shortcut — always visible for admins */}
        <div className="border-t border-slate-700/60 my-2" />
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 font-medium"
        >
          <Gamepad2 className="w-5 h-5" />
          <span>لوحة المعلم</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-3">
        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-2">
            {user.image && !imageError ? (
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-indigo-500/40">
                <Image
                  src={user.image}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initial}
              </div>
            )}
            <span className="text-sm font-medium text-slate-200 truncate">{user.name}</span>
          </div>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
      </aside>
    </>
  )
}
