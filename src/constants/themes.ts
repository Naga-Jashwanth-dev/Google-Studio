import type {
  BirthdayBoard,
  CardThemeId,
  CelebrationMode,
  RelationshipType,
  WishVibe,
} from '../types/birthday';

export interface CardThemeMeta {
  id: CardThemeId;
  label: string;
  subtitle: string;
  imagePath: string;
  surfaceBg: string;
  gradientBg: string;
  borderClass: string;
  textColor: string;
  mutedColor: string;
  accentHex: string;
  isDark: boolean;
  confettiColors: string[];
}

export const CARD_THEMES: Record<CardThemeId, CardThemeMeta> = {
  blush: {
    id: 'blush',
    label: 'HeartCraft Blush',
    subtitle: 'Rose clouds, pastel hearts & gold trim',
    imagePath: '/src/assets/images/card_art_cake_1794817684294.jpg',
    surfaceBg: '#FFF5F8',
    gradientBg: 'linear-gradient(180deg, #FFE6EE 0%, #FFD5E3 55%, #FFF1F5 100%)',
    borderClass: 'border-rose-200',
    textColor: '#881337',
    mutedColor: '#9F1239',
    accentHex: '#E11D48',
    isDark: false,
    confettiColors: ['#E11D48', '#FB7185', '#FBBF24', '#60A5FA', '#A78BFA'],
  },
  confetti: {
    id: 'confetti',
    label: 'Paper Streamers',
    subtitle: 'Coral, marigold & cobalt print',
    imagePath: '/src/assets/images/card_art_confetti_1794817683816.jpg',
    surfaceBg: '#FFFDF8',
    gradientBg: 'linear-gradient(180deg, #FFF7ED 0%, #FFE4E6 100%)',
    borderClass: 'border-amber-200/80',
    textColor: '#1C1917',
    mutedColor: '#57534E',
    accentHex: '#E11D48',
    isDark: false,
    confettiColors: ['#E11D48', '#F59E0B', '#2563EB', '#10B981', '#FB7185'],
  },
  cake: {
    id: 'cake',
    label: 'Candlelit Cake',
    subtitle: 'Sunlit buttercream & berries',
    imagePath: '/src/assets/images/card_art_cake_1794817684294.jpg',
    surfaceBg: '#FFFBF5',
    gradientBg: 'linear-gradient(180deg, #FEF3C7 0%, #FFE4E6 100%)',
    borderClass: 'border-rose-200/80',
    textColor: '#1C1917',
    mutedColor: '#57534E',
    accentHex: '#D97706',
    isDark: false,
    confettiColors: ['#F59E0B', '#E11D48', '#FB923C', '#FDE047', '#F43F5E'],
  },
  botanical: {
    id: 'botanical',
    label: 'Wildflower Bouquet',
    subtitle: 'Poppies, mimosa & pressed paper',
    imagePath: '/src/assets/images/card_art_botanical_1794817684968.jpg',
    surfaceBg: '#FCFBF7',
    gradientBg: 'linear-gradient(180deg, #ECFDF5 0%, #FEF3C7 100%)',
    borderClass: 'border-emerald-200/80',
    textColor: '#1C1917',
    mutedColor: '#57534E',
    accentHex: '#059669',
    isDark: false,
    confettiColors: ['#F43F5E', '#10B981', '#FBBF24', '#3B82F6', '#FB7185'],
  },
  celestial: {
    id: 'celestial',
    label: 'Lantern Sky',
    subtitle: 'Twilight indigo & warm gold',
    imagePath: '/src/assets/images/card_art_celestial_1794817685160.jpg',
    surfaceBg: '#0F1E3D',
    gradientBg: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)',
    borderClass: 'border-indigo-800/70',
    textColor: '#FAF7F0',
    mutedColor: '#CBD5E1',
    accentHex: '#FBBF24',
    isDark: true,
    confettiColors: ['#FBBF24', '#FDE68A', '#FB7185', '#60A5FA', '#FFFFFF'],
  },
};

export const VIBE_OPTIONS: {
  id: WishVibe;
  label: string;
  description: string;
}[] = [
  { id: 'heartfelt', label: 'Heartfelt', description: 'Warm, sincere, and personal' },
  { id: 'funny', label: 'Funny', description: 'Playful banter and good-natured teasing' },
  { id: 'short', label: 'Short', description: 'Punchy, crisp, and memorable' },
  { id: 'poetic', label: 'Poetic', description: 'Lyrical, reflective, and uplifting' },
];

export const RELATIONSHIP_OPTIONS: RelationshipType[] = [
  'Friend',
  'Partner',
  'Sibling',
  'Parent',
  'Colleague',
  'Mentor',
];

export const CELEBRATION_OPTIONS: {
  id: CelebrationMode;
  label: string;
}[] = [
  { id: 'confetti', label: 'Confetti Burst' },
  { id: 'balloons', label: 'Pop Balloons' },
  { id: 'cake', label: 'Blow Out Candle' },
];

export const DEFAULT_BOUQUET_NOTES = [
  'Forever grateful for you',
  'You make every day brighter',
  'You are my sunshine',
  'Happy Birthday!',
  'So lucky to have you in my life',
  'Always my favorite person',
];

export const DEFAULT_BOARD: BirthdayBoard = {
  id: 'maya-28',
  recipientName: 'Maya',
  age: '28',
  relationship: 'Friend',
  vibe: 'heartfelt',
  memories:
    'Midnight taco runs after ceramics class, getting rained out at the outdoor jazz festival and laughing the entire walk home, always ordering two desserts for the table.',
  senderName: 'Sam & the Crew',
  theme: 'blush',
  celebration: 'cake',
  passcodeEnabled: true,
  passcode: '3105',
  passcodeHint: 'Try 3105 to unlock',
  balloonWords: ['You', 'are', 'so', 'special'],
  bouquetNotes: [
    'Forever grateful for you',
    'You make every room brighter',
    'You are pure sunshine',
    'Happy 28th, Maya!',
    'Lucky to share life with you',
    'Two desserts forever',
  ],
  headline: 'Twenty-Eight Years of Brightening Every Room',
  message:
    'Happy 28th birthday, Maya!\n\nSome friendships feel effortless from day one, and ours has been built on the best kind of everyday magic—midnight taco runs after ceramics class, getting soaked at the jazz festival and laughing the whole walk home, and never once regretting ordering two desserts for the table.\n\nThank you for showing up with warmth, humor, and genuine care. No matter where this year takes you, know you are endlessly celebrated.',
  toastQuote: 'To two desserts for the table and zero regrets.',
  createdAt: '2026-11-16T08:00:00.000Z',
  updatedAt: '2026-11-16T08:00:00.000Z',
  notes: [
    {
      id: 'note-1',
      authorName: 'Elena Vance',
      relationship: 'College Roommate',
      message:
        'Still thinking about how you convinced us to adopt a sourdough starter during finals week. Wishing you the happiest 28th!',
      memory: 'The 2 AM focaccia rescue mission',
      createdAt: '2026-11-16T08:15:00.000Z',
      cheers: 4,
    },
    {
      id: 'note-2',
      authorName: 'Devon Park',
      relationship: 'Studio Partner',
      message:
        'Nobody centers a stoneware bowl—or a chaotic Monday morning—quite like you. Save a slice of cake for the studio!',
      memory: 'Kiln unloading Fridays',
      createdAt: '2026-11-16T08:42:00.000Z',
      cheers: 3,
    },
    {
      id: 'note-3',
      authorName: 'Priya Nair',
      relationship: 'Friend',
      message:
        'May your year ahead be packed with sunny patios, spontaneous road trips, and coffee that never goes cold.',
      createdAt: '2026-11-16T09:10:00.000Z',
      cheers: 5,
    },
  ],
};
