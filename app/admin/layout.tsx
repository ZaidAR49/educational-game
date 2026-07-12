import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { requireDashboardAccess } from "@/lib/auth/rbac"
import Image from "next/image"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const dbUser = await requireDashboardAccess()

  const adminName = dbUser.name ?? "Admin"
  const adminInitial = adminName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 text-right flex" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar user={{ name: adminName, image: dbUser.image ?? null }} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:pr-64 transition-all">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">إدارة حسابات المستخدمين</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 hidden sm:block">{adminName}</span>
            {dbUser.image ? (
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white ring-2 ring-indigo-200">
                <Image
                  src={dbUser.image}
                  alt={adminName}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                {adminInitial}
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
