import { getMySessionsAction } from "@/lib/actions/sessions.actions"
import SessionsClient from "./SessionsClient"

export default async function SessionsPage() {
  const sessions = await getMySessionsAction();

  return <SessionsClient initialSessions={sessions} />
}
