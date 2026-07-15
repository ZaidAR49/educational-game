"use client";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { improveTextAction } from "@/lib/actions/ai.actions";
import { toast } from "sonner";

interface AiImproveButtonProps {
  text: string;
  context: string;
  onImproved: (newText: string) => void;
  className?: string;
  isGlobalLoading?: boolean;
  onGlobalLoadingChange?: (isLoading: boolean) => void;
}

export function AiImproveButton({ 
  text, 
  context, 
  onImproved, 
  className = "",
  isGlobalLoading = false,
  onGlobalLoadingChange
}: AiImproveButtonProps) {
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const isLoading = isLocalLoading || isGlobalLoading;

  const handleImprove = async () => {
    if (!text || text.trim() === "") {
      toast.error("الرجاء كتابة نص أولاً ليتم تحسينه.");
      return;
    }
    
    setIsLocalLoading(true);
    if (onGlobalLoadingChange) onGlobalLoadingChange(true);

    try {
      const improvedText = await improveTextAction(text, context);
      if (improvedText) {
        onImproved(improvedText.trim());
        toast.success("تم تحسين النص بنجاح!");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحسين النص.");
    } finally {
      setIsLocalLoading(false);
      if (onGlobalLoadingChange) onGlobalLoadingChange(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleImprove}
      disabled={isLoading}
      className={`absolute left-3 text-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg shadow-sm border border-purple-100 flex items-center justify-center ${className}`}
      title="تحسين باستخدام الذكاء الاصطناعي"
    >
      {isLocalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
    </button>
  );
}
