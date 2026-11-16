/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Check,
  Copy,
  Download,
  Eye,
  Plus,
  Printer,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { triggerConfettiBurst } from './components/CelebrationOverlay';
import { GroupWishesWall } from './components/GroupWishesWall';
import { ShareQrModal } from './components/ShareQrModal';
import {
  SURPRISE_STEP_LABELS,
  SurpriseExperience,
  type SurpriseStep,
} from './components/SurpriseExperience';
import { WishCreatorForm } from './components/WishCreatorForm';
import { CARD_THEMES, DEFAULT_BOARD } from './constants/themes';
import type { BirthdayBoard, WishFormInput } from './types/birthday';
import { downloadCardAsPng } from './utils/exportCard';

function formFromBoard(board: BirthdayBoard): WishFormInput {
  return {
    recipientName: board.recipientName,
    age: board.age,
    relationship: board.relationship,
    vibe: board.vibe,
    memories: board.memories,
    senderName: board.senderName,
    theme: board.theme,
    celebration: board.celebration,
    passcodeEnabled: board.passcodeEnabled,
    passcode: board.passcode,
    passcodeHint: board.passcodeHint,
    balloonWords: board.balloonWords,
    bouquetNotes: board.bouquetNotes,
  };
}

export default function App() {
  const [board, setBoard] = useState<BirthdayBoard>(DEFAULT_BOARD);
  const [form, setForm] = useState<WishFormInput>(() =>
    formFromBoard(DEFAULT_BOARD)
  );
  const [isPlayerMode, setIsPlayerMode] = useState(false);
  const [openedFromSharedLink, setOpenedFromSharedLink] = useState(false);
  const [studioStep, setStudioStep] = useState<SurpriseStep>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get('board');
    const modeParam = params.get('mode');
    const targetId = requestedId || 'maya-28';

    let active = true;
    async function loadInitialBoard() {
      try {
        const res = await fetch(`/api/boards/${encodeURIComponent(targetId)}`);
        if (!res.ok) {
          if (requestedId) {
            setBoardError(
              'We could not find that shared birthday website, so we loaded a sample surprise.'
            );
          }
          return;
        }
        const loaded = (await res.json()) as BirthdayBoard;
        if (!active) return;
        setBoard(loaded);
        setForm(formFromBoard(loaded));
        if (requestedId && (requestedId !== 'maya-28' || modeParam === 'play')) {
          setIsPlayerMode(true);
          setOpenedFromSharedLink(true);
          setStudioStep(loaded.passcodeEnabled ? 0 : 1);
        }
      } catch {
        // Keep DEFAULT_BOARD fallback
      } finally {
        if (active) setIsLoadingBoard(false);
      }
    }

    loadInitialBoard();
    return () => {
      active = false;
    };
  }, []);

  const persistBoardChanges = useCallback(
    async (
      nextBoard: BirthdayBoard,
      forceNewIfSeed = false
    ): Promise<BirthdayBoard> => {
      const shouldCreateNew = forceNewIfSeed && nextBoard.id === 'maya-28';
      const endpoint = shouldCreateNew
        ? '/api/boards'
        : `/api/boards/${encodeURIComponent(nextBoard.id)}`;
      const method = shouldCreateNew ? 'POST' : 'PATCH';

      const payload = shouldCreateNew
        ? {
            ...nextBoard,
            id: undefined,
            notes: [],
          }
        : nextBoard;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const fallbackRes = await fetch('/api/boards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextBoard, id: undefined }),
        });
        if (!fallbackRes.ok) {
          throw new Error('Could not save birthday website.');
        }
        const created = (await fallbackRes.json()) as BirthdayBoard;
        window.history.replaceState(
          null,
          '',
          `/?board=${encodeURIComponent(created.id)}`
        );
        return created;
      }

      const saved = (await res.json()) as BirthdayBoard;
      if (shouldCreateNew || saved.id !== nextBoard.id) {
        window.history.replaceState(
          null,
          '',
          `/?board=${encodeURIComponent(saved.id)}`
        );
      }
      return saved;
    },
    []
  );

  const handleFormChange = (nextForm: WishFormInput) => {
    setForm(nextForm);
    setBoard((prev) => ({
      ...prev,
      ...nextForm,
    }));
  };

  const handleLetterChange = (headline: string, message: string) => {
    setBoard((prev) => ({
      ...prev,
      headline,
      message,
    }));
  };

  const handleGenerateWish = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    setBoardError(null);

    try {
      const res = await fetch('/api/wishes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not generate birthday wish.');
      }

      const isSameRecipientAsSeed =
        board.id === 'maya-28' &&
        form.recipientName.trim().toLowerCase() === 'maya';

      const candidateBoard: BirthdayBoard = {
        ...board,
        ...form,
        headline: data.headline,
        message: data.message,
        toastQuote: data.toastQuote,
        bouquetNotes:
          Array.isArray(data.bouquetNotes) && data.bouquetNotes.length > 0
            ? data.bouquetNotes
            : board.bouquetNotes,
        notes: isSameRecipientAsSeed
          ? board.notes
          : board.id === 'maya-28'
          ? []
          : board.notes,
      };

      const saved = await persistBoardChanges(
        candidateBoard,
        board.id === 'maya-28' && !isSameRecipientAsSeed
      );
      setBoard(saved);
      setForm(formFromBoard(saved));
      setStudioStep(5); // Jump live stage to "Message From My Heart" so user sees the fresh AI letter

      const theme = CARD_THEMES[saved.theme] ?? CARD_THEMES.blush;
      triggerConfettiBurst(theme.confettiColors);
    } catch (err) {
      setGenerateError(
        err instanceof Error
          ? err.message
          : 'Unable to generate wish right now. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveManual = async () => {
    setIsSaving(true);
    setGenerateError(null);
    setBoardError(null);
    try {
      const isSameRecipientAsSeed =
        board.id === 'maya-28' &&
        form.recipientName.trim().toLowerCase() === 'maya';
      const saved = await persistBoardChanges(
        { ...board, ...form },
        board.id === 'maya-28' && !isSameRecipientAsSeed
      );
      setBoard(saved);
      setForm(formFromBoard(saved));
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2200);
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : 'Unable to save changes right now.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenShareModal = async () => {
    try {
      const saved = await persistBoardChanges(
        { ...board, ...form },
        board.id === 'maya-28' &&
          form.recipientName.trim().toLowerCase() !== 'maya'
      );
      setBoard(saved);
      const url = `${window.location.origin}/?board=${encodeURIComponent(
        saved.id
      )}&mode=play`;
      setShareUrl(url);
    } catch {
      setShareUrl(
        `${window.location.origin}/?board=${encodeURIComponent(
          board.id
        )}&mode=play`
      );
    }
    setShareModalOpen(true);
  };

  const handleCopyMessage = async () => {
    const formatted = `${board.headline}\n\nDear ${board.recipientName},\n\n${board.message}\n\nWith love and best wishes, ${board.senderName}`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2200);
    } catch {
      // Clipboard blocked
    }
  };

  const handleDownloadPng = async () => {
    setIsDownloadingPng(true);
    try {
      await downloadCardAsPng(board);
    } finally {
      setIsDownloadingPng(false);
    }
  };

  const handleAddGroupNote = async (payload: {
    authorName: string;
    relationship: string;
    message: string;
    memory?: string;
  }) => {
    let targetBoardId = board.id;
    if (
      board.id === 'maya-28' &&
      form.recipientName.trim().toLowerCase() !== 'maya'
    ) {
      const created = await persistBoardChanges({ ...board, ...form }, true);
      setBoard(created);
      targetBoardId = created.id;
    }

    const res = await fetch(
      `/api/boards/${encodeURIComponent(targetBoardId)}/notes`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Could not post birthday note.');
    }
    setBoard(data.board as BirthdayBoard);
    const theme = CARD_THEMES[board.theme] ?? CARD_THEMES.blush;
    triggerConfettiBurst(theme.confettiColors);
  };

  const handleQuickThankYou = async (authorName: string, message: string) => {
    await handleAddGroupNote({
      authorName,
      relationship: 'Birthday Star',
      message,
    });
  };

  const handleCheerNote = async (noteId: string) => {
    setBoard((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === noteId ? { ...n, cheers: n.cheers + 1 } : n
      ),
    }));

    try {
      await fetch(
        `/api/boards/${encodeURIComponent(board.id)}/notes/${encodeURIComponent(
          noteId
        )}/cheer`,
        { method: 'POST' }
      );
    } catch {
      // Optimistic state stays intact
    }
  };

  const handleStartNewCard = async () => {
    setIsPlayerMode(false);
    setOpenedFromSharedLink(false);
    setGenerateError(null);
    setBoardError(null);
    setStudioStep(0);

    const freshInput: WishFormInput = {
      recipientName: '',
      age: '',
      relationship: 'Friend',
      vibe: 'heartfelt',
      memories: '',
      senderName: '',
      theme: 'blush',
      celebration: 'cake',
      passcodeEnabled: true,
      passcode: '3105',
      passcodeHint: 'Try 3105 to unlock',
      balloonWords: ['You', 'are', 'so', 'special'],
      bouquetNotes: [
        'Forever grateful for you',
        'You make every day brighter',
        'You are my sunshine',
        'Happy Birthday!',
        'So lucky to have you',
        'Always my favorite person',
      ],
    };

    setForm(freshInput);
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...freshInput,
          recipientName: 'Your Friend',
          senderName: 'Your Friends',
          headline: 'Happy Birthday!',
          message:
            'Fill out the wish builder on the left to craft a custom heartfelt birthday letter and shareable surprise link.',
          toastQuote: 'Here is to a brilliant year ahead.',
          notes: [],
        }),
      });
      if (res.ok) {
        const created = (await res.json()) as BirthdayBoard;
        setBoard({
          ...created,
          recipientName: 'Your Friend',
        });
        window.history.replaceState(
          null,
          '',
          `/?board=${encodeURIComponent(created.id)}`
        );
        return;
      }
    } catch {
      // Fallback
    }

    setBoard({
      ...DEFAULT_BOARD,
      id: `local-${Date.now()}`,
      ...freshInput,
      recipientName: 'Your Friend',
      senderName: 'Your Friends',
      headline: 'Happy Birthday!',
      message:
        'Fill out the wish builder on the left to craft a custom heartfelt birthday letter and shareable surprise link.',
      toastQuote: 'Here is to a brilliant year ahead.',
      notes: [],
    });
  };

  const activeTheme = CARD_THEMES[board.theme] ?? CARD_THEMES.blush;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900">
      {/* 3-Zone Top Bar */}
      <header className="no-print sticky top-0 z-30 bg-[#FAF9F6]/92 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="/"
            className="font-display text-xl font-semibold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
          >
            Wishcraft
          </a>

          {!isPlayerMode ? (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
              <a
                href="#creator-studio"
                className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Surprise Builder
              </a>
              <a
                href="#surprise-stage"
                className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Interactive Flow
              </a>
              <a
                href="#group-wall"
                className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Group Wall
              </a>
              <a
                href="#share-export"
                className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Share &amp; QR
              </a>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
              <a
                href="#surprise-stage"
                className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Birthday Experience
              </a>
              <a
                href="#group-wall"
                className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Group Wishes ({board.notes.length})
              </a>
            </nav>
          )}

          <div className="shrink-0">
            {isPlayerMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsPlayerMode(false);
                  if (openedFromSharedLink) {
                    setOpenedFromSharedLink(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {openedFromSharedLink ? 'Create Your Own' : 'Back to Builder'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartNewCard}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                New Surprise
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 space-y-12">
        {!isPlayerMode && (
          <section className="no-print max-w-2xl space-y-2">
            <p className="text-xs font-semibold text-rose-600">
              Interactive Birthday Website · Passcode, Balloons, Candle &amp; QR
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.1] text-balance">
              Create an unforgettable birthday surprise
            </h1>
            <p className="text-base text-stone-600 leading-relaxed">
              Build a 7-step interactive birthday experience with a 4-digit secret lock, poppable balloons, mic-powered candle cake, rose bouquet notes, AI letter, and shared group wall.
            </p>
          </section>
        )}

        {boardError && (
          <div className="no-print rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
            {boardError}
          </div>
        )}

        {isLoadingBoard ? (
          <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-[580px] rounded-2xl bg-stone-200/60 animate-pulse" />
            <div className="lg:col-span-7 h-[580px] rounded-2xl bg-stone-200/60 animate-pulse" />
          </div>
        ) : (
          <section
            id="creator-studio"
            className="no-print grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {!isPlayerMode && (
              <div className="lg:col-span-5">
                <WishCreatorForm
                  form={form}
                  headline={board.headline}
                  message={board.message}
                  onChange={handleFormChange}
                  onLetterChange={handleLetterChange}
                  onGenerate={handleGenerateWish}
                  onSaveManual={handleSaveManual}
                  isGenerating={isGenerating}
                  isSaving={isSaving}
                  savedNotice={savedNotice}
                  error={generateError}
                />
              </div>
            )}

            <div
              id="surprise-stage"
              className={
                isPlayerMode
                  ? 'lg:col-span-8 lg:col-start-3 space-y-4'
                  : 'lg:col-span-7 space-y-4'
              }
            >
              {/* Step Switcher Bar in Studio Mode so creator can test any scene */}
              {!isPlayerMode && (
                <div className="bg-white border border-stone-200 rounded-2xl p-2 flex items-center gap-1 overflow-x-auto">
                  {SURPRISE_STEP_LABELS.map((item) => {
                    const active = studioStep === item.step;
                    return (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => setStudioStep(item.step)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-rose-600 text-white'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                        }`}
                      >
                        {item.step + 1}. {item.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <SurpriseExperience
                board={board}
                isFullscreen={isPlayerMode}
                onToggleFullscreen={() => {
                  const next = !isPlayerMode;
                  setIsPlayerMode(next);
                  if (next) {
                    setStudioStep(board.passcodeEnabled ? 0 : 1);
                  }
                }}
                controlledStep={studioStep}
                onStepChange={setStudioStep}
                onJumpToWall={() => {
                  document
                    .getElementById('group-wall')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                onCreateOwn={handleStartNewCard}
                onQuickThankYou={handleQuickThankYou}
              />

              {/* Easy Sharing, QR Code & Export Bar */}
              <div
                id="share-export"
                className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenShareModal}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Share Link &amp; QR Code
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Letter Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Letter
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !isPlayerMode;
                      setIsPlayerMode(next);
                      if (next) setStudioStep(board.passcodeEnabled ? 0 : 1);
                    }}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isPlayerMode ? 'Builder Mode' : 'Recipient Preview'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isDownloadingPng}
                    onClick={handleDownloadPng}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isDownloadingPng ? 'Exporting...' : 'Download PNG'}
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Card
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Print-only clean stationery letter card */}
        <article
          className="hidden print:block print-only-card rounded-2xl p-10 space-y-6"
          style={{
            backgroundColor: activeTheme.surfaceBg,
            color: activeTheme.textColor,
          }}
        >
          <p className="text-sm font-semibold">
            Happy Birthday, {board.recipientName}
            {board.age ? ` · Age ${board.age}` : ''}
          </p>
          <h1 className="font-display text-3xl font-semibold">
            {board.headline}
          </h1>
          <p className="text-base leading-relaxed whitespace-pre-line">
            {board.message}
          </p>
          {board.toastQuote && (
            <p className="font-display italic text-base">
              “{board.toastQuote}”
            </p>
          )}
          <p className="text-sm font-semibold">
            With love and best wishes, {board.senderName}
          </p>
        </article>

        {/* Group Wishes Wall */}
        <GroupWishesWall
          recipientName={board.recipientName || 'Your Friend'}
          notes={board.notes}
          onAddNote={handleAddGroupNote}
          onCheerNote={handleCheerNote}
        />
      </main>

      <footer className="no-print border-t border-stone-200/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>Wishcraft — Personalized Birthday Websites, QR Cards &amp; Group Wishes</span>
          <span>Passcode Reveal · Mic Candle · Rose Bouquet · Group Wall</span>
        </div>
      </footer>

      <ShareQrModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareUrl={shareUrl}
        board={board}
      />
    </div>
  );
}
