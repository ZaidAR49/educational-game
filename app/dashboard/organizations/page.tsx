import Link from "next/link"
import { Plus, Building2, Pencil, Trash2 } from "lucide-react"
import { getMyOrganizationsAction, deleteOrganizationAction } from "@/lib/actions/organizations.actions"
import { getMyGamesAction } from "@/lib/actions/games.actions"

export default async function OrganizationsPage() {
  const organizations = await getMyOrganizationsAction();
  const games = await getMyGamesAction();

  const orgsWithStats = organizations.map((org) => {
    return {
      ...org,
      gamesCount: games.filter(g => g.organizationId === org.id).length,
      formattedDate: org.createdAt ? new Date(org.createdAt).toISOString().split('T')[0] : "غير معروف",
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">المؤسسات</h1>
          <p className="text-gray-500">
            إدارة ملفات المؤسسات التي تملكها. يمكنك إنشاء مؤسسة جديدة أو تعديل إعدادات المؤسسات الحالية.
          </p>
        </div>
        <Link 
          href="/dashboard/organizations/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مؤسسة جديدة</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orgsWithStats.map((org) => (
          <div key={org.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col group hover:shadow-md hover:border-emerald-100 transition-all">
            
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 overflow-hidden">
                {org.logoPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={org.logoPath} alt={org.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-6 h-6" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/dashboard/organizations/${org.id}`} // Or wherever the edit page is
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                  title="تعديل"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <form action={deleteOrganizationAction.bind(null, org.id)}>
                  <button 
                    type="submit"
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{org.name}</h3>
              <p className="text-sm text-gray-500">تم الإنشاء في: {org.formattedDate}</p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-sm font-bold text-gray-700">الألعاب المرتبطة</span>
              <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-lg text-sm">
                {org.gamesCount}
              </span>
            </div>
            
          </div>
        ))}

        {/* Empty State / Add Card */}
        <Link 
          href="/dashboard/organizations/new"
          className="bg-emerald-50/50 rounded-3xl p-6 border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center gap-3 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold">إنشاء مؤسسة جديدة</span>
        </Link>
      </div>
    </div>
  )
}
