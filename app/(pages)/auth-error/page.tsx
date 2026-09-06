import { redirect } from "next/navigation";
import { AuthErrorClient } from "./AuthErrorClient";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  if (error === "AccessDenied") {
    redirect("/blocked");
  }

  return <AuthErrorClient error={error} />;
}
