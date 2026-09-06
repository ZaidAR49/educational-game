import { getOrganizationAction } from "@/lib/actions/organizations.actions"
import { OrganizationForm } from "@/components/organizations/OrganizationForm"
import { notFound } from "next/navigation"

export default async function EditOrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const org = (await getOrganizationAction(id)) as any;
    
    if (!org) return notFound();

    const initialData: Record<string, any> = {
      institutionName: org.name,
      logo: org.logoPath,
      icon: org.introduction?.decorative_emojis?.[0] || "👋",
      mainTitle: org.introduction?.title || "",
      subtitle: org.introduction?.subtitle || "",
      welcomeMessage: org.introduction?.welcome_box?.description || "",
      buttonText: org.introduction?.button_text || "",
    };

    if (org.resultScreen?.pass?.title || org.resultScreen?.title) {
      initialData.resultTitlePass = org.resultScreen?.pass?.title || org.resultScreen?.title;
    }
    if (org.resultScreen?.pass?.small_description || org.resultScreen?.small_description) {
      initialData.resultSubtitlePass = org.resultScreen?.pass?.small_description || org.resultScreen?.small_description;
    }
    if (org.resultScreen?.pass?.message || org.resultScreen?.message) {
      initialData.resultMessagePass = org.resultScreen?.pass?.message || org.resultScreen?.message;
    }
    if (org.resultScreen?.fail?.title) {
      initialData.resultTitleFail = org.resultScreen.fail.title;
    }
    if (org.resultScreen?.fail?.small_description) {
      initialData.resultSubtitleFail = org.resultScreen.fail.small_description;
    }
    if (org.resultScreen?.fail?.message) {
      initialData.resultMessageFail = org.resultScreen.fail.message;
    }
    if (org.resultScreen?.orgMessage) {
      initialData.orgMessage = org.resultScreen.orgMessage;
    }
    if (org.resultScreen?.primaryButtonText) {
      initialData.resultPrimaryButtonText = org.resultScreen.primaryButtonText;
    }
    if (org.resultScreen?.secondaryButtonText) {
      initialData.resultSecondaryButtonText = org.resultScreen.secondaryButtonText;
    }

    return <OrganizationForm initialData={initialData} organizationId={org.id} />
  } catch (error) {
    console.error("Failed to load organization:", error);
    return notFound();
  }
}
