import { getOrganizationAction } from "@/lib/actions/organizations.actions"
import { OrganizationForm } from "@/components/organizations/OrganizationForm"
import { notFound } from "next/navigation"

export default async function EditOrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const org = await getOrganizationAction(id);
    
    if (!org) return notFound();

    const initialData = {
      institutionName: org.name,
      logo: org.logoPath,
      icon: org.introduction?.decorative_emojis?.[0] || "👋",
      mainTitle: org.introduction?.title || "",
      subtitle: org.introduction?.subtitle || "",
      welcomeMessage: org.introduction?.welcome_box?.description || "",
      buttonText: org.introduction?.button_text || "",
      resultTitle: org.resultScreen?.title || "",
      resultSubtitle: org.resultScreen?.small_description || "",
      resultMessage: org.resultScreen?.message || "",
      // Fallbacks for fields not explicitly in schema but present in the form UI
      orgMessage: "أحسنت على مشاركتك! كل سؤال هو فرصة جديدة للتعلم والنمو. استمر في تطوير معلوماتك ومهاراتك، ونحن واثقون من قدراتك! 🌟",
      resultPrimaryButtonText: "العب مرة أخرى 🔄",
      resultSecondaryButtonText: "شارك نتيجتك 📊",
    };

    return <OrganizationForm initialData={initialData} organizationId={org.id} />
  } catch (error) {
    console.error("Failed to load organization:", error);
    return notFound();
  }
}
