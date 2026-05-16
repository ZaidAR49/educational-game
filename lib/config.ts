/** Static app configuration — no environment variables. */
export const config = {
  appName: "بطل القرارات الصحيحة",
  appDescription:
    "لعبة تفاعلية توعوية للأطفال والمراهقين لتعليمهم اتخاذ القرارات الصحيحة والابتعاد عن المخدرات",
  campaignSubtitle: "حملة توعوية من جمعية حماية الأسرة والطفولة",
  organizationName: "جمعية حماية الأسرة والطفولة",
  copyrightText: "جميع الحقوق محفوظة © جمعية حماية الأسرة 2026",
  copyrightYear: 2026,
  logoUrl:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RAjIY76Hw3j0ou7DFHe6b2WCKJ74Rb.png",
  enableAnalytics: true,
  devPort: 3000,
  routes: {
    home: "/",
    game: "/game",
  },
  game: {
    feedbackDelayMs: 800,
    confettiPieceCount: 50,
    confettiClearMs: 4000,
    confettiColors: [
      "#2ecc71",
      "#3498db",
      "#f39c12",
      "#e74c3c",
      "#9b59b6",
      "#1abc9c",
    ],
    resultThresholds: {
      excellent: 80,
      good: 50,
    },
    shareTitle: "بطل القرارات الصحيحة",
  },
} as const
