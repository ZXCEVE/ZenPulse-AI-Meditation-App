export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: DifficultyLevel;
  imageUrl: string;
  isPremium: boolean;
}

export const MEDITATIONS: Meditation[] = [
  {
    id: "1",
    title: "Утренняя ясность",
    description: "Начните день с ясным умом и позитивным настроем",
    duration: 10,
    difficulty: "beginner",
    imageUrl: "https://picsum.photos/seed/morning1/400/300",
    isPremium: false,
  },
  {
    id: "2",
    title: "Глубокое расслабление",
    description: "Освободитесь от напряжения и стресса",
    duration: 15,
    difficulty: "beginner",
    imageUrl: "https://picsum.photos/seed/relax2/400/300",
    isPremium: false,
  },
  {
    id: "3",
    title: "Сфокусированный ум",
    description: "Развивайте концентрацию и внимание",
    duration: 12,
    difficulty: "intermediate",
    imageUrl: "https://picsum.photos/seed/focus3/400/300",
    isPremium: false,
  },
  {
    id: "4",
    title: "Внутренний покой",
    description: "Найдите гармонию и спокойствие внутри себя",
    duration: 20,
    difficulty: "intermediate",
    imageUrl: "https://picsum.photos/seed/peace4/400/300",
    isPremium: true,
  },
  {
    id: "5",
    title: "Энергия жизни",
    description: "Наполнитесь жизненной энергией и силой",
    duration: 18,
    difficulty: "intermediate",
    imageUrl: "https://picsum.photos/seed/energy5/400/300",
    isPremium: true,
  },
  {
    id: "6",
    title: "Осознанный сон",
    description: "Подготовьтесь к глубокому и восстанавливающему сну",
    duration: 25,
    difficulty: "advanced",
    imageUrl: "https://picsum.photos/seed/sleep6/400/300",
    isPremium: true,
  },
  {
    id: "7",
    title: "Дыхание жизни",
    description: "Освойте технику глубокого дыхания",
    duration: 8,
    difficulty: "beginner",
    imageUrl: "https://picsum.photos/seed/breath7/400/300",
    isPremium: true,
  },
  {
    id: "8",
    title: "Медитация благодарности",
    description: "Развивайте чувство благодарности и любви",
    duration: 15,
    difficulty: "intermediate",
    imageUrl: "https://picsum.photos/seed/gratitude8/400/300",
    isPremium: true,
  },
];

export const PREMIUM_BENEFITS = [
  {
    id: "1",
    icon: "infinite",
    title: "Безлимитный доступ",
    description: "Все медитации и программы без ограничений",
  },
  {
    id: "2",
    icon: "star",
    title: "Эксклюзивный контент",
    description: "Премиум медитации от экспертов",
  },
  {
    id: "3",
    icon: "cloud-offline",
    title: "Офлайн режим",
    description: "Скачивайте медитации для прослушивания без интернета",
  },
  {
    id: "4",
    icon: "analytics",
    title: "AI Аналитика",
    description: "Персональные рекомендации и отслеживание прогресса",
  },
  {
    id: "5",
    icon: "notifications",
    title: "Умные напоминания",
    description: "Персонализированный график медитаций",
  },
];

export type MoodType = "joy" | "calm" | "energy";

export const MOOD_AFFIRMATIONS: Record<MoodType, string[]> = {
  joy: [
    "Сегодняшний день принесёт вам радость и приятные сюрпризы. Вы заслуживаете счастья.",
    "Ваша улыбка освещает мир вокруг. Продолжайте делиться своим светом с другими.",
    "Счастье находится внутри вас прямо сейчас. Позвольте ему расцвести.",
  ],
  calm: [
    "В этот момент вы в полной безопасности. Всё происходит так, как должно быть.",
    "Ваш ум спокоен, как утреннее озеро. Отпустите все беспокойства и просто дышите.",
    "Вы заслуживаете момента тишины и покоя. Примите этот дар от вселенной.",
  ],
  energy: [
    "Энергия течёт через вас, наполняя силой и вдохновением. Действуйте уверенно.",
    "Ваш потенциал безграничен. Сегодняшний день — идеальное время для достижения целей.",
    "Вы полны жизненной силы. Используйте эту энергию для создания прекрасного.",
  ],
};
