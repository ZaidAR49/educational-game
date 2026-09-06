import type { Game, ClassroomPlay } from "@/lib/db/schema";

export const DEMO_PLAY: Pick<ClassroomPlay, 'id'> = {
  id: "demo-play-id"
};

// ─── Arabic Demo Game ────────────────────────────────────────────────────────

export const DEMO_GAME_AR: Game & { isDemo: boolean; organization?: any } = {
  id: "demo",
  ownerId: "00000000-0000-0000-0000-000000000000",
  organizationId: null,
  organization: {
    logoPath: "/icon.png"
  },
  title: "مغامرة المعرفة: الصحة والوعي",
  description: "لعبة تعليمية سريعة لتجربة منصة EduPlay، تركز على الصحة العامة والعادات السليمة.",
  slug: "demo-game",
  icon: "🧬",
  status: "published",
  language: "ar",
  isPublic: true,
  isDemo: true,
  accessCode: null,
  settings: {},
  maxPoints: 30,
  playCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const DEMO_SCENARIOS_AR = [
  {
    id: "scenario-1",
    gameId: "demo",
    orderIndex: 0,
    icon: "🏃‍♂️",
    title: "الرياضة والنشاط البدني",
    description: "أنت تشعر بالخمول وتريد أن تزيد من نشاطك اليومي. ما هو الخيار الأفضل للبدء؟",
    createdAt: new Date(),
    updatedAt: new Date(),
    choices: [
      {
        id: "c1-1",
        scenarioId: "scenario-1",
        orderIndex: 0,
        text: "ممارسة المشي لمدة 30 دقيقة يومياً",
        icon: "🚶",
        feedbackTitle: "ممتاز!",
        feedbackMessage: "المشي رياضة رائعة ومنخفضة الجهد للبدء بتنشيط الجسم وتحسين الدورة الدموية.",
        feedbackTip: "حاول المشي في الهواء الطلق للاستفادة من أشعة الشمس.",
        points: 10,
        isCorrect: true,
        createdAt: new Date()
      },
      {
        id: "c1-2",
        scenarioId: "scenario-1",
        orderIndex: 1,
        text: "شراء معدات رياضية باهظة الثمن",
        icon: "💸",
        feedbackTitle: "غير دقيق",
        feedbackMessage: "لا تحتاج لمعدات باهظة للبدء، يمكنك البدء بتمارين بسيطة.",
        feedbackTip: "الأهم هو الاستمرارية، وليس المعدات.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c1-3",
        scenarioId: "scenario-1",
        orderIndex: 2,
        text: "تناول مشروبات الطاقة",
        icon: "⚡",
        feedbackTitle: "احذر!",
        feedbackMessage: "مشروبات الطاقة تحتوي على سكر وكافيين عالي قد يضر بصحتك.",
        feedbackTip: "النشاط البدني الطبيعي أفضل مصدر للطاقة المستدامة.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c1-4",
        scenarioId: "scenario-1",
        orderIndex: 3,
        text: "النوم لفترات أطول طوال اليوم",
        icon: "😴",
        feedbackTitle: "نوم زائد",
        feedbackMessage: "النوم الزائد قد يزيد من الشعور بالخمول والكسل.",
        feedbackTip: "احرص على تنظيم ساعات نومك وعدم المبالغة فيها.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      }
    ]
  },
  {
    id: "scenario-2",
    gameId: "demo",
    orderIndex: 1,
    icon: "🍎",
    title: "التغذية السليمة",
    description: "خلال فترة الامتحانات، تشعر بالجوع الدائم وتحتاج لتركيز عالي. ماذا تختار كوجبة خفيفة؟",
    createdAt: new Date(),
    updatedAt: new Date(),
    choices: [
      {
        id: "c2-1",
        scenarioId: "scenario-2",
        orderIndex: 0,
        text: "رقائق البطاطس المقلية",
        icon: "🍟",
        feedbackTitle: "خيار غير صحي",
        feedbackMessage: "تحتوي على دهون مشبعة تسبب الخمول وتقلل التركيز.",
        feedbackTip: "تجنب الأطعمة المقلية أثناء فترات المذاكرة.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c2-2",
        scenarioId: "scenario-2",
        orderIndex: 1,
        text: "المكسرات والفواكه",
        icon: "🥜",
        feedbackTitle: "أحسنت الاختيار!",
        feedbackMessage: "المكسرات توفر طاقة مستدامة والفواكه غنية بالفيتامينات المهمة لنشاط الدماغ.",
        feedbackTip: "الجوز واللوز مفيدان جداً للذاكرة.",
        points: 10,
        isCorrect: true,
        createdAt: new Date()
      },
      {
        id: "c2-3",
        scenarioId: "scenario-2",
        orderIndex: 2,
        text: "الحلويات المصنعة",
        icon: "🍬",
        feedbackTitle: "طاقة مؤقتة",
        feedbackMessage: "ترفع السكر بسرعة ثم ينخفض فجأة مما يسبب التعب.",
        feedbackTip: "اختر السكريات الطبيعية مثل التمر أو العسل.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c2-4",
        scenarioId: "scenario-2",
        orderIndex: 3,
        text: "الامتناع عن الأكل تماماً",
        icon: "🚫",
        feedbackTitle: "تصرف خاطئ",
        feedbackMessage: "دماغك يحتاج إلى طاقة ليعمل بكفاءة أثناء المذاكرة.",
        feedbackTip: "الجوع يقلل من قدرتك على الاستيعاب.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      }
    ]
  },
  {
    id: "scenario-3",
    gameId: "demo",
    orderIndex: 2,
    icon: "📵",
    title: "الوعي الرقمي",
    description: "تستخدم هاتفك لساعات طويلة قبل النوم وتواجه صعوبة في الاستيقاظ نشيطاً. ما هو الحل؟",
    createdAt: new Date(),
    updatedAt: new Date(),
    choices: [
      {
        id: "c3-1",
        scenarioId: "scenario-3",
        orderIndex: 0,
        text: "شرب القهوة قبل النوم",
        icon: "☕",
        feedbackTitle: "قرار خاطئ تماماً",
        feedbackMessage: "الكافيين سيزيد من الأرق ويمنعك من النوم العميق.",
        feedbackTip: "تجنب الكافيين قبل 6 ساعات على الأقل من موعد النوم.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c3-2",
        scenarioId: "scenario-3",
        orderIndex: 1,
        text: "إيقاف الشاشات قبل ساعة من النوم",
        icon: "🌙",
        feedbackTitle: "نصيحة ذهبية!",
        feedbackMessage: "الضوء الأزرق يمنع إفراز هرمون الميلاتونين المسؤول عن النوم. إيقاف الشاشات يحسن جودة نومك.",
        feedbackTip: "جرب قراءة كتاب ورقي بدلاً من تصفح الهاتف.",
        points: 10,
        isCorrect: true,
        createdAt: new Date()
      },
      {
        id: "c3-3",
        scenarioId: "scenario-3",
        orderIndex: 2,
        text: "خفض إضاءة الشاشة فقط",
        icon: "📱",
        feedbackTitle: "غير كافٍ",
        feedbackMessage: "حتى الإضاءة الخافتة تحفز الدماغ وتقلل جودة النوم.",
        feedbackTip: "الأفضل التوقف تماماً عن استخدام الأجهزة الذكية.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c3-4",
        scenarioId: "scenario-3",
        orderIndex: 3,
        text: "أخذ حبوب منومة باستمرار",
        icon: "💊",
        feedbackTitle: "خطر طبي",
        feedbackMessage: "الاعتماد على الأدوية بدون استشارة قد يسبب الإدمان ومشاكل أخرى.",
        feedbackTip: "الحلول الطبيعية دائماً أفضل لتحسين جودة النوم.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      }
    ]
  }
];

// ─── English Demo Game ───────────────────────────────────────────────────────

export const DEMO_GAME_EN: Game & { isDemo: boolean; organization?: any } = {
  id: "demo",
  ownerId: "00000000-0000-0000-0000-000000000000",
  organizationId: null,
  organization: {
    logoPath: "/icon.png"
  },
  title: "Knowledge Adventure: Health & Awareness",
  description: "A quick educational game to experience the EduPlay platform, focusing on public health and healthy habits.",
  slug: "demo-game",
  icon: "🧬",
  status: "published",
  language: "en",
  isPublic: true,
  isDemo: true,
  accessCode: null,
  settings: {},
  maxPoints: 30,
  playCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const DEMO_SCENARIOS_EN = [
  {
    id: "scenario-1",
    gameId: "demo",
    orderIndex: 0,
    icon: "🏃‍♂️",
    title: "Sports & Physical Activity",
    description: "You feel sluggish and want to increase your daily activity. What is the best option to start?",
    createdAt: new Date(),
    updatedAt: new Date(),
    choices: [
      {
        id: "c1-1",
        scenarioId: "scenario-1",
        orderIndex: 0,
        text: "Walking for 30 minutes daily",
        icon: "🚶",
        feedbackTitle: "Excellent!",
        feedbackMessage: "Walking is a fantastic, low-impact exercise to revitalize your body and enhance blood circulation.",
        feedbackTip: "Try walking outdoors to soak in natural sunlight.",
        points: 10,
        isCorrect: true,
        createdAt: new Date()
      },
      {
        id: "c1-2",
        scenarioId: "scenario-1",
        orderIndex: 1,
        text: "Buying expensive gym equipment",
        icon: "💸",
        feedbackTitle: "Not quite",
        feedbackMessage: "You don't need expensive equipment to begin; simple bodyweight exercises are just as effective.",
        feedbackTip: "Consistency matters far more than gear.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c1-3",
        scenarioId: "scenario-1",
        orderIndex: 2,
        text: "Drinking energy drinks",
        icon: "⚡",
        feedbackTitle: "Watch out!",
        feedbackMessage: "Energy drinks are packed with excessive sugars and caffeine that can harm your health.",
        feedbackTip: "Natural exercise is the best source of sustainable energy.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c1-4",
        scenarioId: "scenario-1",
        orderIndex: 3,
        text: "Sleeping longer throughout the day",
        icon: "😴",
        feedbackTitle: "Excessive Sleep",
        feedbackMessage: "Oversleeping can actually amplify feelings of fatigue and sluggishness.",
        feedbackTip: "Maintain consistent sleep hours without oversleeping.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      }
    ]
  },
  {
    id: "scenario-2",
    gameId: "demo",
    orderIndex: 1,
    icon: "🍎",
    title: "Healthy Nutrition",
    description: "During exam season, you feel constantly hungry and need high concentration. What do you choose for a snack?",
    createdAt: new Date(),
    updatedAt: new Date(),
    choices: [
      {
        id: "c2-1",
        scenarioId: "scenario-2",
        orderIndex: 0,
        text: "Fried potato chips",
        icon: "🍟",
        feedbackTitle: "Unhealthy choice",
        feedbackMessage: "They contain saturated fats that induce lethargy and impair mental focus.",
        feedbackTip: "Avoid greasy, fried foods during intense study periods.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c2-2",
        scenarioId: "scenario-2",
        orderIndex: 1,
        text: "Nuts and fresh fruits",
        icon: "🥜",
        feedbackTitle: "Great choice!",
        feedbackMessage: "Nuts provide long-lasting brain energy and fruits are packed with vital cognitive vitamins.",
        feedbackTip: "Walnuts and almonds are renowned for memory support.",
        points: 10,
        isCorrect: true,
        createdAt: new Date()
      },
      {
        id: "c2-3",
        scenarioId: "scenario-2",
        orderIndex: 2,
        text: "Processed sweets and candy",
        icon: "🍬",
        feedbackTitle: "Temporary spike",
        feedbackMessage: "Causes an immediate blood sugar spike followed by an energy crash that brings fatigue.",
        feedbackTip: "Choose wholesome natural sugars such as dates or raw honey.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c2-4",
        scenarioId: "scenario-2",
        orderIndex: 3,
        text: "Skipping food completely",
        icon: "🚫",
        feedbackTitle: "Counterproductive",
        feedbackMessage: "Your brain requires consistent glucose to process and retain complex information.",
        feedbackTip: "Hunger severely weakens your ability to comprehend and remember.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      }
    ]
  },
  {
    id: "scenario-3",
    gameId: "demo",
    orderIndex: 2,
    icon: "📵",
    title: "Digital Wellness",
    description: "You spend long hours on your smartphone before sleeping and struggle to wake up energized. What is the solution?",
    createdAt: new Date(),
    updatedAt: new Date(),
    choices: [
      {
        id: "c3-1",
        scenarioId: "scenario-3",
        orderIndex: 0,
        text: "Drinking coffee before bedtime",
        icon: "☕",
        feedbackTitle: "Completely wrong",
        feedbackMessage: "Caffeine disrupts sleep architecture and prevents deep, restorative sleep cycles.",
        feedbackTip: "Avoid caffeine at least 6 hours before you head to bed.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c3-2",
        scenarioId: "scenario-3",
        orderIndex: 1,
        text: "Turning off all screens an hour before sleep",
        icon: "🌙",
        feedbackTitle: "Golden advice!",
        feedbackMessage: "Blue light suppresses melatonin secretion. Powering down screens dramatically improves sleep quality.",
        feedbackTip: "Try reading a physical book rather than scrolling on your phone.",
        points: 10,
        isCorrect: true,
        createdAt: new Date()
      },
      {
        id: "c3-3",
        scenarioId: "scenario-3",
        orderIndex: 2,
        text: "Just dimming the screen brightness",
        icon: "📱",
        feedbackTitle: "Not enough",
        feedbackMessage: "Even dim display illumination stimulates neural activity and reduces deep sleep.",
        feedbackTip: "It's best to put smart devices completely out of reach.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      },
      {
        id: "c3-4",
        scenarioId: "scenario-3",
        orderIndex: 3,
        text: "Taking sleeping pills regularly",
        icon: "💊",
        feedbackTitle: "Medical hazard",
        feedbackMessage: "Using medications without medical supervision can lead to dependency and adverse side effects.",
        feedbackTip: "Natural bedtime habits and regular exercise are always the best remedy.",
        points: 0,
        isCorrect: false,
        createdAt: new Date()
      }
    ]
  }
];

// ─── Multi-Language Resolvers ───────────────────────────────────────────────

export function getDemoGame(locale: string = "ar"): Game & { isDemo: boolean; organization?: any } {
  return locale === "en" ? DEMO_GAME_EN : DEMO_GAME_AR;
}

export function getDemoScenarios(locale: string = "ar") {
  return locale === "en" ? DEMO_SCENARIOS_EN : DEMO_SCENARIOS_AR;
}

// Default export aliases for backwards compatibility
export const DEMO_GAME = DEMO_GAME_AR;
export const DEMO_SCENARIOS = DEMO_SCENARIOS_AR;
