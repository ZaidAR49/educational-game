"use client"

import { useState } from "react"
import {
  Send,
  Mail,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Calendar
} from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

export function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const { messages: t, locale } = useLocale()

  const c = t.contactPage
  const contactEmail = "zaidradaideh.dev@gmail.com"

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    setIsSubmitting(true)
    setError("")
    setIsSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      locale,
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        form.reset()
      } else {
        setError(result.error || c.errorUnexpected)
      }
    } catch (err) {
      console.error(err)
      setError(c.errorServer)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduPlay Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            {c.heading1}{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {c.heading2}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {c.subheading}
          </p>
        </div>

        {/* Horizontal 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Info, Event highlights, and Email at bottom */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">

            {/* Top Info & Community Highlights Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-sm border border-gray-100 flex-1 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {c.infoCardTitle}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {c.infoCardDesc}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-gray-100">
                {/* 1. Fast Response */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100/80">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{c.supportPledgeTitle}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.supportPledgeDesc}</p>
                  </div>
                </div>

                {/* 2. Events & Classroom Support */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-100/80">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{c.eventSupportTitle}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.eventSupportDesc}</p>
                  </div>
                </div>

                {/* 3. Safe & Private */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100/80">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{c.safeAndSecure}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.safeAndSecureDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Email Component: Clean, integrated, discreet email section */}
            <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white rounded-3xl p-6 border border-emerald-100/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    {c.directEmailHint}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {c.directEmailDesc}
                  </p>
                </div>
              </div>

              {/* Action items: Direct Email Button & Discreet copy bar */}
              <div className="flex flex-col gap-2.5 pt-1">
                {/* Send Direct Email Button */}
                <a
                  href={`mailto:${contactEmail}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-sm transition-all shadow-sm group"
                >
                  <Mail className="w-4 h-4" />
                  <span>{c.emailDirectBtn}</span>
                  <ExternalLink className="w-3.5 h-3.5 rtl:rotate-180 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
                </a>

                {/* Subtle Copy Email Pill with Smaller Font */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white border border-emerald-200/80 hover:border-emerald-400 text-gray-700 text-xs transition-all shadow-2xs group"
                  title={c.copyEmail}
                >
                  <span className="font-mono text-xs text-gray-600 tracking-tight" dir="ltr">
                    {contactEmail}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 shrink-0">
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{c.emailCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600" />
                        <span>{c.copyEmail}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-xl shadow-slate-200/50 border border-gray-100 flex-1 flex flex-col justify-center relative">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4 text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{c.successTitle}</h2>
                  <p className="text-gray-600 max-w-md text-sm sm:text-base leading-relaxed">
                    {c.successBody}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-7 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all active:scale-95 text-sm"
                  >
                    {c.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-900 font-bold text-lg">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <span>{c.heading1} {c.heading2}</span>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-900 text-start">
                        {c.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-start text-sm"
                        placeholder={c.namePlaceholder}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-bold text-gray-900 text-start">
                        {c.emailLabel}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        dir="ltr"
                        className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-start text-sm"
                        placeholder={c.emailPlaceholder}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-900 text-start">
                      {c.subjectLabel}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-start text-sm"
                      placeholder={c.subjectPlaceholder}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-bold text-gray-900 text-start">
                      {c.messageLabel}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none text-start text-sm leading-relaxed"
                      placeholder={c.messagePlaceholder}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 text-base"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>{c.submitButton}</span>
                        <Send className="w-4 h-4 rtl:rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
