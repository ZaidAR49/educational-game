import { getMyOrganizationsAction } from "@/lib/actions/organizations.actions"
import { NewGameFlow } from "@/components/games/NewGameFlow"

export default async function NewGamePage() {
  const organizations = await getMyOrganizationsAction();
  
  const orgOptions = organizations.map(org => ({
    id: org.id,
    name: org.name,
    logo: org.logoPath
  }));

  return <NewGameFlow organizations={orgOptions} />
}
