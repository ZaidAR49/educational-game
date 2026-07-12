"use client"

import { useState, useEffect, use, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Users, Activity, Trophy, Medal, Award, Crown, CheckCircle2, XCircle, PowerOff, RefreshCw, Loader2, QrCode } from "lucide-react"
import { getLiveSessionDataAction } from "@/lib/actions/sessions.actions"
import { toggleGamePublishStatusAction } from "@/lib/actions/games.actions"
import { GameShareModal } from "@/components/games/GameShareModal"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase-client"

export default function LiveSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [session, setSession] = useState<{ id: string; gameName: string } | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [showQrModal, setShowQrModal] = useState(false)

  // Use Supabase Realtime for instant live updates
  useEffect(() => {
    let mounted = true;
    
    const fetchLiveSession = async () => {
      try {
        const data = await getLiveSessionDataAction(id);
        if (mounted) {
          if (data) {
            setSession(data.session);
            setStudents(data.players);
          } else {
            // No live session found, maybe it was closed
          }
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch live session data", e);
      }
    };

    // Fetch immediately on mount
    fetchLiveSession();

    // Subscribe to Realtime WebSocket updates for players
    const subscription = supabase
      .channel('live-players')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, () => {
        // Fetch new leaderboard state instantly when any player updates
        fetchLiveSession();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(subscription);
    };
  }, [id]);

  const handleEndSession = () => {
    startTransition(async () => {
      try {
        await toggleGamePublishStatusAction(id, false);
        if (session?.id) {
          router.push(`/dashboard/sessions/${session.id}/podium`);
        } else {
          router.push("/dashboard/sessions");
        }
      } catch (error) {
        console.error("Failed to end session", error);
        toast.error("حدث خطأ أثناء إنهاء الجلسة");
      }
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-bold">جاري تحميل بيانات الجلسة المباشرة...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <PowerOff className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">لا توجد جلسة مباشرة</h2>
          <p className="text-gray-500 max-w-md mx-auto">هذه اللعبة غير قيد التشغيل حالياً. يجب عليك بدء اللعبة من صفحة الألعاب أولاً.</p>
        </div>
        <Link 
          href="/dashboard/games"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
        >
          العودة للألعاب
        </Link>
      </div>
    )
  }

  // Sort students by score descending, then by duration ascending
  const sortedStudents = [...students].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.durationSeconds || Infinity) - (b.durationSeconds || Infinity);
  })
  const top3 = sortedStudents.slice(0, 3)

  const activePlayers = students.filter(s => s.isConnected).length
  const avgScore = students.length > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.score, 0) / students.length)
    : 0
    
  const totalCorrect = students.reduce((acc, curr) => acc + curr.correct, 0)
  const totalQuestionsAnswered = students.reduce((acc, curr) => acc + curr.correct + curr.wrong, 0)
  const correctPercentage = totalQuestionsAnswered > 0 
    ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) 
    : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboard/games" 
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-black text-gray-900">الجلسة المباشرة</h1>
            <div className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold ml-4">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </div>
              مباشر الآن
            </div>
          </div>
          <p className="text-gray-500 mr-14 font-bold text-lg">
            {session.gameName}
          </p>
        </div>

        {/* Management Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center justify-center w-[42px] h-[42px] bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 rounded-xl transition-all"
            title="عرض رمز QR للطلاب"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button 
            disabled={isPending}
            onClick={handleEndSession}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-100 shadow-sm text-red-600 hover:bg-red-100 disabled:opacity-50 rounded-xl font-bold transition-all"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PowerOff className="w-4 h-4" />}
            <span>إنهاء الجلسة</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-white rounded-3xl p-6 border border-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.1)] flex items-center gap-4 overflow-hidden group">
          <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-3xl animate-pulse pointer-events-none"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-indigo-50 opacity-20 blur-xl animate-pulse pointer-events-none"></div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center relative z-10">
            <Users className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-white"></span>
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 font-medium mb-1">الطلاب المتصلين</p>
            <h3 className="text-3xl font-black text-gray-900">{activePlayers} <span className="text-lg text-gray-400 font-medium">/ {students.length}</span></h3>
          </div>
        </div>
        
        <div className="relative bg-white rounded-3xl p-6 border border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center gap-4 overflow-hidden group">
          <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-3xl animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-emerald-50 opacity-20 blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center relative z-10">
            <Trophy className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 font-medium mb-1">متوسط الدرجات</p>
            <h3 className="text-3xl font-black text-gray-900">{avgScore}</h3>
          </div>
        </div>
        
        <div className="relative bg-white rounded-3xl p-6 border border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex items-center gap-4 overflow-hidden group">
          <div className="absolute inset-0 border-2 border-amber-400/30 rounded-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-100 to-amber-50 opacity-20 blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center relative z-10">
            <Activity className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white"></span>
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 font-medium mb-1">معدل الإجابات الصحيحة</p>
            <h3 className="text-3xl font-black text-gray-900">{correctPercentage}%</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Podium (Top 3) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-800 to-gray-900 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-end relative overflow-hidden h-[450px]">
          {/* Decorative Animated Background */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_4s_ease-in-out_infinite]"></div>
          
          {/* Glowing orb behind first place */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>

          <h2 className="absolute top-8 text-white text-2xl font-black flex items-center gap-2 drop-shadow-md z-20">
            <Crown className="w-6 h-6 text-amber-400" />
            أوائل التحدي
          </h2>

          {students.length > 0 ? (
            <div className="flex items-end justify-center gap-2 sm:gap-4 w-full relative z-10 h-64 mt-auto">
              {/* 2nd Place - Silver */}
              {top3[1] && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center w-1/3 group"
                >
                  <div className="text-white font-bold mb-6 text-center text-sm truncate w-full group-hover:-translate-y-1 transition-transform">{top3[1].name}</div>
                  <div className="w-full bg-gradient-to-t from-slate-400 via-slate-300 to-slate-200 rounded-t-2xl h-32 flex flex-col items-center justify-start pt-6 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.5)] border-t border-white/50">
                    <div className="absolute -top-7 w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-300 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(148,163,184,0.5)]">
                      <Medal className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-slate-800 font-black text-3xl mt-2 drop-shadow-sm">2</span>
                    <span className="text-slate-700 font-bold text-sm mt-1 bg-white/30 px-3 py-0.5 rounded-full backdrop-blur-sm shadow-inner">{top3[1].score}</span>
                  </div>
                </motion.div>
              )}

              {/* 1st Place - Gold */}
              {top3[0] && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center w-1/3 z-20"
                >
                  <div className="text-white font-black mb-8 text-center text-lg truncate w-full drop-shadow-md animate-[bounce_2s_ease-in-out_infinite]">{top3[0].name}</div>
                  <div className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 rounded-t-2xl h-44 flex flex-col items-center justify-start pt-6 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(245,158,11,0.3)] border-t-2 border-white/60">
                    <div className="absolute -top-10 w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-300 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.6)] relative">
                      <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/40"></div>
                      <Crown className="w-10 h-10 text-amber-700 drop-shadow-sm relative z-10" />
                    </div>
                    <span className="text-amber-900 font-black text-5xl mt-5 drop-shadow-md">1</span>
                    <span className="text-amber-900 font-bold mt-2 bg-white/40 px-4 py-1 rounded-full backdrop-blur-sm shadow-inner text-lg">{top3[0].score}</span>
                  </div>
                </motion.div>
              )}

              {/* 3rd Place - Bronze */}
              {top3[2] && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center w-1/3 group"
                >
                  <div className="text-white font-bold mb-6 text-center text-sm truncate w-full group-hover:-translate-y-1 transition-transform">{top3[2].name}</div>
                  <div className="w-full bg-gradient-to-t from-orange-600 via-orange-400 to-orange-300 rounded-t-2xl h-24 flex flex-col items-center justify-start pt-5 relative shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.5)] border-t border-white/40">
                    <div className="absolute -top-6 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-300 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                      <Award className="w-5 h-5 text-orange-700" />
                    </div>
                    <span className="text-orange-900 font-black text-2xl mt-2 drop-shadow-sm">3</span>
                    <span className="text-orange-800 font-bold text-xs mt-1 bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-inner">{top3[2].score}</span>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
             <div className="text-white/60 font-bold z-10 flex flex-col items-center gap-2">
               <Users className="w-10 h-10 opacity-50" />
               في انتظار انضمام الطلاب...
             </div>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">ترتيب الطلاب</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {sortedStudents.length > 0 ? sortedStudents.map((student, index) => (
              <motion.div 
                key={student.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${
                  index === 0 ? 'bg-amber-50 border-amber-200' : 
                  index === 1 ? 'bg-slate-50 border-slate-200' : 
                  index === 2 ? 'bg-orange-50 border-orange-200' : 
                  'bg-white border-gray-100'
                }`}
              >
                {/* Rank Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  index === 0 ? 'bg-amber-400 text-white' : 
                  index === 1 ? 'bg-slate-400 text-white' : 
                  index === 2 ? 'bg-orange-400 text-white' : 
                  'bg-gray-100 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                
                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 truncate">{student.name}</h4>
                    {!student.isConnected && (
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">أكمل الاختبار</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium mt-1">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {student.correct} صح
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="w-3.5 h-3.5" />
                      {student.wrong} خطأ
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="shrink-0 text-right">
                  <div className="text-xl font-black text-gray-900">{student.score}</div>
                  <div className="text-xs text-gray-400 font-medium">نقطة</div>
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Users className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-bold">لا يوجد طلاب متصلين حالياً</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showQrModal && session && (
        <GameShareModal 
          game={{ id, title: session.gameName } as any} 
          onClose={() => setShowQrModal(false)}
          hideLiveSessionButton={true}
        />
      )}
    </div>
  )
}
