import SettingsClient from "@/components/dashboard/settings/SettingsClient"
import { requireAuth } from "@/lib/actions/utils"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import { cookies } from "next/headers"
import { LOCALE_STORAGE_KEY } from "@/lib/i18n"

export default async function SettingsPage() {
  const user = await requireAuth()
  const session = await auth()
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_STORAGE_KEY)?.value

  const effectiveLocale = (cookieLocale === "en" || cookieLocale === "ar")
    ? cookieLocale
    : (user.locale || "ar")

  return (
    <SessionProvider session={session}>
      <SettingsClient
        session={session}
        isSubscribed={user.isSubscribed}
        subscriptionPlan={user.subscriptionPlan}
        initialLocale={effectiveLocale}
      />
    </SessionProvider>
  )
}
