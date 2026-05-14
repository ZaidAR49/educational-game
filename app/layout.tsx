import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'بطل القرارات الصحيحة - جمعية حماية الأسرة والطفولة',
  description: 'لعبة تفاعلية توعوية للأطفال والمراهقين لتعليمهم اتخاذ القرارات الصحيحة والابتعاد عن المخدرات',
  generator: 'v0.app',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RAjIY76Hw3j0ou7DFHe6b2WCKJ74Rb.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RAjIY76Hw3j0ou7DFHe6b2WCKJ74Rb.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-gradient-to-br from-emerald-50 to-blue-50">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
