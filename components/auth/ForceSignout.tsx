"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export function ForceSignout() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">جاري تسجيل الخروج...</p>
      </div>
    </div>
  );
}
