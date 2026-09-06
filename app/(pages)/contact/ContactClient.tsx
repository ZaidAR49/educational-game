"use client"

import { useState } from "react"
import { Send, Mail, Loader2, CheckCircle2 } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

export function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const { messages: t } = useLocale()

  const c = t.contactPage

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
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            {c.heading1}{" "}
            <span className="text-emerald-600">{c.heading2}</span>
          </h1>
          <p className="text-lg text-gray-600">{c.subheading}</p>
        </div>

        <div className="flex flex-col gap-8">

          {/* Email Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-6 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-transparent opacity-50 pointer-events-none" />

            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative z-10">
              <Mail className="w-8 h-8" />
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-start relative z-10">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{c.emailBannerTitle}</h3>
              {/* Email is always LTR regardless of page direction */}
              <p className="text-emerald-700 font-bold text-lg" dir="ltr">zaidradaideh.dev@gmail.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-emerald-900/5 border border-gray-100 relative">

            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center py-16 space-y-4 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{c.successTitle}</h2>
                <p className="text-gray-600 max-w-md">{c.successBody}</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                >
                  {c.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all text-start"
                      placeholder={c.namePlaceholder}
                    />
                  </div>

                  {/* Email — always LTR input */}
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
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all text-start"
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
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all text-start"
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
                    rows={6}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none text-start"
                    placeholder={c.messagePlaceholder}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98] text-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>{c.submitButton}</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
