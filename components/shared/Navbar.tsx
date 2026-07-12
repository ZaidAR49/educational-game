import { auth } from "@/auth"
import { NavbarClient } from "./NavbarClient"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function Navbar() {
  const session = await auth()
  
  if (session?.user?.id) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { isLocked: true }
    });
    
    if (dbUser?.isLocked) {
      return <NavbarClient session={null} />
    }
  }

  return <NavbarClient session={session} />
}
