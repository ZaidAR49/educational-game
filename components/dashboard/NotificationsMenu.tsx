"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, Check, Trash2, Megaphone, UserSquare2, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getMyNotificationsAction, 
  markUserNotificationReadAction,
  deleteMyNotificationAction,
  markAllNotificationsReadAction
} from "@/lib/actions/notifications.actions";

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Shrink any expanded notification when the panel closes
  useEffect(() => {
    if (!isOpen) {
      const timeoutId = setTimeout(() => {
        setExpandedId(null);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const notifs = await getMyNotificationsAction();
      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);



  const handleMarkRead = async (id: string) => {
    try {
      // Optimistic UI update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      await markUserNotificationReadAction(id);
    } catch (error) {
      console.error("Failed to mark as read:", error);
      // Re-fetch if optimistic update fails
      fetchNotifications();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // For direct user notifications, completely delete them
      setNotifications(prev => prev.filter(n => n.id !== id));
      await deleteMyNotificationAction(id);
    } catch (error) {
      console.error("Failed to delete:", error);
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      await markAllNotificationsReadAction();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const combined = notifications;

  const severityColors: Record<string, string> = {
    info: "text-blue-600 bg-blue-50 border-blue-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    critical: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) fetchNotifications(); // fresh fetch on open
        }}
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* Slide-over Panel via Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="relative z-[9999]" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }} // Slide from right
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-[100] flex flex-col border-l border-slate-100"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-800">الإشعارات</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                      {unreadCount} جديد
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50/50">
                {isLoading && combined.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    <span className="text-sm">جاري تحميل الإشعارات...</span>
                  </div>
                ) : combined.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                      <Bell className="w-8 h-8 text-slate-300" />
                    </div>
                    <span className="text-sm font-medium">لا توجد إشعارات حالياً</span>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {combined.map((item) => {
                      const uniqueId = `usr-${item.id}`;
                      const isExpanded = expandedId === uniqueId;
                      
                      return (
                        <div 
                          key={uniqueId} 
                          className={`p-5 transition-colors relative group bg-white ${!item.isRead ? 'bg-emerald-50/30' : 'hover:bg-slate-50'}`}
                        >
                          <div className="flex gap-4">
                            <div className="shrink-0 mt-0.5">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                                <UserSquare2 className="w-5 h-5" />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div 
                                className={`flex items-start justify-between gap-3 mb-1 ${item.body ? 'cursor-pointer' : ''}`}
                                onClick={() => item.body && setExpandedId(isExpanded ? null : uniqueId)}
                              >
                                <h4 
                                  className="text-sm font-bold text-slate-800 leading-tight hover:text-emerald-600 transition-colors break-words break-all"
                                >
                                  {item.title}
                                </h4>
                                {!isExpanded && !item.isRead && (
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                                )}
                              </div>
                              
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    key="content"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-sm text-slate-600 leading-relaxed mb-3 whitespace-pre-wrap break-words break-all mt-2">
                                      {item.body}
                                    </p>
                                    <div className="mb-3 flex items-center gap-2">
                                      {!item.isRead && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkRead(item.id);
                                          }}
                                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                          تحديد كمقروء
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(item.id);
                                        }}
                                        className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        حذف
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {new Date(item.createdAt).toLocaleDateString("ar-SA", { 
                                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
