"use client";

import { useState, useEffect } from "react";
import { Megaphone, UserSquare2, Trash2, Send, Plus, Loader2 } from "lucide-react";
import { 
  getSystemAnnouncementsAction, 
  createSystemAnnouncementAction, 
  deleteSystemAnnouncementAction,
  createUserNotificationAction,
  getUserNotificationsAction,
  deleteUserNotificationAction
} from "@/lib/actions/notifications.actions";

export default function NotificationsAdminPage() {
  const [activeTab, setActiveTab] = useState<"system" | "user">("system");
  const [isLoading, setIsLoading] = useState(true);
  
  // Data state
  const [systemAnnouncements, setSystemAnnouncements] = useState<any[]>([]);
  const [userNotifications, setUserNotifications] = useState<any[]>([]);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sysForm, setSysForm] = useState({ title: "", body: "", type: "message", severity: "info", endsAt: "" });
  const [userForm, setUserForm] = useState({ userId: "", title: "", body: "", type: "account" });
  const [deleteModal, setDeleteModal] = useState<{ id: string, type: "system" | "user" } | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "system") {
        const data = await getSystemAnnouncementsAction();
        setSystemAnnouncements(data);
      } else {
        const data = await getUserNotificationsAction();
        setUserNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSystem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sysForm.endsAt && new Date(sysForm.endsAt) <= new Date()) {
      alert("عذراً، تاريخ ووقت الانتهاء يجب أن يكون في المستقبل لتجنب الأخطاء.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createSystemAnnouncementAction({
        ...sysForm,
        endsAt: sysForm.endsAt ? new Date(sysForm.endsAt) : null,
      });
      setSysForm({ title: "", body: "", type: "message", severity: "info", endsAt: "" });
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUserNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUserNotificationAction(userForm);
      setUserForm({ userId: "", title: "", body: "", type: "account" });
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, type: "system" | "user") => {
    setDeleteModal({ id, type });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setIsSubmitting(true);
    try {
      if (deleteModal.type === "system") {
        await deleteSystemAnnouncementAction(deleteModal.id);
      } else {
        await deleteUserNotificationAction(deleteModal.id);
      }
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setDeleteModal(null);
    }
  };

  const severityColors: Record<string, string> = {
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    critical: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الإشعارات</h1>
          <p className="text-slate-500 mt-1">أرسل إشعارات للنظام بالكامل أو لمستخدمين محددين.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 space-x-reverse bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "system" 
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          إشعارات النظام
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "user" 
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <UserSquare2 className="w-4 h-4" />
          إشعارات المستخدمين
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CREATE FORM COLUMN */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-indigo-500" />
              {activeTab === "system" ? "إضافة إشعار نظام" : "إرسال إشعار لمستخدم"}
            </h2>

            {activeTab === "system" ? (
              <form onSubmit={handleCreateSystem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
                  <input
                    required
                    type="text"
                    value={sysForm.title}
                    onChange={(e) => setSysForm({ ...sysForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder="مثال: تحديث جديد للنظام!"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">النص</label>
                  <textarea
                    required
                    rows={3}
                    value={sysForm.body}
                    onChange={(e) => setSysForm({ ...sysForm, body: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                    placeholder="تفاصيل الإشعار..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">النوع</label>
                    <select
                      value={sysForm.type}
                      onChange={(e) => setSysForm({ ...sysForm, type: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    >
                      <option value="message">رسالة عامة</option>
                      <option value="update">تحديث</option>
                      <option value="maintenance">صيانة</option>
                      <option value="changelog">سجل التغييرات</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الأهمية</label>
                    <select
                      value={sysForm.severity}
                      onChange={(e) => setSysForm({ ...sysForm, severity: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    >
                      <option value="info">عادي (أزرق)</option>
                      <option value="warning">تحذير (أصفر)</option>
                      <option value="critical">حرج (أحمر)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ ووقت الانتهاء (اختياري)</label>
                  <input
                    type="datetime-local"
                    value={sysForm.endsAt}
                    onChange={(e) => setSysForm({ ...sysForm, endsAt: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">إذا ترك فارغاً، سيبقى الإشعار ظاهراً حتى يتم حذفه.</p>
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  إرسال للجميع
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateUserNotif} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">معرف المستخدم (User ID)</label>
                  <input
                    required
                    type="text"
                    value={userForm.userId}
                    onChange={(e) => setUserForm({ ...userForm, userId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-mono text-sm"
                    placeholder="123e4567-e89b-12d3-a456-426614174000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
                  <input
                    required
                    type="text"
                    value={userForm.title}
                    onChange={(e) => setUserForm({ ...userForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder="مثال: تم تفعيل حسابك"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">النص</label>
                  <textarea
                    required
                    rows={3}
                    value={userForm.body}
                    onChange={(e) => setUserForm({ ...userForm, body: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                    placeholder="محتوى الإشعار..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">النوع</label>
                  <select
                    value={userForm.type}
                    onChange={(e) => setUserForm({ ...userForm, type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    <option value="account">حساب</option>
                    <option value="gameplay">لعب</option>
                    <option value="billing">فوترة</option>
                  </select>
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  إرسال للمستخدم
                </button>
              </form>
            )}
          </div>
        </div>

        {/* LIST COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 min-h-[500px]">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">
              {activeTab === "system" ? "الإشعارات النشطة" : "أحدث إشعارات المستخدمين"}
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : activeTab === "system" ? (
              <div className="space-y-4">
                {systemAnnouncements.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">لا توجد إشعارات نشطة حالياً.</div>
                ) : (
                  systemAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${severityColors[announcement.severity] || severityColors.info}`}>
                            {announcement.severity}
                          </span>
                          <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">{announcement.type}</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 truncate">{announcement.title}</h3>
                        <p className="text-sm text-slate-600 truncate mt-1">{announcement.body}</p>
                      </div>
                      <div className="mt-4 sm:mt-0 mr-0 sm:mr-4 flex shrink-0">
                        <button
                          onClick={() => handleDelete(announcement.id, "system")}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {userNotifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">لا توجد إشعارات حالياً.</div>
                ) : (
                  userNotifications.map(({ notification, user }) => (
                    <div key={notification.id} className="flex flex-col sm:flex-row items-start justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md font-medium">
                            {notification.type}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(notification.createdAt).toLocaleDateString("ar-SA")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-800 truncate">{notification.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mt-1">{notification.body}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 mr-0 sm:mr-4 shrink-0 flex items-center gap-2">
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm">
                          <div className="text-slate-500 text-xs mb-1">تم الإرسال إلى:</div>
                          <div className="font-medium text-slate-700">{user?.name || "مستخدم غير معروف"}</div>
                          <div className="text-slate-400 text-xs">{user?.email || notification.userId}</div>
                        </div>
                        <button
                          onClick={() => handleDelete(notification.id, "user")}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 text-center mb-2">تأكيد الحذف</h3>
              <p className="text-slate-500 text-center text-sm">
                هل أنت متأكد من رغبتك في حذف هذا الإشعار؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
              <button
                disabled={isSubmitting}
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 text-slate-600 font-medium bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                disabled={isSubmitting}
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white font-medium bg-red-600 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
