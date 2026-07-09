import { auth } from "@/auth"
import SettingsClient from "./SettingsClient"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return <SettingsClient session={session} />
}
