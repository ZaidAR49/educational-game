"use client"

import { Shield, Mail, Ban, CheckCircle, Trash2, Pencil, Eye } from "lucide-react"

function RoleBadge({ role }: { role: string }) {
  if (role === "super_admin")
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-200">
        <Shield className="w-3 h-3" /> مدير النظام
      </span>
    )
  if (role === "admin")
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium border border-purple-200">
        <Shield className="w-3 h-3" /> مسؤول
      </span>
    )
  if (role === "viewer")
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium border border-sky-200">
        <Eye className="w-3 h-3" /> مشاهد
      </span>
    )
  return null
}

type AdminListItemProps = {
  admin: any
  userRole: string
  isLastSuperAdmin: boolean
  onEdit: (admin: any) => void
  onBlock: (admin: any) => void
  onDelete: (admin: any) => void
}

export function AdminListItem({
  admin,
  userRole,
  isLastSuperAdmin,
  onEdit,
  onBlock,
  onDelete,
}: AdminListItemProps) {
  return (
    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg relative">
          {admin.name.charAt(0)}
          {admin.status === "blocked" && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <div className="font-bold text-slate-800 flex items-center gap-2 flex-wrap">
            {admin.name}
            <RoleBadge role={admin.role} />
            {admin.status === "blocked" && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">محظور</span>
            )}
          </div>
          <div className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5" />
            <span dir="ltr">{admin.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
          تاريخ الإضافة: {new Date(admin.addedAt).toLocaleDateString("ar-SA")}
        </span>
        {userRole === "super_admin" && (
          <>
            <button
              onClick={() => onEdit(admin)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="تعديل"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onBlock(admin)}
              className={`p-2 rounded-lg transition-colors ${
                admin.status === "active"
                  ? "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              title={admin.status === "active" ? "حظر المسؤول" : "إلغاء الحظر"}
            >
              {admin.status === "active" ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(admin)}
              disabled={isLastSuperAdmin}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title={isLastSuperAdmin ? "لا يمكن حذف مدير النظام الوحيد" : "إزالة الصلاحية"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
