import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Delete,
  Edit3,
  Globe,
  Heart,
  Maximize2,
  MessageSquareHeart,
  Mic,
  Minimize2,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SURPRISE_COPY,
  SURPRISE_LANGUAGES,
  type SurpriseLang,
} from '../constants/surpriseTranslations';
import { CARD_THEMES } from '../constants/themes';
import type { BirthdayBoard } from '../types/birthday';
import { birthdayChime } from '../utils/birthdayAudio';
import {
  CelebrationDuoSvg,
  CuteKittensSvg,
  DreamyCloudsBackdrop,
  FinaleDuoSvg,
  FloatingHeartsBackdrop,
  GiftBoxSvg,
  GoldTrimEnvelopeSvg,
  HeartLockSvg,
  HeartTreeSvg,
  PastelBalloonSvg,
  RoseBouquetSvg,
  SingleCandleCakeSvg,
} from './SurpriseIllustrations';

export type SurpriseStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const SURPRISE_STEP_LABELS: { step: SurpriseStep; label: string }[] = [
  { step: 0, label: 'Passcode' },
  { step: 1, label: 'Welcome' },
  { step: 2, label: 'Balloons' },
  { step: 3, label: 'Candle' },
  { step: 4, label: 'Bouquet' },
  { step: 5, label: 'Letter' },
  { step: 6, label: 'Gift' },
];

interface SurpriseExperienceProps {
  board: BirthdayBoard;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  controlledStep?: SurpriseStep;
  onStepChange?: (step: SurpriseStep) => void;
  onJumpToWall?: () => void;
  onCreateOwn?: () => void;
  onQuickThankYou?: (authorName: string, message: string) => Promise<void>;
}

const BALLOON_PALETTE = [
  { color: '#93C5FD', highlight: '#EFF6FF', ribbon: '#3B82F6' },
  { color: '#F9A8D4', highlight: '#FDF2F8', ribbon: '#EC4899' },
  { color: '#6EE7B7', highlight: '#ECFDF5', ribbon: '#10B981' },
  { color: '#C4B5FD', highlight: '#F5F3FF', ribbon: '#8B5CF6' },
];

const NO_OFFSETS = [
  { x: 0, y: 0 },
  { x: 26, y: -14 },
  { x: -34, y: 12 },
  { x: 20, y: 16 },
];

export function SurpriseExperience({
  board,
  isFullscreen,
  onToggleFullscreen,
  controlledStep,
  onStepChange,
  onJumpToWall,
  onCreateOwn,
  onQuickThankYou,
}: SurpriseExperienceProps) {
  const theme = CARD_THEMES[board.theme] ?? CARD_THEMES.blush;
  const initialStep: SurpriseStep = board.passcodeEnabled ? 0 : 1;
  const [internalStep, setInternalStep] = useState<SurpriseStep>(initialStep);
  const step = controlledStep !== undefined ? controlledStep : internalStep;

  const setStep = useCallback(
    (next: SurpriseStep) => {
      setInternalStep(next);
      onStepChange?.(next);
    },
    [onStepChange]
  );

  // Language & Audio
  const [lang, setLang] = useState<SurpriseLang>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const copy = SURPRISE_COPY[lang];

  // Step 0: Passcode
  const [enteredDigits, setEnteredDigits] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Step 1: Welcome
  const [noClicks, setNoClicks] = useState(0);

  // Step 2: Balloons
  const [poppedBalloons, setPoppedBalloons] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const balloonAdvanceRef = useRef<number | null>(null);

  // Step 3: Candle & Mic
  const [candleBlown, setCandleBlown] = useState(false);
  const [micListening, setMicListening] = useState(false);
  const [micNote, setMicNote] = useState<string | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micRafRef = useRef<number | null>(null);
  const autoAdvanceRef = useRef<number | null>(null);

  // Step 4: Bouquet
  const [visibleBouquetCount, setVisibleBouquetCount] = useState(0);

  // Step 5: Letter
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);
  const letterScrollRef = useRef<HTMLDivElement | null>(null);

  // Step 6: Gift & Finale
  const [giftTaps, setGiftTaps] = useState(0);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [thankYouText, setThankYouText] = useState('');
  const [thankYouSent, setThankYouSent] = useState(false);

  const fireBurst = useCallback(
    (count = 55) => {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }
      confetti({
        particleCount: count,
        spread: 72,
        origin: { y: 0.58 },
        colors: theme.confettiColors,
      });
    },
    [theme.confettiColors]
  );

  const stopMicListener = useCallback(() => {
    if (micRafRef.current !== null) {
      cancelAnimationFrame(micRafRef.current);
      micRafRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setMicListening(false);
  }, []);

  useEffect(() => {
    return () => {
      stopMicListener();
      if (autoAdvanceRef.current) window.clearTimeout(autoAdvanceRef.current);
      if (balloonAdvanceRef.current) window.clearTimeout(balloonAdvanceRef.current);
      birthdayChime.stop();
    };
  }, [stopMicListener]);

  useEffect(() => {
    setLangMenuOpen(false);
    if (step !== 3) {
      stopMicListener();
      if (autoAdvanceRef.current) {
        window.clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    }
    if (step !== 2 && balloonAdvanceRef.current) {
      window.clearTimeout(balloonAdvanceRef.current);
      balloonAdvanceRef.current = null;
    }
  }, [step, stopMicListener]);

  // Staggered bouquet compliments when entering Step 4
  useEffect(() => {
    if (step !== 4) return;
    setVisibleBouquetCount(0);
    const total = board.bouquetNotes.length;
    const timers: number[] = [];
    for (let i = 1; i <= total; i += 1) {
      timers.push(
        window.setTimeout(() => {
          setVisibleBouquetCount(i);
        }, i * 260)
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step, board.bouquetNotes.length]);

  // Typewriter reveal for Step 5 letter + gentle scroll follow
  useEffect(() => {
    if (step !== 5 || !envelopeOpened) return;
    const fullLength = board.message.length;
    if (revealedChars >= fullLength) return;

    const timer = window.setTimeout(() => {
      setRevealedChars((c) => Math.min(fullLength, c + 3));
      if (letterScrollRef.current) {
        letterScrollRef.current.scrollTop = letterScrollRef.current.scrollHeight;
      }
    }, 22);
    return () => window.clearTimeout(timer);
  }, [step, envelopeOpened, revealedChars, board.message]);

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (passcodeError || enteredDigits.length >= 4) return;
      const next = enteredDigits + digit;
      setEnteredDigits(next);

      if (next.length === 4) {
        if (next === (board.passcode || '3105')) {
          fireBurst(70);
          window.setTimeout(() => {
            setEnteredDigits('');
            setStep(1);
          }, 320);
        } else {
          setPasscodeError(true);
          window.setTimeout(() => {
            setPasscodeError(false);
            setEnteredDigits('');
          }, 650);
        }
      }
    },
    [board.passcode, enteredDigits, fireBurst, passcodeError, setStep]
  );

  // Keyboard support for Step 0 passcode keypad
  useEffect(() => {
    if (step !== 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        setEnteredDigits((d) => d.slice(0, -1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [step, handleDigitPress]);

  const handleToggleMusic = () => {
    const playing = birthdayChime.toggle();
    setMusicOn(playing);
  };

  const handlePopBalloon = (idx: number) => {
    if (poppedBalloons[idx]) return;
    const next = poppedBalloons.map((v, i) => (i === idx ? true : v));
    setPoppedBalloons(next);
    fireBurst(35);
    if (next.every(Boolean)) {
      window.setTimeout(() => fireBurst(65), 220);
      if (isFullscreen) {
        balloonAdvanceRef.current = window.setTimeout(() => {
          setStep(3);
        }, 2300);
      }
    }
  };

  const completeCandleBlow = () => {
    if (candleBlown) return;
    stopMicListener();
    setCandleBlown(true);
    fireBurst(60);
    autoAdvanceRef.current = window.setTimeout(() => {
      setStep(4);
    }, 2400);
  };

  const handleStartMicListen = async () => {
    if (micListening) {
      stopMicListener();
      return;
    }
    setMicNote(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicListening(true);

      const monitor = () => {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) {
          sum += data[i];
        }
        const avg = sum / data.length;
        if (avg > 42) {
          void ctx.close();
          completeCandleBlow();
          return;
        }
        micRafRef.current = requestAnimationFrame(monitor);
      };
      micRafRef.current = requestAnimationFrame(monitor);
    } catch {
      setMicNote('Microphone unavailable here — use Tap to Blow Out below.');
    }
  };

  const handleTapGift = () => {
    const next = giftTaps + 1;
    setGiftTaps(next);
    fireBurst(next >= 3 ? 95 : 32);
  };

  const handleReplay = () => {
    setEnteredDigits('');
    setNoClicks(0);
    setPoppedBalloons([false, false, false, false]);
    setCandleBlown(false);
    setEnvelopeOpened(false);
    setRevealedChars(0);
    setGiftTaps(0);
    setStep(board.passcodeEnabled ? 0 : 1);
  };

  const handleSendThankYou = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thankYouText.trim() || !onQuickThankYou) return;
    await onQuickThankYou(board.recipientName, thankYouText.trim());
    setThankYouText('');
    setThankYouSent(true);
    fireBurst(40);
  };

  const poppedCount = poppedBalloons.filter(Boolean).length;
  const allBalloonsPopped = poppedCount === 4;
  const letterFinished = revealedChars >= board.message.length;
  const isDimmedCandleStage = step === 3 && candleBlown;
  const noOffset = NO_OFFSETS[noClicks % NO_OFFSETS.length];

  const bouquetNotes = board.bouquetNotes.slice(0, 6);

  return (
    <div
      className={`relative overflow-hidden transition-colors duration-700 ${
        isFullscreen
          ? 'min-h-[calc(100vh-4rem)] rounded-3xl border border-rose-200/80 shadow-sm'
          : 'rounded-3xl border border-rose-200/80 shadow-xs min-h-[650px]'
      } flex flex-col`}
      style={{
        background: isDimmedCandleStage
          ? 'linear-gradient(180deg, #4A192C 0%, #2D111E 100%)'
          : theme.gradientBg,
        color: isDimmedCandleStage || theme.isDark ? '#FFF1F2' : theme.textColor,
      }}
    >
      <FloatingHeartsBackdrop
        dark={isDimmedCandleStage || theme.isDark}
        withConfetti={step === 0 || step === 1 || (step === 6 && giftTaps >= 3)}
      />
      {step === 0 && !theme.isDark && <DreamyCloudsBackdrop />}

      {/* Top Overlay Header */}
      <div className="relative z-20 flex items-center justify-between gap-3 px-4 sm:px-6 pt-4 pb-2">
        <div className="flex items-center gap-2">
          {step > (board.passcodeEnabled ? 0 : 1) ? (
            <button
              type="button"
              onClick={() => {
                if (step === 6 && giftTaps >= 3) {
                  setGiftTaps(0);
                } else {
                  setStep((step - 1) as SurpriseStep);
                }
              }}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/85 text-stone-800 hover:bg-white shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {copy.back}
            </button>
          ) : (
            <span className="text-xs font-semibold opacity-75 px-1">
              {copy.forPrefix} {board.recipientName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 relative">
          {step === 1 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((v) => !v)}
                aria-label="Choose card language"
                className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-stone-900/90 text-white hover:bg-stone-900 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-stone-200 shadow-lg py-1 z-40 text-left">
                  {SURPRISE_LANGUAGES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setLang(item.id);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-rose-50 cursor-pointer ${
                        lang === item.id ? 'text-rose-700 font-semibold' : 'text-stone-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[11px] opacity-65">{item.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/90 text-rose-700 tabular-nums shadow-xs whitespace-nowrap">
              {poppedCount}/4 {copy.poppedLabel}
            </span>
          )}

          <button
            type="button"
            onClick={handleToggleMusic}
            aria-label={musicOn ? 'Mute birthday chime' : 'Play birthday chime'}
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-full bg-white/85 text-stone-800 hover:bg-white shadow-xs transition-colors cursor-pointer"
          >
            {musicOn ? (
              <Volume2 className="w-4 h-4 text-rose-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-600" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label={
              isFullscreen ? 'Exit fullscreen preview' : 'Open fullscreen surprise'
            }
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-full bg-white/85 text-stone-800 hover:bg-white shadow-xs transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 py-6 sm:px-8">
        <AnimatePresence mode="wait">
          {/* STEP 0: PASSCODE LOCK */}
          {step === 0 && (
            <motion.div
              key="step-lock"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xs mx-auto text-center space-y-5"
            >
              <div className="flex justify-center">
                <HeartLockSvg />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-sm font-bold tracking-widest uppercase">
                  {copy.enterPasscode}
                </h2>
              </div>

              {/* 4 Vivid Pink Square Slots */}
              <div
                className={`flex items-center justify-center gap-3 ${
                  passcodeError ? 'animate-shake' : ''
                }`}
              >
                {[0, 1, 2, 3].map((slot) => {
                  const char = enteredDigits[slot];
                  return (
                    <div
                      key={slot}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold tabular-nums transition-all shadow-xs ${
                        char
                          ? 'bg-[#DB2777] text-white scale-105'
                          : 'bg-[#EC4899] text-white/40'
                      }`}
                    >
                      {char ?? ''}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium opacity-80 min-h-[18px]">
                  {passcodeError
                    ? copy.passcodeError
                    : copy.passcodeSub}
                </p>
                <div className="w-44 mx-auto border-b border-dashed border-rose-400/50" />
                {!passcodeError && (
                  <p className="text-[11px] font-semibold opacity-70">
                    {board.passcodeHint || `Hint: ${board.passcode}`}
                  </p>
                )}
              </div>

              {/* Circular Keypad */}
              <div className="grid grid-cols-3 gap-3 max-w-[236px] mx-auto pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleDigitPress(digit)}
                    className="h-14 w-14 mx-auto rounded-full bg-white/95 hover:bg-white active:scale-95 text-rose-950 font-display italic text-xl font-semibold shadow-xs border border-rose-200/70 transition-all cursor-pointer flex items-center justify-center tabular-nums"
                  >
                    {digit}
                  </button>
                ))}
                <div />
                <button
                  type="button"
                  onClick={() => handleDigitPress('0')}
                  className="h-14 w-14 mx-auto rounded-full bg-white/95 hover:bg-white active:scale-95 text-rose-950 font-display italic text-xl font-semibold shadow-xs border border-rose-200/70 transition-all cursor-pointer flex items-center justify-center tabular-nums"
                >
                  0
                </button>
                <button
                  type="button"
                  aria-label="Backspace"
                  onClick={() => setEnteredDigits((d) => d.slice(0, -1))}
                  className="h-14 w-14 mx-auto rounded-full bg-white/90 hover:bg-white active:scale-95 text-rose-700 shadow-xs border border-rose-200/70 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: BIRTHDAY WELCOME */}
          {step === 1 && (
            <motion.div
              key="step-welcome"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              className="w-full max-w-md mx-auto text-center space-y-6"
            >
              <div className="space-y-1">
                <h1 className="font-display italic text-4xl sm:text-5xl font-semibold tracking-tight leading-tight text-balance">
                  {copy.happyBirthday}
                  <br />
                  {board.recipientName}
                </h1>
                {board.age && (
                  <p className="text-sm font-medium opacity-80 tabular-nums">
                    Celebrating {board.age} wonderful years
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <CelebrationDuoSvg />
              </div>

              <div className="space-y-4">
                <p className="text-base font-medium">
                  {noClicks > 0 ? copy.noNudgePrompt : copy.excitedPrompt}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      fireBurst(50);
                      setStep(2);
                    }}
                    className="min-h-[48px] min-w-[108px] px-7 py-3 text-sm font-semibold rounded-xl bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    {copy.yes}
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoClicks((c) => c + 1)}
                    style={{
                      transform: `translate(${noOffset.x}px, ${noOffset.y}px)`,
                    }}
                    className={`min-h-[48px] min-w-[108px] px-7 py-3 text-sm font-semibold rounded-xl bg-white text-stone-700 border border-rose-200 hover:bg-rose-50 transition-transform duration-200 cursor-pointer ${
                      noClicks > 0 ? 'opacity-85' : ''
                    }`}
                  >
                    {copy.no}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: POP ALL 4 BALLOONS */}
          {step === 2 && (
            <motion.div
              key="step-balloons"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md mx-auto text-center space-y-5"
            >
              <div className="space-y-1">
                <h2 className="font-display text-3xl font-semibold tracking-tight">
                  {copy.popAllTitle}
                </h2>
                <p className="text-xs opacity-75">{copy.popAllSub}</p>
              </div>

              <AnimatePresence mode="wait">
                {!allBalloonsPopped ? (
                  <motion.div
                    key="balloons-grid"
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="grid grid-cols-2 gap-4 sm:gap-6 max-w-xs mx-auto py-2"
                  >
                    {[0, 1, 2, 3].map((idx) => {
                      const popped = poppedBalloons[idx];
                      const palette = BALLOON_PALETTE[idx];
                      return (
                        <div
                          key={idx}
                          className="min-h-[144px] flex items-center justify-center"
                        >
                          {popped ? (
                            <div className="animate-pop-in font-display italic text-2xl sm:text-3xl font-semibold text-rose-700">
                              {board.balloonWords[idx]}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePopBalloon(idx)}
                              aria-label={`Pop balloon ${idx + 1}`}
                              className="cursor-pointer transition-transform hover:scale-105 active:scale-90 focus:outline-none"
                            >
                              <PastelBalloonSvg
                                color={palette.color}
                                highlightColor={palette.highlight}
                                ribbonColor={palette.ribbon}
                              />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="balloons-coalesced"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className="py-12 space-y-6"
                  >
                    <p className="font-display italic text-3xl sm:text-4xl font-semibold text-rose-700 leading-snug">
                      {board.balloonWords.join(' ')}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex items-center gap-2 min-h-[48px] px-7 py-3 text-sm font-semibold rounded-xl bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-sm transition-colors cursor-pointer"
                    >
                      {copy.continueBtn}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 3: BLOW THE CANDLE */}
          {step === 3 && (
            <motion.div
              key="step-candle"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md mx-auto text-center space-y-6"
            >
              <h2 className="font-display italic text-3xl sm:text-4xl font-semibold tracking-tight">
                {copy.blowCandle} {board.recipientName}
              </h2>

              <div className="flex justify-center py-2">
                <button
                  type="button"
                  onClick={completeCandleBlow}
                  aria-label="Tap cake to blow out candle"
                  className="cursor-pointer focus:outline-none"
                >
                  <SingleCandleCakeSvg
                    lit={!candleBlown}
                    darkMode={isDimmedCandleStage || theme.isDark}
                  />
                </button>
              </div>

              {candleBlown ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <p className="font-display italic text-2xl sm:text-3xl font-medium text-rose-50">
                      {copy.closeEyesWish}
                    </p>
                    <p className="text-xs font-medium text-rose-200/80">
                      {copy.makeAWish}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-2 min-h-[48px] px-7 py-3 text-sm font-semibold rounded-xl bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-sm transition-colors cursor-pointer"
                  >
                    {copy.continueBtn}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleStartMicListen}
                      className={`inline-flex items-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold rounded-xl border transition-colors cursor-pointer ${
                        micListening
                          ? 'bg-[#DB2777] text-white border-[#DB2777]'
                          : 'bg-white text-stone-800 border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      {micListening ? copy.listeningMic : copy.blowIntoMic}
                    </button>

                    <button
                      type="button"
                      onClick={completeCandleBlow}
                      className="inline-flex items-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold rounded-xl bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-xs transition-colors cursor-pointer"
                    >
                      <Wind className="w-4 h-4" />
                      {copy.tapToBlow}
                    </button>
                  </div>

                  {micNote && (
                    <p className="text-xs font-medium opacity-80">{micNote}</p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: ROSE BOUQUET & COMPLIMENT CARDS */}
          {step === 4 && (
            <motion.div
              key="step-bouquet"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl mx-auto text-center space-y-5 relative"
            >
              <h2 className="font-display italic text-3xl sm:text-4xl font-semibold tracking-tight">
                {copy.yourRoseBouquet} 🌹
              </h2>

              {/* Desktop / Tablet Organic Bouquet Stage + Mobile Responsive Grid */}
              <div className="relative py-2">
                {/* Decorative corner heart trees */}
                <div
                  className="hidden sm:block pointer-events-none absolute -bottom-8 -left-4 opacity-90"
                  aria-hidden="true"
                >
                  <HeartTreeSvg />
                </div>
                <div
                  className="hidden sm:block pointer-events-none absolute -bottom-8 -right-4 opacity-90"
                  aria-hidden="true"
                >
                  <HeartTreeSvg flip />
                </div>

                {/* Top two floating notes on sm+ */}
                <div className="hidden sm:grid grid-cols-2 gap-16 max-w-lg mx-auto mb-1">
                  {[bouquetNotes[0], bouquetNotes[1]].map((noteText, i) => {
                    if (!noteText) return null;
                    const visible = i < visibleBouquetCount;
                    return (
                      <div
                        key={`top-${i}`}
                        className={`rounded-xl border border-rose-200 bg-white/95 px-3.5 py-2.5 text-xs font-medium text-stone-800 shadow-xs transition-all duration-300 flex items-center justify-center gap-1.5 ${
                          visible
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-2 scale-95'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{noteText}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Center Bouquet flanked by mid notes on sm+ */}
                <div className="flex items-center justify-center gap-3">
                  {bouquetNotes[2] && (
                    <div
                      className={`hidden sm:flex max-w-[165px] rounded-xl border border-rose-200 bg-white/95 px-3 py-2.5 text-xs font-medium text-stone-800 shadow-xs transition-all duration-300 items-center gap-1.5 ${
                        2 < visibleBouquetCount
                          ? 'opacity-100 translate-y-0 scale-100'
                          : 'opacity-0 translate-y-2 scale-95'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{bouquetNotes[2]}</span>
                    </div>
                  )}

                  <div className="shrink-0">
                    <RoseBouquetSvg />
                  </div>

                  {bouquetNotes[3] && (
                    <div
                      className={`hidden sm:flex max-w-[165px] rounded-xl border border-rose-200 bg-white/95 px-3 py-2.5 text-xs font-medium text-stone-800 shadow-xs transition-all duration-300 items-center gap-1.5 ${
                        3 < visibleBouquetCount
                          ? 'opacity-100 translate-y-0 scale-100'
                          : 'opacity-0 translate-y-2 scale-95'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{bouquetNotes[3]}</span>
                    </div>
                  )}
                </div>

                {/* Bottom two floating notes on sm+ */}
                <div className="hidden sm:grid grid-cols-2 gap-16 max-w-lg mx-auto mt-1">
                  {[bouquetNotes[4], bouquetNotes[5]].map((noteText, i) => {
                    if (!noteText) return null;
                    const idx = i + 4;
                    const visible = idx < visibleBouquetCount;
                    return (
                      <div
                        key={`bot-${idx}`}
                        className={`rounded-xl border border-rose-200 bg-white/95 px-3.5 py-2.5 text-xs font-medium text-stone-800 shadow-xs transition-all duration-300 flex items-center justify-center gap-1.5 ${
                          visible
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-2 scale-95'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{noteText}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Compact Mobile 2-Column Grid */}
                <div className="grid sm:hidden grid-cols-2 gap-2.5 mt-3">
                  {bouquetNotes.map((noteText, idx) => {
                    const visible = idx < visibleBouquetCount;
                    return (
                      <div
                        key={`mob-${idx}`}
                        className={`rounded-xl border border-rose-200 bg-white/95 px-3 py-2 text-xs font-medium text-stone-800 shadow-xs transition-all duration-300 flex items-center justify-center gap-1.5 ${
                          visible
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-2 scale-95'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{noteText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(5)}
                className="relative z-10 inline-flex items-center gap-2 min-h-[48px] px-7 py-3 text-sm font-semibold rounded-full bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-sm transition-colors cursor-pointer"
              >
                {copy.continueBtn}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 5: A MESSAGE FROM MY HEART (ENVELOPE + LETTER) */}
          {step === 5 && (
            <motion.div
              key="step-letter"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md mx-auto text-center space-y-5"
            >
              <div className="space-y-1">
                <h2 className="font-display italic text-3xl sm:text-4xl font-semibold tracking-tight">
                  {copy.messageFromHeart}
                </h2>
                {!envelopeOpened && (
                  <p className="text-xs font-medium opacity-75">{copy.tapToOpen}</p>
                )}
              </div>

              {!envelopeOpened ? (
                <div className="py-6 flex flex-col items-center gap-5">
                  <button
                    type="button"
                    onClick={() => {
                      setEnvelopeOpened(true);
                      setRevealedChars(0);
                      fireBurst(40);
                    }}
                    className="cursor-pointer focus:outline-none"
                    aria-label="Open birthday letter envelope"
                  >
                    <GoldTrimEnvelopeSvg opened={false} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEnvelopeOpened(true);
                      setRevealedChars(0);
                      fireBurst(40);
                    }}
                    className="min-h-[48px] px-6 py-3 text-xs font-bold tracking-wider uppercase rounded-xl bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-sm cursor-pointer"
                  >
                    {copy.tapToOpen}
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative text-left bg-[#FFFDF9] text-stone-800 border border-rose-200 rounded-2xl p-6 sm:p-7 shadow-md space-y-4 overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display italic text-lg font-semibold text-rose-800">
                      {copy.dear} {board.recipientName},
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRevealedChars(board.message.length);
                        fireBurst(30);
                      }}
                      aria-label="Reveal full letter"
                      className="w-9 h-9 rounded-full bg-[#DB2777] text-white flex items-center justify-center shrink-0 hover:bg-[#BE185D] transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                    </button>
                  </div>

                  <p className="font-display text-sm sm:text-base font-semibold text-stone-900">
                    {board.headline}
                  </p>

                  <div
                    ref={letterScrollRef}
                    className="max-h-[250px] overflow-y-auto pr-2 font-display italic text-[15px] leading-relaxed text-stone-700 whitespace-pre-line"
                  >
                    {board.message.slice(0, revealedChars)}
                    {!letterFinished && (
                      <span className="inline-block w-1.5 h-4 bg-rose-500 ml-0.5 animate-pulse align-middle" />
                    )}
                  </div>

                  <div className="pt-2 border-t border-rose-100 flex items-end justify-between gap-2">
                    <div className="space-y-1.5">
                      <p className="font-display italic text-sm font-medium text-rose-800">
                        {copy.withLove} {board.senderName}
                      </p>
                      {!letterFinished && (
                        <button
                          type="button"
                          onClick={() => setRevealedChars(board.message.length)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                        >
                          {copy.showFullLetter}
                        </button>
                      )}
                    </div>
                    <CuteKittensSvg />
                  </div>
                </motion.div>
              )}

              {envelopeOpened && (
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="inline-flex items-center gap-2 min-h-[48px] px-7 py-3 text-sm font-semibold rounded-full bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-sm transition-colors cursor-pointer"
                >
                  {copy.oneLastSurprise}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}

          {/* STEP 6: ONE LAST THING (TAP GIFT -> FINALE) */}
          {step === 6 && (
            <motion.div
              key="step-gift"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md mx-auto text-center space-y-6"
            >
              {giftTaps < 3 ? (
                <>
                  <div className="space-y-1">
                    <h2 className="font-display italic text-3xl sm:text-4xl font-semibold tracking-tight">
                      {copy.oneLastThing}
                    </h2>
                    <p className="text-xs font-medium opacity-75">
                      {giftTaps === 0 ? copy.tapTheGift : copy.tapsRemaining(3 - giftTaps)}
                    </p>
                  </div>

                  <div className="relative inline-flex justify-center py-4">
                    <button
                      type="button"
                      onClick={handleTapGift}
                      aria-label="Tap birthday gift box"
                      className="cursor-pointer focus:outline-none"
                    >
                      <GiftBoxSvg taps={giftTaps} />
                    </button>
                    {giftTaps > 0 && (
                      <span className="absolute top-3 right-0 w-9 h-9 rounded-full bg-[#DB2777] text-white font-bold text-sm flex items-center justify-center shadow-sm tabular-nums">
                        {giftTaps}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="relative bg-white/95 text-stone-900 rounded-3xl p-6 border border-rose-200 shadow-md space-y-4">
                    <span className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#DB2777] text-white flex items-center justify-center shadow-xs">
                      <Heart className="w-4 h-4 fill-white" />
                    </span>

                    <div className="flex justify-center">
                      <FinaleDuoSvg />
                    </div>

                    <div className="space-y-1">
                      <h2 className="font-display italic text-2xl sm:text-3xl font-semibold text-rose-800">
                        {copy.lotsOfLove}
                      </h2>
                      <p className="text-sm text-stone-600">
                        {copy.onceAgain}, {board.recipientName}!
                      </p>
                      {board.toastQuote && (
                        <p className="text-xs italic text-rose-600 pt-1">
                          “{board.toastQuote}”
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleReplay}
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-xs font-semibold rounded-full border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {copy.replay}
                      </button>

                      {onJumpToWall && (
                        <button
                          type="button"
                          onClick={onJumpToWall}
                          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-xs font-semibold rounded-full bg-[#DB2777] text-white hover:bg-[#BE185D] transition-colors cursor-pointer"
                        >
                          <MessageSquareHeart className="w-3.5 h-3.5" />
                          {copy.groupWishes} ({board.notes.length})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Cards matching finale */}
                  <div className="space-y-2.5 text-left">
                    {onCreateOwn && (
                      <button
                        type="button"
                        onClick={onCreateOwn}
                        className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold rounded-full bg-gradient-to-r from-[#EC4899] to-[#E11D48] text-white hover:opacity-95 shadow-sm transition-opacity cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        {copy.createOwnCard}
                      </button>
                    )}

                    {onQuickThankYou && !thankYouSent && (
                      <div className="bg-white/95 text-stone-900 rounded-2xl border border-rose-200 p-4 space-y-3">
                        <button
                          type="button"
                          onClick={() => setThankYouOpen((o) => !o)}
                          className="w-full flex items-center justify-between gap-3 text-left cursor-pointer"
                        >
                          <div>
                            <div className="text-sm font-semibold text-stone-900">
                              {copy.writeThankYou}
                            </div>
                            <div className="text-xs text-stone-500">
                              {copy.writeThankYouSub}
                            </div>
                          </div>
                          <Edit3 className="w-4 h-4 text-rose-600 shrink-0" />
                        </button>

                        {thankYouOpen && (
                          <form onSubmit={handleSendThankYou} className="space-y-2 pt-1">
                            <textarea
                              rows={2}
                              required
                              maxLength={300}
                              value={thankYouText}
                              onChange={(e) => setThankYouText(e.target.value)}
                              placeholder={`Thank you everyone for the sweet wishes! — ${board.recipientName}`}
                              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                            />
                            <button
                              type="submit"
                              className="min-h-[40px] px-4 py-2 text-xs font-semibold rounded-lg bg-[#DB2777] text-white hover:bg-[#BE185D] cursor-pointer"
                            >
                              {copy.postThankYou}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {thankYouSent && (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-medium text-emerald-800 text-center">
                        {copy.thankYouPosted}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
