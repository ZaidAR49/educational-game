"use client"

import { useState, useTransition, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Shield, ShieldOff, Trash2, Ban, CheckCircle, Eye, Zap, ZapOff, UserPlus, Loader2, ChevronRight, ChevronLeft, ArrowDownUp } from "lucide-react"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { UserDetailsModal } from "./UserDetailsModal"
import { AddUserModal } from "./AddUserModal"
import { addNormalUserAction, toggleUserSubscriptionAction, toggleUserBlockAction, deleteUserAction } from "@/lib/actions/admin.actions"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useLocale } from "@/lib/i18n/LanguageContext"

export function UsersTable({ 
  userRole, 
  initialUsers,
  totalPages,
  currentPage,
  currentSearch,
  currentFilter,
  currentSort
}: { 
  userRole: string; 
  initialUsers: any[];
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentFilter: string;
  currentSort: string;
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t, isRTL } = useLocale()

  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)
  const [filter, setFilter] = useState<"all" | "pro" | "locked">(currentFilter as any)
  const [sort, setSort] = useState(currentSort)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "subscribe" | "block" | "unblock" | null
    user: any | null
  }>({ type: null, user: null })

  useEffect(() => {
    setSearch(currentSearch)
    setFilter(currentFilter as any)
    setSort(currentSort)
  }, [currentSearch, currentFilter, currentSort])

  useEffect(() => {
    if (search === currentSearch) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set('q', search);
      else params.delete('q');
      params.set('page', '1');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, currentSearch, pathname, router, searchParams]);

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await addNormalUserAction(formData)
        setIsAddUserModalOpen(false)
      } catch (err) {
        console.error(err)
        toast.error(isRTL ? "حدث خطأ أثناء إضافة المستخدم" : "Failed to add user")
      }
    })
  }

  const filteredUsers = initialUsers;

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set('s', newSort);
    params.set('page', '1');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const handleFilterChange = (f: string) => {
    setFilter(f as any);
    const params = new URLSearchParams(searchParams.toString());
    if (f !== 'all') params.set('f', f);
    else params.delete('f');
    params.set('page', '1');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const executeSubscriptionToggle = () => {
    if (!confirmAction.user) return
    const { id: userId, plan } = confirmAction.user
    startTransition(async () => {
      try { await toggleUserSubscriptionAction(userId, plan !== "pro") }
      catch (err) { console.error(err) }
      finally { setConfirmAction({ type: null, user: null }) }
    })
  }

  const executeBlockToggle = () => {
    if (!confirmAction.user) return
    const { id: userId, status } = confirmAction.user
    startTransition(async () => {
      try { await toggleUserBlockAction(userId, status !== "locked") }
      catch (err) { console.error(err) }
      finally { setConfirmAction({ type: null, user: null }) }
    })
  }

  const executeDelete = () => {
    if (!confirmAction.user) return
    startTransition(async () => {
      try { await deleteUserAction(confirmAction.user.id) }
      catch (err) { console.error(err) }
      finally { setConfirmAction({ type: null, user: null }) }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
            <input
              type="text"
              placeholder={t.adminAccounts.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm`}
            />
          </div>
          {userRole !== "viewer" && (
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-5 h-5" /> <span>{t.adminAccounts.addUser}</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 overflow-x-auto w-fit">
            {(["all", "pro", "locked"] as const).map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filter === f ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {f === "all" && t.adminAccounts.filterAll}
                {f === "pro" && (<><Zap className="w-3.5 h-3.5" /> {t.adminAccounts.filterPro}</>)}
                {f === "locked" && (<><Ban className="w-3.5 h-3.5" /> {t.adminAccounts.filterLocked}</>)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
              <ArrowDownUp className="w-4 h-4" /> {t.adminAccounts.sortBy}
            </span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className={`bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 rounded-xl px-3 py-2 ${isRTL ? 'pr-8' : 'pl-8'} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
            >
              <option value="newest">{t.adminAccounts.sortNewest}</option>
              <option value="oldest">{t.adminAccounts.sortOldest}</option>
              <option value="recent_login">{t.adminAccounts.sortRecentLogin}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-start">{t.adminAccounts.thUser}</th>
              <th className="px-6 py-4 text-start">{t.adminAccounts.thRole}</th>
              <th className="px-6 py-4 text-start">{t.adminAccounts.thPlan}</th>
              <th className="px-6 py-4 text-start">{t.adminAccounts.thStatus}</th>
              <th className="px-6 py-4 text-start">{t.adminAccounts.thDate}</th>
              <th className="px-6 py-4 text-center">{t.adminAccounts.thActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 relative">
            {isPending && (
              <tr className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm rounded-b-2xl">
                <td colSpan={6} className="h-full">
                  <div className="flex items-center justify-center h-full min-h-[200px]">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                </td>
              </tr>
            )}
            {filteredUsers.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                      <Shield className="w-3.5 h-3.5" /> {t.adminAccounts.roleAdmin}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                      <ShieldOff className="w-3.5 h-3.5" /> {t.adminAccounts.roleUser}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.plan === "pro" ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">{t.adminAccounts.planPro}</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">{t.adminAccounts.planFree}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.status === "active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {t.adminAccounts.statusActive}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t.adminAccounts.statusLocked}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString(isRTL ? "ar-u-nu-latn" : "en-US")}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setSelectedUser(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title={t.adminAccounts.viewDetails}>
                      <Eye className="w-4 h-4" />
                    </button>
                    {userRole !== "viewer" && (
                      <>
                        <button
                          onClick={() => setConfirmAction({ type: "subscribe", user })}
                          className={`p-2 rounded-lg transition-colors ${user.plan === "pro" ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50" : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"}`}
                          title={user.plan === "pro" ? t.adminAccounts.downgradePro : t.adminAccounts.upgradePro}
                        >
                          {user.plan === "pro" ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setConfirmAction({ type: user.status === "active" ? "block" : "unblock", user })}
                          className={`p-2 rounded-lg transition-colors ${user.status === "active" ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                          title={user.status === "active" ? t.adminAccounts.blockUser : t.adminAccounts.unblockUser}
                        >
                          {user.status === "active" ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setConfirmAction({ type: "delete", user })} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={t.adminAccounts.deleteUser}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-slate-500">{t.adminAccounts.noUsersFound}</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-6 bg-white border-t border-slate-100 rounded-b-2xl">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isPending}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            if (
              totalPages > 7 &&
              pageNum !== 1 &&
              pageNum !== totalPages &&
              Math.abs(pageNum - currentPage) > 1
            ) {
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <span key={i} className="w-10 h-10 flex items-center justify-center text-slate-400">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={i}
                onClick={() => handlePageChange(pageNum)}
                disabled={isPending}
                className={`w-10 h-10 rounded-xl font-bold transition-colors ${
                  currentPage === pageNum
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isPending}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isAddUserModalOpen && (
          <AddUserModal isPending={isPending} onClose={() => setIsAddUserModalOpen(false)} onSubmit={handleAddUser} />
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmAction.type === "subscribe"}
        onClose={() => setConfirmAction({ type: null, user: null })}
        onConfirm={executeSubscriptionToggle}
        title={t.adminAccounts.confirmSubscribeTitle}
        description={t.adminAccounts.confirmSubscribeMsg.replace('{name}', confirmAction.user?.name || '').replace('{plan}', confirmAction.user?.plan === "pro" ? t.adminAccounts.planFree : t.adminAccounts.planPro)}
        confirmText={isRTL ? "تأكيد" : "Confirm"} 
        cancelText={isRTL ? "إلغاء" : "Cancel"} 
        type="warning"
      />
      <ConfirmModal
        isOpen={confirmAction.type === "block" || confirmAction.type === "unblock"}
        onClose={() => setConfirmAction({ type: null, user: null })}
        onConfirm={executeBlockToggle}
        title={confirmAction.user?.status === "active" ? t.adminAccounts.confirmBlockTitle : t.adminAccounts.confirmUnblockTitle}
        description={confirmAction.user?.status === "active" 
          ? t.adminAccounts.confirmBlockMsg.replace('{name}', confirmAction.user?.name || '')
          : t.adminAccounts.confirmUnblockMsg.replace('{name}', confirmAction.user?.name || '')
        }
        confirmText={isRTL ? "تأكيد" : "Confirm"} 
        cancelText={isRTL ? "إلغاء" : "Cancel"} 
        type={confirmAction.type === "block" ? "danger" : "warning"}
      />
      <ConfirmModal
        isOpen={confirmAction.type === "delete"}
        onClose={() => setConfirmAction({ type: null, user: null })}
        onConfirm={executeDelete}
        title={t.adminAccounts.confirmDeleteTitle}
        description={t.adminAccounts.confirmDeleteMsg.replace('{name}', confirmAction.user?.name || '')}
        confirmText={isRTL ? "حذف" : "Delete"} 
        cancelText={isRTL ? "إلغاء" : "Cancel"} 
        type="danger"
      />
    </div>
  )
}
