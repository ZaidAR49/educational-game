import Link from "next/link"
import uiContent from "@/data/ui-content-general.json"
import { Navbar } from "@/components/shared/Navbar"
import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { HowItWorksSection } from "@/components/home/HowItWorksSection"
import { CallToAction } from "@/components/home/CallToAction"
import { ContactCTA } from "@/components/home/ContactCTA"
import { Footer } from "@/components/shared/Footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <HeroSection content={uiContent} />
      <FeaturesSection />
      <HowItWorksSection />
      <CallToAction />
      <ContactCTA />
      
      <Footer />
    </main>
  )
}
