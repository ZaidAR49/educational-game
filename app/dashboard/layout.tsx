import { Sidebar } from "@/components/dashboard/Sidebar"
import { requireAuth } from "@/lib/actions/utils"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      <Sidebar user={user} />
      <main className="pr-64">
        {/* Main Content Area */}
        <div className="p-8 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
