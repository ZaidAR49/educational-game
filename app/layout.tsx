import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { config } from "@/lib/config"
import uiContent from "@/data/ui-content-general.json"
import { Toaster } from "sonner"
import { auth } from "@/auth"
import { PosthogIdentify } from "@/components/shared/PosthogIdentify"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const tajawal = Tajawal({ subsets: ["arabic"], weight: ["300", "400", "500", "700"] })

export const metadata: Metadata = {
  title: {
    default: `${uiContent.app.name} - ${uiContent.app.organizationName}`,
    template: `%s | ${uiContent.app.name}`,
  },
  description: uiContent.home.description,
  keywords: [
    "لعبة تفاعلية",
    "تعليمية",
    "اختبار معلومات",
    "تنمية مهارات",
    "أسئلة وأجوبة",
    uiContent.app.name,
    uiContent.app.organizationName
  ],
  authors: [{ name: uiContent.app.organizationName }],
  creator: uiContent.app.organizationName,
  openGraph: {
    type: "website",
    locale: "ar_SA",
    title: `${uiContent.app.name} - ${uiContent.app.organizationName}`,
    description: uiContent.home.description,
    siteName: uiContent.app.name,
    images: [
      {
        url: uiContent.app.logoUrl,
        width: 1200,
        height: 630,
        alt: `${uiContent.app.name} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${uiContent.app.name} - ${uiContent.app.organizationName}`,
    description: uiContent.home.description,
    images: [uiContent.app.logoUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="ar" dir="rtl" className="bg-gradient-to-br from-emerald-50 to-blue-50" data-scroll-behavior="smooth">
      <body className={`${tajawal.className} font-sans antialiased`}>
        {children}
        {session?.user?.id && (
          <PosthogIdentify userId={session.user.id} name={session.user.name} />
        )}
        <Toaster position="top-center" richColors />
        {config.enableAnalytics && <Analytics />}
        <SpeedInsights />
      </body>
    </html>
  )
}
