"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Shield, ShieldOff, Trash2, Ban, CheckCircle, Eye, Zap, ZapOff, Users, Building2, Gamepad2, UserPlus, Loader2 } from "lucide-react"
import { ConfirmModal } from "@/components/shared/ConfirmModal"
import { addNormalUserAction, toggleUserSubscriptionAction, toggleUserBlockAction, deleteUserAction } from "@/lib/actions/admin.actions"

export function UsersTable({ userRole, initialUsers }: { userRole: string, initialUsers: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "pro" | "locked">("all")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'subscribe' | 'block' | 'unblock' | null,
    user: any | null
  }>({ type: null, user: null })

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        await addNormalUserAction(formData)
        setIsAddUserModalOpen(false)
      } catch (err) {
        console.error(err)
        alert("حدث خطأ أثناء إضافة المستخدم")
      }
    })
  }

  const filteredUsers = initialUsers.filter(user => {
    // Exclude admins, only show normal users
    if (user.role === "admin") return false;

    const matchesSearch = user.name.includes(search) || user.email.includes(search);
    const matchesFilter = 
      filter === "all" ? true : 
      filter === "pro" ? user.plan === "pro" : 
      user.status === "locked";
    
    return matchesSearch && matchesFilter;
  })

  const executeSubscriptionToggle = () => {
    if (!confirmAction.user) return;
    const userId = confirmAction.user.id;
    const isPro = confirmAction.user.plan === "pro";
    
    startTransition(async () => {
      try {
        await toggleUserSubscriptionAction(userId, !isPro);
      } catch (err) {
        console.error(err);
      } finally {
        setConfirmAction({ type: null, user: null });
      }
    });
  }

  const executeBlockToggle = () => {
    if (!confirmAction.user) return;
    const userId = confirmAction.user.id;
    const isLocked = confirmAction.user.status === "locked";
    
    startTransition(async () => {
      try {
        await toggleUserBlockAction(userId, !isLocked);
      } catch (err) {
        console.error(err);
      } finally {
        setConfirmAction({ type: null, user: null });
      }
    });
  }

  const executeDelete = () => {
    if (!confirmAction.user) return;
    
    startTransition(async () => {
      try {
        await deleteUserAction(confirmAction.user.id);
      } catch (err) {
        console.error(err);
      } finally {
        setConfirmAction({ type: null, user: null });
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          {userRole !== 'viewer' && (
            <button 
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-5 h-5" />
              إضافة مستخدم
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 overflow-x-auto w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter("pro")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filter === "pro" ? "bg-white text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> مشتركي برو
          </button>
          <button
            onClick={() => setFilter("locked")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filter === "locked" ? "bg-white text-red-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Ban className="w-3.5 h-3.5" /> محظورين
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">المستخدم</th>
              <th className="px-6 py-4">الصلاحية</th>
              <th className="px-6 py-4">الباقة</th>
              <th className="px-6 py-4">الحالة</th>
              <th className="px-6 py-4">تاريخ التسجيل</th>
              <th className="px-6 py-4 text-center">إجراءات</th>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={user.id} 
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
                      <Shield className="w-3.5 h-3.5" /> مسوؤل
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                      <ShieldOff className="w-3.5 h-3.5" /> مستخدم
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.plan === "pro" ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                      برو (Pro)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                      مجاني
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.status === "active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      محظور
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {userRole !== 'viewer' && (
                      <>
                        <button 
                          onClick={() => setConfirmAction({ type: 'subscribe', user })}
                          className={`p-2 rounded-lg transition-colors ${
                            user.plan === "pro" 
                              ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50" 
                              : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          }`} 
                          title={user.plan === "pro" ? "إلغاء الاشتراك" : "ترقية لبرو"}
                        >
                          {user.plan === "pro" ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setConfirmAction({ type: user.status === 'active' ? 'block' : 'unblock', user })}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'active' 
                              ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50" 
                              : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          }`} 
                          title={user.status === 'active' ? "حظر المستخدم" : "إلغاء الحظر"}
                        >
                          {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setConfirmAction({ type: 'delete', user })}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="حذف"
                        >
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
          <div className="p-12 text-center text-slate-500">
            لا توجد حسابات مطابقة للبحث
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">تفاصيل الحساب</h3>
                <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl font-bold">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{selectedUser.name}</div>
                    <div className="text-slate-500 text-sm">{selectedUser.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm font-medium">المنظمات</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{selectedUser.organizations}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Gamepad2 className="w-4 h-4" />
                      <span className="text-sm font-medium">الألعاب</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{selectedUser.games}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">إجمالي اللاعبين</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{selectedUser.totalPlayers}</div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">إضافة مستخدم جديد</h3>
                <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddUser}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
                    <input required name="name" type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="مثال: محمد أحمد" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                    <input required name="email" type="email" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-left" dir="ltr" placeholder="user@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الباقة</label>
                    <select name="plan" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                      <option value="free">مجاني</option>
                      <option value="pro">برو (Pro)</option>
                    </select>
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                  >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "إضافة"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmAction.type === 'subscribe'}
        onClose={() => setConfirmAction({ type: null, user: null })}
        onConfirm={executeSubscriptionToggle}
        title={confirmAction.user?.plan === "pro" ? "إلغاء الاشتراك" : "ترقية لبرو"}
        description={confirmAction.user?.plan === "pro" ? `هل أنت متأكد من إلغاء اشتراك برو للمستخدم ${confirmAction.user?.name}؟` : `هل أنت متأكد من ترقية المستخدم ${confirmAction.user?.name} إلى برو؟`}
        confirmText="تأكيد"
        cancelText="إلغاء"
        type="warning"
      />

      <ConfirmModal
        isOpen={confirmAction.type === 'block' || confirmAction.type === 'unblock'}
        onClose={() => setConfirmAction({ type: null, user: null })}
        onConfirm={executeBlockToggle}
        title={confirmAction.user?.status === "active" ? "حظر المستخدم" : "إلغاء الحظر"}
        description={confirmAction.user?.status === "active" ? `هل أنت متأكد من حظر المستخدم ${confirmAction.user?.name}؟ لن يتمكن من الدخول إلى المنصة.` : `هل أنت متأكد من إلغاء حظر المستخدم ${confirmAction.user?.name}؟ سيتمكن من الدخول إلى المنصة مجدداً.`}
        confirmText="تأكيد"
        cancelText="إلغاء"
        type={confirmAction.type === 'block' ? "danger" : "warning"}
      />

      <ConfirmModal
        isOpen={confirmAction.type === 'delete'}
        onClose={() => setConfirmAction({ type: null, user: null })}
        onConfirm={executeDelete}
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف المستخدم ${confirmAction.user?.name} نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
      />
    </div>
  )
}
