"use client"

import Link from "next/link"
import { Plus, Building2, Pencil } from "lucide-react"
import { DeleteOrganizationButton } from "@/components/organizations/DeleteOrganizationButton"
import { PaginationControls } from "@/components/shared/PaginationControls"
import { SearchAndFilter } from "@/components/shared/SearchAndFilter"
import { useLocale } from "@/lib/i18n/LanguageContext"

interface OrganizationItem {
  id: string
  name: string
  logoPath: string | null
  createdAt: Date | string | null
  gamesCount: number
  formattedDate: string
}

interface OrganizationsClientProps {
  organizations: OrganizationItem[]
  currentPage: number
  totalPages: number
  showSearchAndFilter: boolean
}

export function OrganizationsClient({
  organizations,
  currentPage,
  totalPages,
  showSearchAndFilter,
}: OrganizationsClientProps) {
  const { t, locale } = useLocale()
  const o = t.organizations

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{o.title}</h1>
          <p className="text-gray-500">
            {o.subtitle}
          </p>
        </div>
        <Link 
          href="/dashboard/organizations/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>{o.newOrgBtn}</span>
        </Link>
      </div>

      {showSearchAndFilter && (
        <SearchAndFilter 
          placeholder={o.searchPlaceholder} 
          showStatusFilter={false} 
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
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
                  href={`/dashboard/organizations/${org.id}`}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                  title={o.editTooltip}
                  aria-label={o.editTooltip}
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <DeleteOrganizationButton orgId={org.id} orgName={org.name} />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{org.name}</h3>
              <p className="text-sm text-gray-500">
                {o.createdAt} {org.formattedDate}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-sm font-bold text-gray-700">{o.linkedGames}</span>
              <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-lg text-sm">
                {org.gamesCount.toLocaleString('en-US')}
              </span>
            </div>
            
          </div>
        ))}

        {/* Empty State / Add Card */}
        {organizations.length === 0 && (
          <Link 
            href="/dashboard/organizations/new"
            className="bg-emerald-50/50 rounded-3xl p-6 border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center gap-3 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold">{o.createOrgPrompt}</span>
          </Link>
        )}
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
