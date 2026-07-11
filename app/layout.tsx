import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { config } from "@/lib/config"
import uiContent from "@/data/ui-content-general.json"
import { Toaster } from "sonner"
import "./globals.css"

const tajawal = Tajawal({ subsets: ["arabic"], weight: ["300", "400", "500", "700"] })

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
    <html lang="ar" dir="rtl" className="bg-gradient-to-br from-emerald-50 to-blue-50" data-scroll-behavior="smooth">
      <body className={`${tajawal.className} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
        {config.enableAnalytics && <Analytics />}
      </body>
    </html>
  )
}
