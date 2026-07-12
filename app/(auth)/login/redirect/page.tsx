import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/actions/utils";

export default async function LoginRedirectPage() {
  const user = await requireAuth();

  // If user is any type of admin, send them to Admin Panel
  if (["super_admin", "admin", "viewer"].includes(user.role as string)) {
    redirect("/admin");
  }

  // Otherwise, send regular users to the Dashboard
  redirect("/dashboard");
}
