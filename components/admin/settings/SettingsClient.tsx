"use client"

import { useState, useTransition } from "react"
import { Shield, UserPlus, Loader2 } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { addAdminAction, toggleAdminBlockAction, removeAdminAction, editAdminAction } from "@/lib/actions/admin.actions"
import { AddAdminModal } from "./AddAdminModal"
import { EditAdminModal } from "./EditAdminModal"
import { AdminListItem } from "./AdminListItem"

export function SettingsClient({ userRole, initialAdmins }: { userRole: string; initialAdmins: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<any | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "block" | "unblock" | "add" | null
    payload?: any
  }>({ type: null })

  const superAdminCount = initialAdmins.filter((a) => a.role === "super_admin").length

  const handleAddAdminSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setActionError(null)
    startTransition(async () => {
      try {
        await addAdminAction(formData)
        setIsAddModalOpen(false)
      } catch (err: any) {
        setActionError(err?.message || "حدث خطأ أثناء إضافة المسؤول")
      }
    })
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setActionError(null)
    startTransition(async () => {
      try {
        await editAdminAction(formData)
        setEditTarget(null)
      } catch (err: any) {
        setActionError(err?.message || "حدث خطأ أثناء تعديل المسؤول")
      }
    })
  }

  const executeAction = () => {
    if (!confirmAction.type || !confirmAction.payload) return
    setActionError(null)
    startTransition(async () => {
      try {
        if (confirmAction.type === "delete") {
          await removeAdminAction(confirmAction.payload.id)
        } else if (confirmAction.type === "block" || confirmAction.type === "unblock") {
          await toggleAdminBlockAction(confirmAction.payload.id, confirmAction.type === "block")
        }
      } catch (err: any) {
        setActionError(err?.message || "حدث خطأ أثناء تنفيذ الإجراء")
      } finally {
        setConfirmAction({ type: null })
      }
    })
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Error banner */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-600 ml-4">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة المسؤولين</h2>
          <p className="text-slate-500 mt-1">إضافة وإزالة مدراء المنصة</p>
        </div>
        {userRole === "super_admin" && (
          <button
            onClick={() => { setActionError(null); setIsAddModalOpen(true) }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <UserPlus className="w-5 h-5" /> إضافة مسؤول
          </button>
        )}
      </div>

      {/* Admin list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-slate-800">قائمة المسؤولين الحاليين</h3>
          </div>
        </div>

        <div className="divide-y divide-slate-100 relative">
          {isPending && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-b-2xl">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          )}
          {initialAdmins.map((admin) => (
            <AdminListItem
              key={admin.id}
              admin={admin}
              userRole={userRole}
              isLastSuperAdmin={admin.role === "super_admin" && superAdminCount <= 1}
              onEdit={(a) => { setActionError(null); setEditTarget(a) }}
              onBlock={(a) => setConfirmAction({ type: a.status === "active" ? "block" : "unblock", payload: a })}
              onDelete={(a) => setConfirmAction({ type: "delete", payload: a })}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddAdminModal
            isPending={isPending}
            actionError={actionError}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddAdminSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTarget && (
          <EditAdminModal
            admin={editTarget}
            isPending={isPending}
            actionError={actionError}
            superAdminCount={superAdminCount}
            onClose={() => setEditTarget(null)}
            onSubmit={handleEditSubmit}
          />
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmAction.type !== null}
        onClose={() => setConfirmAction({ type: null })}
        onConfirm={executeAction}
        title={
          confirmAction.type === "add" ? "تأكيد الإضافة" :
          confirmAction.type === "delete" ? "تأكيد الإزالة" :
          confirmAction.type === "block" ? "تأكيد الحظر" : "إلغاء الحظر"
        }
        description={
          confirmAction.type === "add" ? `هل أنت متأكد من منح الصلاحية للمستخدم ${confirmAction.payload?.name}؟` :
          confirmAction.type === "delete" ? `هل أنت متأكد من إزالة صلاحيات ${confirmAction.payload?.name}؟` :
          confirmAction.type === "block" ? `هل أنت متأكد من حظر ${confirmAction.payload?.name} مؤقتاً؟` :
          `هل أنت متأكد من إلغاء حظر ${confirmAction.payload?.name}؟`
        }
        confirmText="تأكيد"
        cancelText="إلغاء"
        type={confirmAction.type === "delete" || confirmAction.type === "block" ? "danger" : "warning"}
      />
    </div>
  )
}
