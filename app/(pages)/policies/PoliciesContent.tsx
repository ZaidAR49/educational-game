"use client"

import Link from "next/link"
import uiContent from "@/data/ui-content-general.json"
import { useLocale } from "@/lib/i18n/LanguageContext"

export function PoliciesContent() {
  const { messages: t, locale } = useLocale()
  const p = t.policiesPage

  const dateLocale = locale === "ar" ? "ar-u-nu-latn" : "en-US"

  return (
    <>
      <div className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto mt-4">

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-start">
              {p.title}
            </h1>

            <div className="prose prose-emerald max-w-none text-gray-600 space-y-8 leading-relaxed">

              {/* 1 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{p.s1Title}</h2>
                <p>{p.s1Body}</p>
              </section>

              {/* 2 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{p.s2Title}</h2>
                <p>{p.s2Intro}</p>
                <ul className="list-disc list-inside mt-3 space-y-2.5 ps-4">
                  <li><strong>{p.s2Item1Strong}</strong>{" "}{p.s2Item1}</li>
                  <li><strong>{p.s2Item2Strong}</strong>{" "}{p.s2Item2}</li>
                  <li><strong>{p.s2Item3Strong}</strong>{" "}{p.s2Item3}</li>
                </ul>
              </section>

              {/* 3 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{p.s3Title}</h2>
                <p>{p.s3Intro}</p>
                <ul className="list-disc list-inside mt-3 space-y-2.5 ps-4">
                  <li><strong>{p.s3Item1Strong}</strong>{" "}{p.s3Item1}</li>
                  <li><strong>{p.s3Item2Strong}</strong>{" "}{p.s3Item2}</li>
                  <li><strong>{p.s3Item3Strong}</strong>{" "}{p.s3Item3}</li>
                </ul>
              </section>

              {/* 4 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{p.s4Title}</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-gray-950 text-sm">
                  <span className="font-bold block mb-1">{p.s4BoxStrong}</span>
                  {p.s4Box}
                </div>
              </section>

              {/* 5 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{p.s5Title}</h2>
                <p>{p.s5Body}</p>
              </section>

              {/* 6 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{p.s6Title}</h2>
                <p>{p.s6Body}</p>
                <p className="mt-2 text-red-600 font-medium">{p.s6Warn}</p>
              </section>

              {/* 7 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{p.s7Title}</h2>
                <p>{p.s7Body}</p>
              </section>

              {/* Last updated */}
              <div className="pt-8 mt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center">
                  {p.lastUpdated}{" "}
                  {new Date().toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — inline here since page.tsx is server-only */}
      <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">{uiContent.app.copyrightText}</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/policies" className="hover:text-white transition-colors">
              {p.footerPolicy}
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
