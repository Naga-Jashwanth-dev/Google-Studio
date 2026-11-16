export type WishVibe = 'funny' | 'heartfelt' | 'short' | 'poetic';

export type RelationshipType =
  | 'Friend'
  | 'Partner'
  | 'Sibling'
  | 'Parent'
  | 'Colleague'
  | 'Mentor';

export type CardThemeId = 'blush' | 'confetti' | 'cake' | 'botanical' | 'celestial';

export type CelebrationMode = 'confetti' | 'balloons' | 'cake';

export interface WishFormInput {
  recipientName: string;
  age: string;
  relationship: RelationshipType;
  vibe: WishVibe;
  memories: string;
  senderName: string;
  theme: CardThemeId;
  celebration: CelebrationMode;
  passcodeEnabled: boolean;
  passcode: string;
  passcodeHint: string;
  balloonWords: [string, string, string, string];
  bouquetNotes: string[];
}

export interface GeneratedWish {
  headline: string;
  message: string;
  toastQuote: string;
}

export interface GroupNote {
  id: string;
  authorName: string;
  relationship: string;
  message: string;
  memory?: string;
  createdAt: string;
  cheers: number;
}

export interface BirthdayBoard extends WishFormInput, GeneratedWish {
  id: string;
  notes: GroupNote[];
  createdAt: string;
  updatedAt: string;
}
