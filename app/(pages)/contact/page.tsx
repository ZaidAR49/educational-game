import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { ContactClient } from "./ContactClient"

export default function ContactPage() {
  return (
    <main className="flex-1 flex flex-col font-sans bg-gray-50">
      <Navbar />
      <ContactClient />
      <Footer />
    </main>
  )
}
