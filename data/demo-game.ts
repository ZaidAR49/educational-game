import type { Game, ClassroomPlay } from "@/lib/db/schema";

export const DEMO_GAME: Game & { isDemo: boolean; organization?: any } = {
  id: "demo",
  ownerId: "00000000-0000-0000-0000-000000000000",
  organizationId: null,
  organization: {
    logoPath: "/icon.png" // use the app's icon as the website logo
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

export const DEMO_PLAY: Pick<ClassroomPlay, 'id'> = {
  id: "demo-play-id"
};

export const DEMO_SCENARIOS = [
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
