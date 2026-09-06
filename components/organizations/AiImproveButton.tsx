"use client";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { improveTextAction } from "@/lib/actions/ai.actions";
import { toast } from "sonner";
import { useLocale } from "@/lib/i18n/LanguageContext";

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
  const { locale, isRTL } = useLocale();
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const isLoading = isLocalLoading || isGlobalLoading;

  const handleImprove = async () => {
    if (!text || text.trim() === "") {
      toast.error(locale === 'ar' ? "الرجاء كتابة نص أولاً ليتم تحسينه." : "Please enter text first to improve it.");
      return;
    }
    
    setIsLocalLoading(true);
    if (onGlobalLoadingChange) onGlobalLoadingChange(true);

    try {
      const improvedText = await improveTextAction(text, context);
      if (improvedText) {
        onImproved(improvedText.trim());
        toast.success(locale === 'ar' ? "تم تحسين النص بنجاح!" : "Text improved successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(locale === 'ar' ? "حدث خطأ أثناء تحسين النص." : "Error occurred while improving text.");
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
      className={`absolute ${isRTL ? 'left-3' : 'right-3'} text-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg shadow-sm border border-purple-100 flex items-center justify-center ${className}`}
      title={locale === 'ar' ? "تحسين باستخدام الذكاء الاصطناعي" : "Improve with AI"}
      aria-label={locale === 'ar' ? "تحسين باستخدام الذكاء الاصطناعي" : "Improve with AI"}
    >
      {isLocalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
    </button>
  );
}
