"use server";

import { getGenAIClient } from "@/lib/ai/genai-client";
import { auth } from "@/auth";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function improveTextAction(text: string, context: string): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const ai = getGenAIClient();
  const prompt = `أنت خبير في كتابة النصوص الجذابة للتطبيقات التعليمية.
قم بتحسين النص التالي الخاص بـ: "${context}".
النص الحالي: "${text}"
اجعله احترافياً، جذاباً، ومناسباً لجمهور الطلاب. لا تضف أي مقدمات أو شروحات، أعد النص المحسن فقط.`;

  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text || text;
    } catch (error) {
      lastError = error;
      console.warn(`[improveTextAction] محاولة ${attempt} فشلت:`, (error as Error).message);
      
      if (attempt < MAX_RETRIES) {
        // تأخير متزايد مع عشوائية بسيطة لتجنب الضغط المتزامن
        const delay = attempt * 1500 + Math.random() * 500;
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

export async function improveOrganizationFormAction(formData: Record<string, string>): Promise<Record<string, string>> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const ai = getGenAIClient();
  const prompt = `أنت خبير في كتابة النصوص الجذابة للتطبيقات التعليمية.
قم بتحسين كافة نصوص نموذج "إعدادات المؤسسة" التالية لتكون احترافية، جذابة، ومناسبة للطلاب.
تأكد من الحفاظ على نفس البنية ونفس المفاتيح (Keys) وتوحيد نبرة الصوت في جميع النصوص.
لا تقم بإرجاع أي شيء سوى كائن JSON صالح تماماً، وتجنب إضافة أي نصوص خارج الكائن.

البيانات الحالية:
${JSON.stringify(formData, null, 2)}`;

  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("لم يتم إرجاع أي نص من الذكاء الاصطناعي");
      }

      let cleanJson = response.text.trim();
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json/g, '');
      if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/```/g, '');
      if (cleanJson.endsWith('```')) cleanJson = cleanJson.replace(/```/g, '');
      
      return JSON.parse(cleanJson.trim());
    } catch (error) {
      lastError = error;
      console.warn(`[improveOrganizationFormAction] محاولة ${attempt} فشلت:`, (error as Error).message);
      
      if (attempt < MAX_RETRIES) {
        const delay = attempt * 2000 + Math.random() * 1000;
        await sleep(delay);
      }
    }
  }

  throw lastError;
}
