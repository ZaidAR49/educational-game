import Link from "next/link"
import { config } from "@/lib/config"
import uiContent from "@/data/ui-content.json"

export default function HomePage() {
  const { app, home } = uiContent

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-8xl mb-6 animate-bounce">{app.icon}</div>

        <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-4">
          {app.name}
        </h1>

        <p className="text-xl text-gray-600 mb-8">{app.campaignSubtitle}</p>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 text-right">
          <p className="text-gray-700 leading-relaxed mb-4">
            {home.description}
          </p>
          <ul className="text-gray-600 space-y-2">
            {home.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 justify-center">
                <span>{feature.text}</span>
                <span>{feature.icon}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={config.routes.game}
          className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          {home.startButtonLabel}
        </Link>

        <p className="mt-8 text-gray-500 text-sm">{app.copyrightText}</p>
      </div>
    </main>
  )
}
