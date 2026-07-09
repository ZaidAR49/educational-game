import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      <Sidebar />
      <main className="pr-64">
        {/* Main Content Area */}
        <div className="p-8 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
