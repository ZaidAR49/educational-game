import { UsersTable } from "@/components/admin/UsersTable"
import { AdminAccountsHeader } from "@/components/admin/AdminAccountsHeader"
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
      <AdminAccountsHeader />
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
