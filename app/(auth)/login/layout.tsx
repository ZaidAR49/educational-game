import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.id) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { isLocked: true, role: true }
    });

    if (dbUser?.isLocked) {
      // If they are locked, log them out immediately using the client component
      const { ForceSignout } = await import("@/components/auth/ForceSignout");
      return <ForceSignout />;
    }

    // Redirect authenticated, non-locked users directly to their destination.
    // We CANNOT redirect to /login/redirect here because that route is also
    // nested under this layout, which would cause an infinite redirect loop.
    const role = dbUser?.role ?? (session.user as any).role;
    if (["super_admin", "admin", "viewer"].includes(role as string)) {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  return <>{children}</>;
}
