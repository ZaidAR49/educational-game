import { requireDashboardAccess } from "@/lib/auth/rbac";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsAdminPage() {
  const user = await requireDashboardAccess();

  return <NotificationsClient userRole={user.role as string} />;
}
