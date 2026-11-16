import 'dotenv/config';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { GoogleGenAI, Type } from '@google/genai';

interface GroupNoteRecord {
  id: string;
  authorName: string;
  relationship: string;
  message: string;
  memory?: string;
  createdAt: string;
  cheers: number;
}

interface BoardRecord {
  id: string;
  recipientName: string;
  age: string;
  relationship: string;
  vibe: string;
  memories: string;
  senderName: string;
  theme: string;
  celebration: string;
  passcodeEnabled: boolean;
  passcode: string;
  passcodeHint: string;
  balloonWords: [string, string, string, string];
  bouquetNotes: string[];
  headline: string;
  message: string;
  toastQuote: string;
  notes: GroupNoteRecord[];
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'boards.json');

const SEED_BOARD: BoardRecord = {
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

function normalizeBoard(raw: Partial<BoardRecord> & { id: string }): BoardRecord {
  const name = raw.recipientName || 'Friend';
  return {
    ...SEED_BOARD,
    ...raw,
    passcodeEnabled:
      typeof raw.passcodeEnabled === 'boolean' ? raw.passcodeEnabled : true,
    passcode:
      typeof raw.passcode === 'string' && /^\d{4}$/.test(raw.passcode)
        ? raw.passcode
        : '3105',
    passcodeHint:
      typeof raw.passcodeHint === 'string'
        ? raw.passcodeHint
        : 'Try 3105 to unlock',
    balloonWords:
      Array.isArray(raw.balloonWords) && raw.balloonWords.length === 4
        ? [
            String(raw.balloonWords[0] || 'You'),
            String(raw.balloonWords[1] || 'are'),
            String(raw.balloonWords[2] || 'so'),
            String(raw.balloonWords[3] || 'special'),
          ]
        : ['You', 'are', 'so', 'special'],
    bouquetNotes:
      Array.isArray(raw.bouquetNotes) && raw.bouquetNotes.length > 0
        ? raw.bouquetNotes.map(String).slice(0, 6)
        : [
            'Forever grateful for you',
            'You make my world brighter',
            'You are my sunshine',
            `Happy Birthday, ${name}!`,
            'So lucky to have you',
            'Always my favorite person',
          ],
    notes: Array.isArray(raw.notes) ? raw.notes : [],
  };
}

let writeLock: Promise<void> = Promise.resolve();

async function ensureStore(): Promise<Record<string, BoardRecord>> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, BoardRecord>;
    if (!parsed['maya-28']) {
      parsed['maya-28'] = SEED_BOARD;
    } else {
      parsed['maya-28'] = normalizeBoard(parsed['maya-28']);
    }
    return parsed;
  } catch {
    const initial: Record<string, BoardRecord> = {
      'maya-28': SEED_BOARD,
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

async function withStoreUpdate<T>(
  updater: (store: Record<string, BoardRecord>) => T
): Promise<T> {
  let result!: T;
  writeLock = writeLock.then(async () => {
    const store = await ensureStore();
    result = updater(store);
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  });
  await writeLock;
  return result;
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function slugifyBoardId(name: string): string {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${clean || 'birthday'}-${suffix}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/wishes/generate', async (req, res) => {
    try {
      const {
        recipientName,
        age,
        relationship,
        vibe,
        memories,
        senderName,
      } = req.body ?? {};

      if (!recipientName || typeof recipientName !== 'string' || !recipientName.trim()) {
        res.status(400).json({ error: 'Please enter the recipient’s name.' });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        res.status(503).json({
          error:
            'Gemini API key is not configured yet. Please check Settings > Secrets.',
        });
        return;
      }

      const safeName = recipientName.trim().slice(0, 80);
      const safeAge = typeof age === 'string' ? age.trim().slice(0, 12) : '';
      const safeRelationship =
        typeof relationship === 'string' && relationship.trim()
          ? relationship.trim().slice(0, 40)
          : 'Friend';
      const safeVibe =
        typeof vibe === 'string' && vibe.trim() ? vibe.trim().slice(0, 30) : 'heartfelt';
      const safeMemories =
        typeof memories === 'string' ? memories.trim().slice(0, 600) : '';
      const safeSender =
        typeof senderName === 'string' && senderName.trim()
          ? senderName.trim().slice(0, 60)
          : 'Someone who adores you';

      const vibeGuidance: Record<string, string> = {
        funny:
          'Playful, witty, warm-hearted teasing without being mean. Punchy comedic timing.',
        heartfelt:
          'Warm, sincere, deeply appreciative, and emotionally resonant without sounding cliché.',
        short:
          'Crisp, punchy, 2–3 sentences total. Every word earns its spot.',
        poetic:
          'Lyrical, vivid imagery, gentle rhythm, celebratory and uplifting.',
      };

      const prompt = [
        `Write a custom birthday surprise letter & mini bouquet notes for ${safeName}.`,
        safeAge ? `They are turning ${safeAge}.` : 'No specific age mentioned.',
        `Relationship from sender (${safeSender}) to ${safeName}: ${safeRelationship}.`,
        `Requested tone/vibe: ${safeVibe} — ${vibeGuidance[safeVibe] || vibeGuidance.heartfelt}`,
        safeMemories
          ? `Weave in these real personal memories or inside jokes naturally: ${safeMemories}`
          : 'No specific inside jokes provided, so keep the imagery vivid and personal.',
        'Requirements:',
        '- Return JSON with headline, message, toastQuote, and bouquetNotes.',
        '- headline: 4 to 8 words, joyful greeting card cover title (no emojis).',
        `- message: The main birthday letter addressed to ${safeName} (separate short paragraphs with \\n\\n for readability). Do not include "Dear..." or signature at the end—just the letter body (${safeVibe === 'short' ? '35–55 words' : '75–120 words'}).`,
        '- toastQuote: A 5–12 word celebratory postscript or toast line.',
        '- bouquetNotes: An array of exactly 6 short, sweet 3–6 word compliment notes to float around a rose bouquet.',
        '- Avoid generic clichés like "wishing you a day filled with joy and laughter" or "another trip around the sun".',
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a celebrated greeting card writer crafting original, human, memorable birthday letters and micro-compliments. Avoid overused Hallmark clichés.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: {
                type: Type.STRING,
                description: 'Short, expressive card headline (4-8 words).',
              },
              message: {
                type: Type.STRING,
                description: 'The personalized birthday letter body.',
              },
              toastQuote: {
                type: Type.STRING,
                description: 'A crisp 5-12 word toast or postscript quote.',
              },
              bouquetNotes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 6 short 3-6 word compliment notes.',
              },
            },
            required: ['headline', 'message', 'toastQuote', 'bouquetNotes'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      const parsed = JSON.parse(rawText) as {
        headline?: string;
        message?: string;
        toastQuote?: string;
        bouquetNotes?: string[];
      };

      if (!parsed.headline || !parsed.message) {
        res.status(502).json({
          error: 'Could not parse generated wish. Please try generating again.',
        });
        return;
      }

      const bouquetNotes =
        Array.isArray(parsed.bouquetNotes) && parsed.bouquetNotes.length > 0
          ? parsed.bouquetNotes.slice(0, 6).map((s) => String(s).trim())
          : [
              'Forever grateful for you',
              'You make every room brighter',
              'You are pure sunshine',
              `Happy Birthday, ${safeName}!`,
              'So lucky to have you',
              'Always my favorite person',
            ];

      res.json({
        headline: parsed.headline.trim(),
        message: parsed.message.trim(),
        toastQuote: (parsed.toastQuote ?? `Cheers to you, ${safeName}!`).trim(),
        bouquetNotes,
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('Error generating birthday wish:', errMsg);
      if (errMsg.includes('403') || errMsg.includes('API_KEY_INVALID')) {
        res.status(403).json({
          error:
            'Gemini API permission error. Please verify your API key in Settings > Secrets.',
        });
        return;
      }
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        res.status(429).json({
          error: 'Rate limit reached momentarily. Please wait a moment and try again.',
        });
        return;
      }
      res.status(500).json({
        error: 'Unable to generate wish right now. Please try again.',
      });
    }
  });

  app.get('/api/boards/:id', async (req, res) => {
    try {
      const store = await ensureStore();
      const board = store[req.params.id];
      if (!board) {
        res.status(404).json({ error: 'Birthday board not found.' });
        return;
      }
      res.json(normalizeBoard(board));
    } catch (error) {
      console.error('GET /api/boards/:id failed:', error);
      res.status(500).json({ error: 'Failed to load birthday board.' });
    }
  });

  app.post('/api/boards', async (req, res) => {
    try {
      const body = req.body ?? {};
      const recipientName =
        typeof body.recipientName === 'string' && body.recipientName.trim()
          ? body.recipientName.trim().slice(0, 80)
          : 'Friend';
      const now = new Date().toISOString();
      const existingId =
        typeof body.id === 'string' &&
        body.id !== 'maya-28' &&
        /^[a-z0-9-]+$/.test(body.id)
          ? body.id
          : null;

      const board = await withStoreUpdate((store) => {
        const id = existingId || slugifyBoardId(recipientName);
        const prev = store[id];
        const next = normalizeBoard({
          id,
          recipientName,
          age: typeof body.age === 'string' ? body.age.trim().slice(0, 12) : '',
          relationship:
            typeof body.relationship === 'string'
              ? body.relationship.slice(0, 40)
              : 'Friend',
          vibe: typeof body.vibe === 'string' ? body.vibe.slice(0, 30) : 'heartfelt',
          memories:
            typeof body.memories === 'string' ? body.memories.slice(0, 800) : '',
          senderName:
            typeof body.senderName === 'string' && body.senderName.trim()
              ? body.senderName.trim().slice(0, 60)
              : 'Your Friends',
          theme: typeof body.theme === 'string' ? body.theme : 'blush',
          celebration:
            typeof body.celebration === 'string' ? body.celebration : 'cake',
          passcodeEnabled:
            typeof body.passcodeEnabled === 'boolean' ? body.passcodeEnabled : true,
          passcode:
            typeof body.passcode === 'string' && /^\d{4}$/.test(body.passcode)
              ? body.passcode
              : '3105',
          passcodeHint:
            typeof body.passcodeHint === 'string'
              ? body.passcodeHint.slice(0, 80)
              : 'Try 3105 to unlock',
          balloonWords:
            Array.isArray(body.balloonWords) && body.balloonWords.length === 4
              ? [
                  String(body.balloonWords[0] || 'You').slice(0, 20),
                  String(body.balloonWords[1] || 'are').slice(0, 20),
                  String(body.balloonWords[2] || 'so').slice(0, 20),
                  String(body.balloonWords[3] || 'special').slice(0, 20),
                ]
              : ['You', 'are', 'so', 'special'],
          bouquetNotes: Array.isArray(body.bouquetNotes)
            ? body.bouquetNotes.slice(0, 6).map((s: unknown) => String(s).slice(0, 80))
            : undefined,
          headline:
            typeof body.headline === 'string' && body.headline.trim()
              ? body.headline.trim().slice(0, 140)
              : `Happy Birthday, ${recipientName}!`,
          message:
            typeof body.message === 'string' && body.message.trim()
              ? body.message.trim().slice(0, 2000)
              : `Wishing you the brightest year ahead, ${recipientName}!`,
          toastQuote:
            typeof body.toastQuote === 'string'
              ? body.toastQuote.trim().slice(0, 160)
              : `Cheers to ${recipientName}!`,
          notes: Array.isArray(body.notes)
            ? body.notes.slice(0, 100)
            : prev?.notes ?? [],
          createdAt: prev?.createdAt ?? now,
          updatedAt: now,
        });
        store[id] = next;
        return next;
      });

      res.status(201).json(board);
    } catch (error) {
      console.error('POST /api/boards failed:', error);
      res.status(500).json({ error: 'Failed to save birthday board.' });
    }
  });

  app.patch('/api/boards/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body ?? {};
      const updated = await withStoreUpdate((store) => {
        const existing = store[id];
        if (!existing) return null;
        const next = normalizeBoard({
          ...existing,
          recipientName:
            typeof body.recipientName === 'string' && body.recipientName.trim()
              ? body.recipientName.trim().slice(0, 80)
              : existing.recipientName,
          age:
            typeof body.age === 'string'
              ? body.age.trim().slice(0, 12)
              : existing.age,
          relationship:
            typeof body.relationship === 'string'
              ? body.relationship.slice(0, 40)
              : existing.relationship,
          vibe:
            typeof body.vibe === 'string'
              ? body.vibe.slice(0, 30)
              : existing.vibe,
          memories:
            typeof body.memories === 'string'
              ? body.memories.slice(0, 800)
              : existing.memories,
          senderName:
            typeof body.senderName === 'string' && body.senderName.trim()
              ? body.senderName.trim().slice(0, 60)
              : existing.senderName,
          theme: typeof body.theme === 'string' ? body.theme : existing.theme,
          celebration:
            typeof body.celebration === 'string'
              ? body.celebration
              : existing.celebration,
          passcodeEnabled:
            typeof body.passcodeEnabled === 'boolean'
              ? body.passcodeEnabled
              : existing.passcodeEnabled,
          passcode:
            typeof body.passcode === 'string' && /^\d{4}$/.test(body.passcode)
              ? body.passcode
              : existing.passcode,
          passcodeHint:
            typeof body.passcodeHint === 'string'
              ? body.passcodeHint.slice(0, 80)
              : existing.passcodeHint,
          balloonWords:
            Array.isArray(body.balloonWords) && body.balloonWords.length === 4
              ? [
                  String(body.balloonWords[0] || 'You').slice(0, 20),
                  String(body.balloonWords[1] || 'are').slice(0, 20),
                  String(body.balloonWords[2] || 'so').slice(0, 20),
                  String(body.balloonWords[3] || 'special').slice(0, 20),
                ]
              : existing.balloonWords,
          bouquetNotes: Array.isArray(body.bouquetNotes)
            ? body.bouquetNotes.slice(0, 6).map((s: unknown) => String(s).slice(0, 80))
            : existing.bouquetNotes,
          headline:
            typeof body.headline === 'string' && body.headline.trim()
              ? body.headline.trim().slice(0, 140)
              : existing.headline,
          message:
            typeof body.message === 'string' && body.message.trim()
              ? body.message.trim().slice(0, 2000)
              : existing.message,
          toastQuote:
            typeof body.toastQuote === 'string'
              ? body.toastQuote.trim().slice(0, 160)
              : existing.toastQuote,
          updatedAt: new Date().toISOString(),
        });
        store[id] = next;
        return next;
      });

      if (!updated) {
        res.status(404).json({ error: 'Birthday board not found.' });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error('PATCH /api/boards/:id failed:', error);
      res.status(500).json({ error: 'Failed to update birthday board.' });
    }
  });

  app.post('/api/boards/:id/notes', async (req, res) => {
    try {
      const id = req.params.id;
      const { authorName, relationship, message, memory } = req.body ?? {};
      if (!authorName || typeof authorName !== 'string' || !authorName.trim()) {
        res.status(400).json({ error: 'Please add your name.' });
        return;
      }
      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Please write a birthday note.' });
        return;
      }

      const newNote: GroupNoteRecord = {
        id: `note-${crypto.randomBytes(4).toString('hex')}`,
        authorName: authorName.trim().slice(0, 60),
        relationship:
          typeof relationship === 'string' && relationship.trim()
            ? relationship.trim().slice(0, 40)
            : 'Friend',
        message: message.trim().slice(0, 500),
        memory:
          typeof memory === 'string' && memory.trim()
            ? memory.trim().slice(0, 160)
            : undefined,
        createdAt: new Date().toISOString(),
        cheers: 1,
      };

      const updated = await withStoreUpdate((store) => {
        const board = store[id];
        if (!board) return null;
        board.notes = [newNote, ...board.notes].slice(0, 100);
        board.updatedAt = new Date().toISOString();
        return normalizeBoard(board);
      });

      if (!updated) {
        res.status(404).json({ error: 'Birthday board not found.' });
        return;
      }
      res.status(201).json({ note: newNote, board: updated });
    } catch (error) {
      console.error('POST /api/boards/:id/notes failed:', error);
      res.status(500).json({ error: 'Failed to add note to board.' });
    }
  });

  app.post('/api/boards/:id/notes/:noteId/cheer', async (req, res) => {
    try {
      const { id, noteId } = req.params;
      const updatedNote = await withStoreUpdate((store) => {
        const board = store[id];
        if (!board) return null;
        const note = board.notes.find((n) => n.id === noteId);
        if (!note) return null;
        note.cheers += 1;
        board.updatedAt = new Date().toISOString();
        return note;
      });

      if (!updatedNote) {
        res.status(404).json({ error: 'Note not found.' });
        return;
      }
      res.json(updatedNote);
    } catch (error) {
      console.error('POST cheer failed:', error);
      res.status(500).json({ error: 'Failed to react to note.' });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Wishcraft server listening on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
