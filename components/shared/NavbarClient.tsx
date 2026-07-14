"use client"

import Link from "next/link"
import { LogIn, Menu, X, Gamepad2, LayoutDashboard, Shield } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { config } from "@/lib/config"
import uiContent from "@/data/ui-content-general.json"
import AppLogo from "@/app/icon.png"
import { signOut } from "next-auth/react"
import posthog from "posthog-js"

export function NavbarClient({ session }: { session: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 mx-auto">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 overflow-hidden flex items-center justify-center rounded-xl">
              <Image src={AppLogo} alt="Logo" width={60} height={60} className="object-contain" priority />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {uiContent.app.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              المميزات
            </Link>
            <Link href="/#how-it-works" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              كيف تعمل؟
            </Link>
            {session && (
              <>
                <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Link>
                {['admin', 'super_admin', 'viewer'].includes(session.user?.role) && (
                  <Link href="/admin" className="text-purple-600 hover:text-purple-700 font-bold transition-colors flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    لوحة الإدارة
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">{session.user?.name}</span>
                  <button onClick={() => { posthog.reset(); signOut() }} className="text-xs text-gray-500 hover:text-red-500">
                    تسجيل الخروج
                  </button>
                </div>
                {session.user?.image ? (
                  <Image src={session.user.image} alt="Profile" width={40} height={40} className="rounded-full border-2 border-emerald-100" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                تسجيل الدخول كمعلم
              </Link>
            )}
            <div className="w-px h-6 bg-gray-200"></div>
            <Link 
              href="/game/demo"
              className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-bold transition-colors"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>جرب اللعبة</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl">
          <div className="flex flex-col p-4 space-y-4">
            <Link 
              href="/#features" 
              className="p-3 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              المميزات
            </Link>
            <Link 
              href="/#how-it-works" 
              className="p-3 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              كيف تعمل؟
            </Link>
            <hr className="border-gray-100" />
            <Link 
              href="/game/demo"
              className="p-3 flex items-center justify-center gap-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-bold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Gamepad2 className="w-5 h-5" />
              <span>جرب اللعبة كطالب</span>
            </Link>
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>لوحة التحكم</span>
                </Link>
                {['admin', 'super_admin', 'viewer'].includes(session.user?.role) && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 text-purple-700 font-bold mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5" />
                    <span>لوحة الإدارة</span>
                  </Link>
                )}
              </>
            )}
            {!session && (
              <Link
                href="/login"
                className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-5 h-5 text-gray-400" />
                <span>تسجيل الدخول كمعلم</span>
              </Link>
            )}
            {session && (
               <button
                 onClick={() => { posthog.reset(); signOut() }}
                 className="flex items-center gap-2 p-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors"
               >
                 <span>تسجيل الخروج</span>
               </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
