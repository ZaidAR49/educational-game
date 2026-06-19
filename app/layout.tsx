import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { config } from "@/lib/config"
import uiContent from "@/data/ui-content.json"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: `${uiContent.app.name} - ${uiContent.app.organizationName}`,
  description: uiContent.home.description,
  icons: {
    icon: uiContent.app.logoUrl,
    apple: uiContent.app.logoUrl,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-gradient-to-br from-emerald-50 to-blue-50">
      <body className={`${geist.className} font-sans antialiased`}>
        {children}
        {config.enableAnalytics && <Analytics />}
      </body>
    </html>
  )
}
