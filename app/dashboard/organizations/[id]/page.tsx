import { getOrganizationAction } from "@/lib/actions/organizations.actions"
import { OrganizationForm } from "@/components/organizations/OrganizationForm"
import { notFound } from "next/navigation"

export default async function EditOrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const org = (await getOrganizationAction(id)) as any;
    
    if (!org) return notFound();

    const initialData = {
      institutionName: org.name,
      logo: org.logoPath,
      icon: org.introduction?.decorative_emojis?.[0] || "👋",
      mainTitle: org.introduction?.title || "",
      subtitle: org.introduction?.subtitle || "",
      welcomeMessage: org.introduction?.welcome_box?.description || "",
      buttonText: org.introduction?.button_text || "",
      resultTitlePass: org.resultScreen?.pass?.title || org.resultScreen?.title || "ممتاز!",
      resultSubtitlePass: org.resultScreen?.pass?.small_description || org.resultScreen?.small_description || "لقد أثبتّ جدارتك!",
      resultMessagePass: org.resultScreen?.pass?.message || org.resultScreen?.message || "أحسنت صنعاً! لقد أتممت الاختبار بنجاح مبهر.",
      resultTitleFail: org.resultScreen?.fail?.title || org.resultScreen?.title || "لا بأس، استمر!",
      resultSubtitleFail: org.resultScreen?.fail?.small_description || org.resultScreen?.small_description || "كل محاولة تعلّم جديد!",
      resultMessageFail: org.resultScreen?.fail?.message || org.resultScreen?.message || "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!",
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
