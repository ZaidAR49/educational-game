import { requireDashboardAccess } from "@/lib/auth/rbac"
import { SettingsClient } from "./SettingsClient"
import { getAdminsAction } from "@/lib/actions/admin.actions"

export default async function AdminSettingsPage() {
  const user = await requireDashboardAccess()
  const initialAdmins = await getAdminsAction()

  return <SettingsClient userRole={user.role as string} initialAdmins={initialAdmins as any[]} />
}
