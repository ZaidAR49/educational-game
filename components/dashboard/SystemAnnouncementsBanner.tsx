"use client";

import { useState, useEffect } from "react";
import { Megaphone, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getMySystemAnnouncementsAction,
  dismissSystemAnnouncementAction 
} from "@/lib/actions/notifications.actions";

export function SystemAnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchAnnouncements = async () => {
    try {
      const data = await getMySystemAnnouncementsAction();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching system announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      await dismissSystemAnnouncementAction(id);
    } catch (error) {
      console.error("Failed to dismiss announcement:", error);
      fetchAnnouncements(); // Revert on failure
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading || announcements.length === 0) return null;

  const severityStyles: Record<string, { bg: string, icon: string, badge: string, decor: string, shimmer: string }> = {
    info: {
      bg: "bg-white border-r-4 border-r-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-100",
      icon: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      badge: "bg-emerald-100 text-emerald-700",
      decor: "text-emerald-50",
      shimmer: "from-transparent via-emerald-50/50 to-transparent"
    },
    warning: {
      bg: "bg-white border-r-4 border-r-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-slate-100",
      icon: "bg-amber-50 text-amber-600 border border-amber-100",
      badge: "bg-amber-100 text-amber-700",
      decor: "text-amber-50",
      shimmer: "from-transparent via-amber-50/50 to-transparent"
    },
    critical: {
      bg: "bg-white border-r-4 border-r-rose-500 shadow-xl shadow-rose-500/10 ring-1 ring-slate-100",
      icon: "bg-rose-50 text-rose-600 border border-rose-100",
      badge: "bg-rose-100 text-rose-700",
      decor: "text-rose-50",
      shimmer: "from-transparent via-rose-50/50 to-transparent"
    },
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <AnimatePresence>
        {announcements.slice(0, 3).map((item) => {
          const style = severityStyles[item.severity] || severityStyles.info;
          const isExpanded = expandedIds.has(item.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
              className={`relative overflow-hidden rounded-2xl ${style.bg}`}
            >
              {/* Decorative Background Icon */}
              <div className={`absolute top-0 left-0 opacity-10 pointer-events-none transform -translate-x-4 -translate-y-4 -rotate-12 ${style.decor}`}>
                <Megaphone className="w-40 h-40" />
              </div>

              {/* Shimmer Effect */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-r ${style.shimmer} pointer-events-none`}
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
              />

              <div className="relative p-5 sm:p-6 flex gap-5">
                <div className="shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${style.icon}`}>
                    <Megaphone className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex-1 min-w-0 ${item.body ? 'cursor-pointer' : ''}`} onClick={() => item.body && toggleExpand(item.id)}>
                      <div className="flex items-center gap-3">
                        <h3 className="font-extrabold text-lg text-slate-800 leading-tight tracking-tight">
                          {item.title}
                        </h3>
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${style.badge}`}>
                          <Sparkles className="w-3 h-3" />
                          جديد
                        </span>
                      </div>
                      
                      <AnimatePresence initial={false}>
                        {isExpanded && item.body && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-wrap break-words break-all mt-3">
                              {item.body}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      onClick={(e) => handleDismiss(e, item.id)}
                      className="shrink-0 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors group z-10"
                      title="إخفاء الإعلان"
                      aria-label="إخفاء"
                    >
                      <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
