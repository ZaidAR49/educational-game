import { getMyOrganizationsAction } from "@/lib/actions/organizations.actions"
import { NewGameFlow } from "@/components/games/NewGameFlow"
import Link from "next/link"
import { Building2, PlusCircle } from "lucide-react"

export default async function NewGamePage() {
  const { data: organizations } = await getMyOrganizationsAction();
  
  if (organizations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-3xl shadow-sm border-2 border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <Building2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">إنشاء مؤسسة أولاً</h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          عذراً، لا يمكنك إنشاء لعبة بدون الانضمام أو إنشاء مؤسسة. يرجى إنشاء مؤسستك التعليمية أولاً لتتمكن من إضافة الألعاب وإدارتها.
        </p>
        <Link 
          href="/dashboard/organizations"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md text-lg"
        >
          <PlusCircle className="w-6 h-6" />
          <span>إنشاء مؤسسة جديدة</span>
        </Link>
      </div>
    )
  }

  const orgOptions = organizations.map(org => ({
    id: org.id,
    name: org.name,
    logo: org.logoPath
  }));

  return <NewGameFlow organizations={orgOptions} />
}
