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
  const [imageError, setImageError] = useState(false)

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
                {session.user?.image && !imageError ? (
                  <Image src={session.user.image} alt="Profile" width={40} height={40} className="rounded-full border-2 border-emerald-100" onError={() => setImageError(true)} />
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
            className="md:hidden p-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-[85vw] max-w-[320px] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center rounded-lg">
              <Image src={AppLogo} alt="Logo" width={40} height={40} className="object-contain" priority />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              {uiContent.app.name}
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-1.5">
          {session && (
            <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              {session.user?.image && !imageError ? (
                <Image src={session.user.image} alt="Profile" width={44} height={44} className="rounded-full border-2 border-white shadow-sm" onError={() => setImageError(true)} />
              ) : (
                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg shadow-sm border-2 border-white shrink-0">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-900 truncate">{session.user?.name}</span>
                <span className="text-xs text-gray-500 truncate">{['admin', 'super_admin'].includes(session.user?.role) ? 'مدير النظام' : 'معلم'}</span>
              </div>
            </div>
          )}

          <Link 
            href="/#features" 
            className="px-4 py-3.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl font-bold transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            المميزات
          </Link>
          <Link 
            href="/#how-it-works" 
            className="px-4 py-3.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl font-bold transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            كيف تعمل؟
          </Link>
          
          <div className="my-2 border-t border-gray-100" />
          
          <Link 
            href="/game/demo"
            className="px-4 py-3.5 flex items-center gap-3 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-bold transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <Gamepad2 className="w-5 h-5 text-emerald-600" />
            </div>
            <span>جرب اللعبة كطالب</span>
          </Link>

          {session && (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-3.5 flex items-center gap-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-bold transition-colors mt-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="bg-gray-100 p-1.5 rounded-lg text-gray-500">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span>لوحة التحكم</span>
              </Link>
              {['admin', 'super_admin', 'viewer'].includes(session.user?.role) && (
                <Link
                  href="/admin"
                  className="px-4 py-3.5 flex items-center gap-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-purple-600 font-bold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="bg-purple-50 p-1.5 rounded-lg text-purple-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span>لوحة الإدارة</span>
                </Link>
              )}
            </>
          )}
          
          {!session && (
            <div className="mt-2">
              <Link
                href="/login"
                className="px-4 py-3.5 flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                <span>تسجيل الدخول كمعلم</span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {session && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/50 mt-auto">
            <button
              onClick={() => { posthog.reset(); signOut() }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 font-bold transition-all shadow-sm"
            >
              <span>تسجيل الخروج</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
