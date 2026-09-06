import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeaderClient } from "@/components/admin/AdminHeaderClient"
import { requireDashboardAccess } from "@/lib/auth/rbac"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const dbUser = await requireDashboardAccess()

  const adminName = dbUser.name ?? "Admin"
  const adminInitial = adminName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AdminSidebar user={{ name: adminName, image: dbUser.image ?? null }} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:ps-64 rtl:md:pr-64 ltr:md:pl-64 transition-all">
        <AdminHeaderClient 
          adminName={adminName} 
          adminInitial={adminInitial} 
          userImage={dbUser.image ?? null} 
        />

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
