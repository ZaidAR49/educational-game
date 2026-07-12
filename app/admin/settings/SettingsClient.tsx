"use client"

import { useState, useTransition } from "react"
import { Shield, UserPlus, Trash2, Mail, Ban, CheckCircle, Loader2, Eye, Pencil } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { addAdminAction, toggleAdminBlockAction, removeAdminAction, editAdminAction } from "@/lib/actions/admin.actions"

// Maps the DB role value to a human-readable Arabic label
const ROLE_LABEL: Record<string, string> = {
  super_admin: "مدير النظام",
  admin: "مسؤول",
  viewer: "مشاهد",
}

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

export function SettingsClient({ userRole, initialAdmins }: { userRole: string, initialAdmins: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<any | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'block' | 'unblock' | 'add' | null,
    payload?: any
  }>({ type: null })

  // Count super_admins so we can disable/warn the last one
  const superAdminCount = initialAdmins.filter(a => a.role === "super_admin").length

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
        if (confirmAction.type === 'delete') {
          await removeAdminAction(confirmAction.payload.id)
        } else if (confirmAction.type === 'block' || confirmAction.type === 'unblock') {
          await toggleAdminBlockAction(confirmAction.payload.id, confirmAction.type === 'block')
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة المسؤولين</h2>
          <p className="text-slate-500 mt-1">إضافة وإزالة مدراء المنصة</p>
        </div>
        {userRole === 'super_admin' && (
          <button
            onClick={() => { setActionError(null); setIsAddModalOpen(true) }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <UserPlus className="w-5 h-5" />
            إضافة مسؤول
          </button>
        )}
      </div>

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
          {initialAdmins.map((admin) => {
            const isLastSuperAdmin = admin.role === "super_admin" && superAdminCount <= 1
            return (
              <div key={admin.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
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
                    تاريخ الإضافة: {new Date(admin.addedAt).toLocaleDateString('ar-SA')}
                  </span>
                  {userRole === 'super_admin' && (
                    <>
                      {/* Edit button */}
                      <button
                        onClick={() => { setActionError(null); setEditTarget(admin) }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Block / Unblock */}
                      <button
                        onClick={() => setConfirmAction({ type: admin.status === 'active' ? 'block' : 'unblock', payload: admin })}
                        className={`p-2 rounded-lg transition-colors ${
                          admin.status === 'active'
                            ? "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={admin.status === 'active' ? "حظر المسؤول" : "إلغاء الحظر"}
                      >
                        {admin.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>

                      {/* Delete — disabled only if this is the very last super_admin */}
                      <button
                        onClick={() => setConfirmAction({ type: 'delete', payload: admin })}
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
          })}
        </div>
      </div>

      {/* ── Add Admin Modal ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">إضافة مسؤول جديد</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddAdminSubmit}>
                <div className="p-6 space-y-4">
                  {actionError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{actionError}</p>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
                    <input required name="name" type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="مثال: خالد محمد" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                    <input required name="email" type="email" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-left" dir="ltr" placeholder="admin@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الصلاحية</label>
                    <select name="role" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                      <option value="super_admin">مدير النظام — صلاحيات كاملة</option>
                      <option value="admin">مسؤول — يمكنه إدارة المستخدمين</option>
                      <option value="viewer">مشاهد — عرض فقط بدون تعديل</option>
                    </select>
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">
                    إلغاء
                  </button>
                  <button type="submit" disabled={isPending} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "منح الصلاحية"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Admin Modal ── */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">تعديل بيانات المسؤول</h3>
                <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <input type="hidden" name="userId" value={editTarget.id} />
                <div className="p-6 space-y-4">
                  {actionError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{actionError}</p>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
                    <input required name="name" type="text" defaultValue={editTarget.name} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                    <input disabled value={editTarget.email} dir="ltr" className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed text-left" />
                    <p className="text-xs text-slate-400 mt-1">البريد الإلكتروني لا يمكن تغييره</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الصلاحية</label>
                    <select name="role" defaultValue={editTarget.role} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                      <option value="super_admin">مدير النظام — صلاحيات كاملة</option>
                      <option value="admin">مسؤول — يمكنه إدارة المستخدمين</option>
                      <option value="viewer">مشاهد — عرض فقط بدون تعديل</option>
                    </select>
                    {editTarget.role === "super_admin" && superAdminCount <= 1 && (
                      <p className="text-xs text-amber-600 mt-1">⚠ هذا هو مدير النظام الوحيد، لا يمكن تخفيض صلاحيته.</p>
                    )}
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditTarget(null)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">
                    إلغاء
                  </button>
                  <button type="submit" disabled={isPending} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ التغييرات"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmAction.type !== null}
        onClose={() => setConfirmAction({ type: null })}
        onConfirm={executeAction}
        title={
          confirmAction.type === 'add' ? 'تأكيد الإضافة' :
          confirmAction.type === 'delete' ? 'تأكيد الإزالة' :
          confirmAction.type === 'block' ? 'تأكيد الحظر' :
          'إلغاء الحظر'
        }
        description={
          confirmAction.type === 'add' ? `هل أنت متأكد من منح الصلاحية للمستخدم ${confirmAction.payload?.name}؟` :
          confirmAction.type === 'delete' ? `هل أنت متأكد من إزالة صلاحيات ${confirmAction.payload?.name}؟ لن يتمكن من الدخول للوحة التحكم بعد ذلك.` :
          confirmAction.type === 'block' ? `هل أنت متأكد من حظر ${confirmAction.payload?.name} مؤقتاً؟` :
          `هل أنت متأكد من إلغاء حظر ${confirmAction.payload?.name}؟`
        }
        confirmText="تأكيد"
        cancelText="إلغاء"
        type={confirmAction.type === 'delete' || confirmAction.type === 'block' ? 'danger' : 'warning'}
      />
    </div>
  )
}
