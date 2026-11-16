import confetti from 'canvas-confetti';
import { Flame, Sparkles, Wind } from 'lucide-react';
import { useMemo } from 'react';

export function triggerConfettiBurst(colors: string[]) {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  confetti({
    particleCount: 75,
    spread: 72,
    origin: { y: 0.62 },
    colors,
  });
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.65 },
      colors,
    });
  }, 180);
}

interface BalloonShowerProps {
  activeKey: number;
  colors: string[];
}

export function BalloonShower({ activeKey, colors }: BalloonShowerProps) {
  const balloons = useMemo(() => {
    if (activeKey === 0) return [];
    const positions = [8, 19, 31, 44, 58, 71, 82, 91];
    return positions.map((left, idx) => ({
      id: `${activeKey}-${idx}`,
      left,
      delay: (idx % 4) * 0.28,
      scale: 0.85 + (idx % 3) * 0.14,
      color: colors[idx % colors.length],
    }));
  }, [activeKey, colors]);

  if (activeKey === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-20"
      aria-hidden="true"
    >
      {balloons.map((b) => (
        <div
          key={b.id}
          className="animate-balloon absolute bottom-0"
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <svg
            width={Math.round(48 * b.scale)}
            height={Math.round(88 * b.scale)}
            viewBox="0 0 48 88"
            fill="none"
          >
            <path
              d="M24 58 C23 68, 27 76, 22 87"
              stroke="rgba(120, 113, 108, 0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <ellipse cx="24" cy="28" rx="20" ry="25" fill={b.color} />
            <ellipse
              cx="17"
              cy="19"
              rx="4.5"
              ry="8"
              transform="rotate(-18 17 19)"
              fill="rgba(255,255,255,0.38)"
            />
            <polygon points="21,52 27,52 24,57" fill={b.color} />
          </svg>
        </div>
      ))}
    </div>
  );
}

interface InteractiveCakeProps {
  litCandles: boolean[];
  onToggleCandle: (index: number) => void;
  onBlowAll: () => void;
  onRelight: () => void;
  recipientName: string;
  toastQuote: string;
  isDarkSurface: boolean;
}

export function InteractiveCake({
  litCandles,
  onToggleCandle,
  onBlowAll,
  onRelight,
  recipientName,
  toastQuote,
  isDarkSurface,
}: InteractiveCakeProps) {
  const anyLit = litCandles.some(Boolean);
  const candlePositions = [70, 100, 130, 160, 190];
  const candleColors = ['#E11D48', '#F59E0B', '#2563EB', '#10B981', '#EC4899'];

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-colors ${
        isDarkSurface
          ? 'bg-indigo-950/60 border-indigo-700/60 text-stone-100'
          : 'bg-amber-50/70 border-amber-200/80 text-stone-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="shrink-0">
          <svg
            width="230"
            height="150"
            viewBox="0 0 260 170"
            fill="none"
            role="img"
            aria-label={`Interactive birthday cake for ${recipientName}`}
          >
            {/* Cake stand */}
            <rect
              x="35"
              y="148"
              width="190"
              height="9"
              rx="4.5"
              fill={isDarkSurface ? '#CBD5E1' : '#D6D3D1'}
            />
            <rect
              x="114"
              y="156"
              width="32"
              height="10"
              rx="3"
              fill={isDarkSurface ? '#94A3B8' : '#A8A29E'}
            />

            {/* Bottom cake layer */}
            <rect x="48" y="106" width="164" height="42" rx="10" fill="#FDE68A" />
            <path
              d="M48 114 Q68 124 88 114 T128 114 T168 114 T212 114 L212 106 Q212 102 204 102 L56 102 Q48 102 48 106 Z"
              fill="#FFFDF8"
            />

            {/* Top cake layer */}
            <rect x="64" y="72" width="132" height="36" rx="9" fill="#FDA4AF" />
            <path
              d="M64 80 Q80 88 96 80 T128 80 T160 80 T196 80 L196 72 Q196 68 188 68 L72 68 Q64 68 64 72 Z"
              fill="#FFFBF5"
            />

            {/* Candles */}
            {candlePositions.map((cx, idx) => {
              const isLit = litCandles[idx] ?? false;
              return (
                <g
                  key={cx}
                  onClick={() => onToggleCandle(idx)}
                  className="cursor-pointer"
                >
                  {/* Invisible wider click target */}
                  <rect x={cx - 12} y="16" width="24" height="54" fill="transparent" />
                  <rect
                    x={cx - 4}
                    y="38"
                    width="8"
                    height="30"
                    rx="3"
                    fill={candleColors[idx]}
                  />
                  <line
                    x1={cx}
                    y1="38"
                    x2={cx}
                    y2="32"
                    stroke={isDarkSurface ? '#E2E8F0' : '#44403C'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {isLit ? (
                    <g className="animate-flame">
                      <ellipse
                        cx={cx}
                        cy="24"
                        rx="6.5"
                        ry="9.5"
                        fill="rgba(251, 191, 36, 0.35)"
                      />
                      <path
                        d={`M${cx} 15 C${cx + 4.5} 21, ${cx + 4} 28, ${cx} 31 C${cx - 4} 28, ${cx - 4.5} 21, ${cx} 15 Z`}
                        fill="#F59E0B"
                      />
                      <path
                        d={`M${cx} 20 C${cx + 2} 23, ${cx + 2} 27, ${cx} 29 C${cx - 2} 27, ${cx - 2} 23, ${cx} 20 Z`}
                        fill="#FEF08A"
                      />
                    </g>
                  ) : (
                    <circle
                      cx={cx}
                      cy="26"
                      r="3"
                      fill="rgba(148, 163, 184, 0.55)"
                      className="animate-smoke"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-3">
          {anyLit ? (
            <>
              <p className="text-sm font-semibold">
                Make a birthday wish, {recipientName}
              </p>
              <p
                className={`text-xs leading-relaxed ${
                  isDarkSurface ? 'text-indigo-200' : 'text-stone-600'
                }`}
              >
                Tap individual candles or blow them all out at once to reveal your birthday toast.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={onBlowAll}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Wind className="w-3.5 h-3.5" />
                  Blow Out Candles
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Wish made — candles blown out
              </p>
              <p
                className={`text-sm italic font-display ${
                  isDarkSurface ? 'text-amber-200' : 'text-rose-700'
                }`}
              >
                “{toastQuote}”
              </p>
              <button
                type="button"
                onClick={onRelight}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isDarkSurface
                    ? 'border-indigo-600 text-indigo-100 hover:bg-indigo-900/60'
                    : 'border-stone-300 text-stone-700 bg-white hover:bg-stone-50'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Relight Candles
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
