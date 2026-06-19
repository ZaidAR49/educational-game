/** Static technical configuration — all UI text lives in data/ui-content.json */
export const config = {
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
  },
} as const
