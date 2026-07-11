import { notFound } from "next/navigation"
import { getSessionDetailsAction } from "@/lib/actions/sessions.actions"
import SessionDetailsClient from "./SessionDetailsClient"

export default async function SessionDetailsPage({ params }: { params: { id: string } }) {
  const details = await getSessionDetailsAction(params.id);

  if (!details) {
    notFound();
  }

  return <SessionDetailsClient sessionData={details.session} players={details.players} />
}
