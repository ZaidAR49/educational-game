import { GameWizard } from "@/components/games/GameWizard"
import { getMyOrganizationsAction } from "@/lib/actions/organizations.actions"

export default async function NewGamePage() {
  const organizations = await getMyOrganizationsAction();
  
  const orgOptions = organizations.map(org => ({
    id: org.id,
    name: org.name,
    logo: org.logoPath
  }));

  return <GameWizard isEdit={false} organizations={orgOptions} />
}
