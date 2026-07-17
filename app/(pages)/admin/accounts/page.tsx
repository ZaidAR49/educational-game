import { UsersTable } from "@/components/admin/UsersTable"
import { requireDashboardAccess } from "@/lib/auth/rbac"
import { getUsersListAction } from "@/lib/actions/admin.actions"

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await requireDashboardAccess()
  
  const params = await searchParams
  const page = Number(params?.page) || 1
  const q = typeof params?.q === 'string' ? params.q : ""
  const f = typeof params?.f === 'string' ? params.f : "all"
  const s = typeof params?.s === 'string' ? params.s : "newest"

  const { users, totalPages, currentPage } = await getUsersListAction(page, q, f, s)

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة الحسابات</h2>
          <p className="text-slate-500 mt-1">عرض وإدارة جميع حسابات المستخدمين في المنصة</p>
        </div>
      </div>
      <UsersTable 
        userRole={user.role as string} 
        initialUsers={users} 
        totalPages={totalPages}
        currentPage={currentPage}
        currentSearch={q}
        currentFilter={f}
        currentSort={s}
      />
    </div>
  )
}
