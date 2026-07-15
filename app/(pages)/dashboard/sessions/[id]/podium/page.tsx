import { getSessionDetailsAction } from "@/lib/actions/sessions.actions"
import PodiumClient from "@/components/dashboard/sessions/PodiumClient"
import { redirect } from "next/navigation"

export default async function PodiumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const data = await getSessionDetailsAction(id)
  
  if (!data) {
    redirect("/dashboard/sessions")
  }
  
  return <PodiumClient session={data.session} players={data.players} />
}
