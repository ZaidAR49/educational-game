"use client"

import { useState, useEffect, use, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, PowerOff, Loader2, QrCode } from "lucide-react"
import { getLiveSessionDataAction } from "@/lib/actions/sessions.actions"
import { toggleGamePublishStatusAction } from "@/lib/actions/games.actions"
import { GameShareModal } from "@/components/games/GameShareModal"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase-client"

import { LiveStatsCards } from "@/components/dashboard/games/live/LiveStatsCards"
import { LivePodium } from "@/components/dashboard/games/live/LivePodium"
import { LiveLeaderboardTable } from "@/components/dashboard/games/live/LiveLeaderboardTable"

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
          }
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch live session data", e);
      }
    };

    fetchLiveSession();

    const subscription = supabase
      .channel('live-players')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, () => {
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
      <LiveStatsCards 
        activePlayers={activePlayers}
        totalStudents={students.length}
        avgScore={avgScore}
        correctPercentage={correctPercentage}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <LivePodium top3={top3} totalStudents={students.length} />
        <LiveLeaderboardTable sortedStudents={sortedStudents} />
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
