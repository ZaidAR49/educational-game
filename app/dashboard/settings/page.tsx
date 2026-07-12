import SettingsClient from "./SettingsClient"
import { requireAuth } from "@/lib/actions/utils"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"

export default async function SettingsPage() {
  const user = await requireAuth()
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <SettingsClient
        session={session}
        isSubscribed={user.isSubscribed}
        subscriptionPlan={user.subscriptionPlan}
      />
    </SessionProvider>
  )
}
