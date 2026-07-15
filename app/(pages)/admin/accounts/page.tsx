import { UsersTable } from "@/components/admin/UsersTable"
import { requireDashboardAccess } from "@/lib/auth/rbac"
import { getUsersListAction } from "@/lib/actions/admin.actions"

export default async function AdminAccountsPage() {
  const user = await requireDashboardAccess()
  const initialUsers = await getUsersListAction()

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة الحسابات</h2>
          <p className="text-slate-500 mt-1">عرض وإدارة جميع حسابات المستخدمين في المنصة</p>
        </div>
      </div>
      <UsersTable userRole={user.role as string} initialUsers={initialUsers as any[]} />
    </div>
  )
}
