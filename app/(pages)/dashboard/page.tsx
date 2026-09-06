export const dynamic = "force-dynamic"
export const revalidate = 0

import { getDashboardOverviewAction } from "@/lib/actions/dashboard.actions"
import { requireAuth } from "@/lib/actions/utils"
import { OverviewClient } from "@/components/dashboard/OverviewClient"

export default async function OverviewPage() {
  const user = await requireAuth();
  const data = await getDashboardOverviewAction();

  return <OverviewClient user={user} data={data} />
}
