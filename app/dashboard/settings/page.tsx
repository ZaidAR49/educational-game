import { auth } from "@/auth"
import SettingsClient from "./SettingsClient"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <SessionProvider session={session}>
      <SettingsClient session={session} />
    </SessionProvider>
  )
}
