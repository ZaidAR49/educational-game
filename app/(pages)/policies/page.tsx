import { Navbar } from "@/components/shared/Navbar"
import { PoliciesContent } from "./PoliciesContent"

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <PoliciesContent />
    </main>
  )
}
