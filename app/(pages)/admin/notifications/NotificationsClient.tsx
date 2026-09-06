"use client";

import { useState, useEffect } from "react";
import { Megaphone, UserSquare2, Trash2, Send, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useLocale } from "@/lib/i18n/LanguageContext";
import { 
  getSystemAnnouncementsAction, 
  createSystemAnnouncementAction, 
  deleteSystemAnnouncementAction,
  deleteAllSystemAnnouncementsAction,
  createUserNotificationAction,
  getUserNotificationsAction,
  deleteUserNotificationAction,
  deleteAllUserNotificationsAction
} from "@/lib/actions/notifications.actions";

export default function NotificationsClient({ userRole }: { userRole: string }) {
  const { t, locale } = useLocale();
  const [activeTab, setActiveTab] = useState<"system" | "user">("system");
  const [isLoading, setIsLoading] = useState(true);
  
  // Data state
  const [systemAnnouncements, setSystemAnnouncements] = useState<any[]>([]);
  const [userNotifications, setUserNotifications] = useState<any[]>([]);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sysForm, setSysForm] = useState({ title: "", body: "", type: "message", severity: "info", language: "all", endsAt: "" });
  const [userForm, setUserForm] = useState({ userId: "", title: "", body: "", type: "account" });
  const [deleteModal, setDeleteModal] = useState<{ id: string, type: "system" | "user" } | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

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
      toast.error(t.adminNotifications.futureDateError);
      return;
    }

    setIsSubmitting(true);
    try {
      await createSystemAnnouncementAction({
        ...sysForm,
        endsAt: sysForm.endsAt ? new Date(sysForm.endsAt) : null,
      });
      setSysForm({ title: "", body: "", type: "message", severity: "info", language: "all", endsAt: "" });
      toast.success(t.adminNotifications.sysCreatedSuccess);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t.adminNotifications.sysCreatedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUserNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createUserNotificationAction(userForm);
      if (result && result.error) {
        toast.error(result.error);
      } else {
        setUserForm({ userId: "", title: "", body: "", type: "account" });
        toast.success(t.adminNotifications.userCreatedSuccess);
        await fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error(t.adminNotifications.userCreatedError);
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
      toast.success(t.adminNotifications.deletedSuccess);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t.adminNotifications.deletedError);
    } finally {
      setIsSubmitting(false);
      setDeleteModal(null);
    }
  };

  const confirmDeleteAll = () => {
    setShowDeleteAllConfirm(true);
  };

  const executeDeleteAll = async () => {
    setShowDeleteAllConfirm(false);
    setIsSubmitting(true);
    try {
      if (activeTab === "system") {
        await deleteAllSystemAnnouncementsAction();
      } else {
        await deleteAllUserNotificationsAction();
      }
      toast.success(t.adminNotifications.allDeletedSuccess);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error(t.adminNotifications.deletedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityColors: Record<string, string> = {
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    critical: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const sysTypeLabels: Record<string, string> = {
    message: t.adminNotifications.typeMessage,
    update: t.adminNotifications.typeUpdate,
    maintenance: t.adminNotifications.typeMaintenance,
    changelog: t.adminNotifications.typeChangelog,
  };

  const userTypeLabels: Record<string, string> = {
    account: t.adminNotifications.typeAccount,
    gameplay: t.adminNotifications.typeGameplay,
    billing: t.adminNotifications.typeBilling,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t.adminNotifications.pageTitle}</h1>
          <p className="text-slate-500 mt-1">{t.adminNotifications.pageSubtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200 gap-1">
        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "system" 
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50 font-bold" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          {t.adminNotifications.tabSystem}
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "user" 
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50 font-bold" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <UserSquare2 className="w-4 h-4" />
          {t.adminNotifications.tabUser}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CREATE FORM COLUMN */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-indigo-500" />
              {activeTab === "system" ? t.adminNotifications.addSystemTitle : t.adminNotifications.addUserTitle}
            </h2>

            {userRole === "viewer" ? (
              <div className="text-sm text-slate-500 text-center py-8">
                {t.adminNotifications.viewerNotice}
              </div>
            ) : activeTab === "system" ? (
              <form onSubmit={handleCreateSystem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelTitle}</label>
                  <input
                    required
                    type="text"
                    value={sysForm.title}
                    onChange={(e) => setSysForm({ ...sysForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder={t.adminNotifications.placeholderSysTitle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelText}</label>
                  <textarea
                    required
                    rows={3}
                    value={sysForm.body}
                    onChange={(e) => setSysForm({ ...sysForm, body: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                    placeholder={t.adminNotifications.placeholderSysText}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelType}</label>
                    <select
                      value={sysForm.type}
                      onChange={(e) => setSysForm({ ...sysForm, type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                    >
                      <option value="message">{t.adminNotifications.typeMessage}</option>
                      <option value="update">{t.adminNotifications.typeUpdate}</option>
                      <option value="maintenance">{t.adminNotifications.typeMaintenance}</option>
                      <option value="changelog">{t.adminNotifications.typeChangelog}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelSeverity}</label>
                    <select
                      value={sysForm.severity}
                      onChange={(e) => setSysForm({ ...sysForm, severity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                    >
                      <option value="info">{t.adminNotifications.severityInfo}</option>
                      <option value="warning">{t.adminNotifications.severityWarning}</option>
                      <option value="critical">{t.adminNotifications.severityCritical}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelLanguage}</label>
                    <select
                      value={sysForm.language}
                      onChange={(e) => setSysForm({ ...sysForm, language: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium"
                    >
                      <option value="all">{t.adminNotifications.langAll}</option>
                      <option value="ar">{t.adminNotifications.langAr}</option>
                      <option value="en">{t.adminNotifications.langEn}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelEndsAt}</label>
                  <input
                    type="datetime-local"
                    value={sysForm.endsAt}
                    onChange={(e) => setSysForm({ ...sysForm, endsAt: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">{t.adminNotifications.endsAtHint}</p>
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {t.adminNotifications.sendToAll}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateUserNotif} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelUserId}</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelTitle}</label>
                  <input
                    required
                    type="text"
                    value={userForm.title}
                    onChange={(e) => setUserForm({ ...userForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder={t.adminNotifications.placeholderUserTitle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelText}</label>
                  <textarea
                    required
                    rows={3}
                    value={userForm.body}
                    onChange={(e) => setUserForm({ ...userForm, body: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                    placeholder={t.adminNotifications.placeholderUserText}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.adminNotifications.labelType}</label>
                  <select
                    value={userForm.type}
                    onChange={(e) => setUserForm({ ...userForm, type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    <option value="account">{t.adminNotifications.typeAccount}</option>
                    <option value="gameplay">{t.adminNotifications.typeGameplay}</option>
                    <option value="billing">{t.adminNotifications.typeBilling}</option>
                  </select>
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {t.adminNotifications.sendToUser}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* LIST COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 min-h-[500px]">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-slate-800">
                {activeTab === "system" ? t.adminNotifications.activeSystemTitle : t.adminNotifications.activeUserTitle}
              </h2>
              {userRole !== "viewer" && ((activeTab === "system" && systemAnnouncements.length > 0) || (activeTab === "user" && userNotifications.length > 0)) && (
                <button
                  onClick={confirmDeleteAll}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
                  title={t.adminNotifications.deleteAll}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t.adminNotifications.deleteAll}
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : activeTab === "system" ? (
              <div className="space-y-4">
                {systemAnnouncements.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">{t.adminNotifications.noActiveSystem}</div>
                ) : (
                  systemAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 group gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${severityColors[announcement.severity] || severityColors.info}`}>
                            {t.adminNotifications[("severity" + announcement.severity.charAt(0).toUpperCase() + announcement.severity.slice(1)) as keyof typeof t.adminNotifications] || announcement.severity}
                          </span>
                          <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                            {sysTypeLabels[announcement.type] || announcement.type}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${
                            announcement.language === "ar"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : announcement.language === "en"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}>
                            {announcement.language === "ar"
                              ? t.adminNotifications.badgeLangAr
                              : announcement.language === "en"
                              ? t.adminNotifications.badgeLangEn
                              : t.adminNotifications.badgeLangAll}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-800 truncate">{announcement.title}</h3>
                        <p className="text-sm text-slate-600 truncate mt-1">{announcement.body}</p>
                      </div>
                      {userRole !== "viewer" && (
                        <div className="flex shrink-0">
                          <button
                            onClick={() => handleDelete(announcement.id, "system")}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title={t.adminNotifications.deleteTooltip}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {userNotifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">{t.adminNotifications.noActiveUser}</div>
                ) : (
                  userNotifications.map(({ notification, user }) => (
                    <div key={notification.id} className="flex flex-col sm:flex-row items-start justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md font-medium">
                            {userTypeLabels[notification.type] || notification.type}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(notification.createdAt).toLocaleDateString(locale === "ar" ? "ar-u-nu-latn" : "en-US")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-800 truncate">{notification.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mt-1">{notification.body}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm min-w-[200px]">
                          <div className="flex items-center justify-between gap-3 text-slate-500 text-xs mb-1">
                            <span>{t.adminNotifications.sentTo}</span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {user?.locale === "en" ? "🇺🇸 English" : "🇸🇦 العربية"}
                            </span>
                          </div>
                          <div className="font-medium text-slate-700">{user?.name || t.adminNotifications.unknownUser}</div>
                          <div className="text-slate-400 text-xs font-mono">{user?.email || notification.userId}</div>
                        </div>
                        {userRole !== "viewer" && (
                          <button
                            onClick={() => handleDelete(notification.id, "user")}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title={t.adminNotifications.deleteTooltip}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
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
              <h3 className="text-lg font-bold text-slate-800 text-center mb-2">{t.adminNotifications.confirmDeleteTitle}</h3>
              <p className="text-slate-500 text-center text-sm">
                {t.adminNotifications.confirmDeleteDesc}
              </p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
              <button
                disabled={isSubmitting}
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 text-slate-600 font-medium bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                {t.adminNotifications.cancel}
              </button>
              <button
                disabled={isSubmitting}
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white font-medium bg-red-600 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t.adminNotifications.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        onConfirm={executeDeleteAll}
        title={t.adminNotifications.confirmDeleteAllTitle}
        description={t.adminNotifications.confirmDeleteAllDesc}
        confirmText={t.adminNotifications.deleteAll}
        cancelText={t.adminNotifications.cancel}
        type="danger"
      />
    </div>
  );
}
