import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BlockedClient } from "./BlockedClient";

export default async function BlockedPage() {
  const superAdmin = await db.query.users.findFirst({
    where: eq(users.role, "super_admin"),
    columns: { email: true },
  });
  const supportEmail = superAdmin?.email || "support@example.com";

  return <BlockedClient supportEmail={supportEmail} />;
}
