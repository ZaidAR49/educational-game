import { getMyOrganizationsAction, getTotalOrganizationsCountAction } from "@/lib/actions/organizations.actions"
import { getGameCountByOrganizationId } from "@/lib/services/games.service"
import { OrganizationsClient } from "@/components/organizations/OrganizationsClient"

export default async function OrganizationsPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const search = searchParams?.search;

  const absoluteTotal = await getTotalOrganizationsCountAction();
  const { data: organizations, total } = await getMyOrganizationsAction(currentPage, search);
  
  const orgsWithStats = await Promise.all(
    organizations.map(async (org) => {
      const count = await getGameCountByOrganizationId(org.id);
      return {
        ...org,
        gamesCount: count,
        formattedDate: org.createdAt ? new Date(org.createdAt).toISOString().split('T')[0] : "Unknown",
      }
    })
  );

  const totalPages = Math.ceil(total / 3);

  return (
    <OrganizationsClient
      organizations={orgsWithStats}
      currentPage={currentPage}
      totalPages={totalPages}
      showSearchAndFilter={absoluteTotal > 10}
    />
  );
}
