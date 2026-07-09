import Link from "next/link"
import uiContent from "@/data/ui-content-general.json"
import { Navbar } from "@/components/shared/Navbar"
import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { HowItWorksSection } from "@/components/home/HowItWorksSection"
import { CallToAction } from "@/components/home/CallToAction"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <HeroSection content={uiContent} />
      <FeaturesSection />
      <HowItWorksSection />
      <CallToAction />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">{uiContent.app.copyrightText}</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/policies" className="hover:text-white transition-colors">
              سياسة الخصوصية وشروط الخدمة
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
