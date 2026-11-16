import React from 'react';

export function FloatingHeartsBackdrop({
  dark = false,
  withConfetti = false,
}: {
  dark?: boolean;
  withConfetti?: boolean;
}) {
  const hearts = [
    { left: '8%', top: '14%', size: 22, delay: '0s' },
    { left: '84%', top: '18%', size: 28, delay: '1.2s' },
    { left: '16%', top: '52%', size: 18, delay: '2.4s' },
    { left: '78%', top: '48%', size: 24, delay: '0.8s' },
    { left: '11%', top: '80%', size: 26, delay: '1.9s' },
    { left: '88%', top: '76%', size: 20, delay: '3.1s' },
    { left: '48%', top: '10%', size: 16, delay: '1.5s' },
  ];

  const confettiBits = [
    { left: '7%', top: '8%', color: '#F59E0B', rot: 25 },
    { left: '22%', top: '12%', color: '#3B82F6', rot: -18 },
    { left: '76%', top: '9%', color: '#10B981', rot: 35 },
    { left: '91%', top: '14%', color: '#EC4899', rot: -28 },
    { left: '14%', top: '28%', color: '#8B5CF6', rot: 45 },
    { left: '85%', top: '31%', color: '#F43F5E', rot: -40 },
    { left: '31%', top: '6%', color: '#FB7185', rot: 12 },
    { left: '66%', top: '7%', color: '#FBBF24', rot: -15 },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {withConfetti &&
        confettiBits.map((c, idx) => (
          <span
            key={`bit-${idx}`}
            className="absolute w-2 h-3 rounded-xs opacity-65"
            style={{
              left: c.left,
              top: c.top,
              backgroundColor: c.color,
              transform: `rotate(${c.rot}deg)`,
            }}
          />
        ))}
      {hearts.map((h, i) => (
        <svg
          key={i}
          width={h.size}
          height={h.size}
          viewBox="0 0 24 24"
          fill={dark ? 'rgba(251, 113, 133, 0.22)' : 'rgba(244, 63, 94, 0.16)'}
          className="animate-float-heart absolute"
          style={{
            left: h.left,
            top: h.top,
            animationDelay: h.delay,
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
}

export function DreamyCloudsBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-32 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 420 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="none"
      >
        <path
          d="M-20 120 V68 C15 48 52 52 74 70 C95 45 142 44 166 68 C196 42 252 46 276 72 C304 48 355 46 382 68 C402 52 428 56 442 74 V120 Z"
          fill="rgba(255, 255, 255, 0.52)"
        />
        <path
          d="M-10 120 V86 C26 66 72 72 96 90 C128 66 176 70 206 90 C244 64 294 68 326 88 C362 66 404 72 432 90 V120 Z"
          fill="rgba(255, 245, 248, 0.85)"
        />
      </svg>
    </div>
  );
}

export function HeartLockSvg() {
  return (
    <svg
      width="136"
      height="116"
      viewBox="0 0 136 116"
      fill="none"
      role="img"
      aria-label="Heart padlock with golden key"
      className="drop-shadow-sm"
    >
      <defs>
        <linearGradient
          id="heartLockGrad"
          x1="20"
          y1="26"
          x2="86"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient
          id="goldShackle"
          x1="36"
          y1="6"
          x2="70"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Shackle */}
      <path
        d="M36 44 V25 C36 14 44 7 53 7 C62 7 70 14 70 25 V44"
        stroke="url(#goldShackle)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Heart body */}
      <path
        d="M53 102 C53 102 15 77 15 51 C15 38.5 24.8 29.5 36.2 29.5 C43.8 29.5 50.1 33.5 53 39.2 C55.9 33.5 62.2 29.5 69.8 29.5 C81.2 29.5 91 38.5 91 51 C91 77 53 102 53 102 Z"
        fill="url(#heartLockGrad)"
      />
      <ellipse
        cx="33"
        cy="45"
        rx="8"
        ry="4.5"
        transform="rotate(-32 33 45)"
        fill="rgba(255,255,255,0.42)"
      />

      {/* Keyhole */}
      <circle cx="53" cy="59" r="5.5" fill="#4C0519" />
      <path d="M50 61 L56 61 L57.5 74 L48.5 74 Z" fill="#4C0519" />

      {/* Golden Key */}
      <g transform="translate(54, 59) rotate(-25)">
        <rect x="0" y="-3.2" width="42" height="6.4" rx="3.2" fill="#FBBF24" />
        <rect x="4" y="3.2" width="4.5" height="6.5" rx="1.5" fill="#F59E0B" />
        <rect x="12" y="3.2" width="4.5" height="5" rx="1.5" fill="#F59E0B" />
        <circle
          cx="49"
          cy="0"
          r="11"
          stroke="#FBBF24"
          strokeWidth="5"
          fill="#FEF3C7"
        />
      </g>
    </svg>
  );
}

export function CelebrationDuoSvg() {
  return (
    <svg
      width="280"
      height="196"
      viewBox="0 0 280 196"
      fill="none"
      role="img"
      aria-label="Cute bear and panda celebrating with a birthday cake"
    >
      {/* Festive Bunting */}
      <path
        d="M18 26 Q140 52 262 26"
        stroke="#FB7185"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
      <polygon points="40,30 56,32 46,47" fill="#F43F5E" />
      <polygon points="78,35 94,37 85,51" fill="#FBBF24" />
      <polygon points="118,39 134,39 126,53" fill="#38BDF8" />
      <polygon points="158,38 174,37 166,51" fill="#34D399" />
      <polygon points="196,35 212,33 205,47" fill="#A78BFA" />
      <polygon points="232,29 248,26 242,41" fill="#FB7185" />

      {/* Ground shadow */}
      <ellipse cx="140" cy="178" rx="112" ry="11" fill="rgba(225, 29, 72, 0.1)" />

      {/* Left Bear */}
      <g transform="translate(28, 68)">
        <polygon points="36,-18 22,12 50,12" fill="#F43F5E" />
        <circle cx="36" cy="-19" r="5" fill="#FDE047" />
        <circle cx="14" cy="20" r="11" fill="#A1623B" />
        <circle cx="58" cy="20" r="11" fill="#A1623B" />
        <ellipse cx="36" cy="40" rx="28" ry="25" fill="#B9774B" />
        <ellipse cx="36" cy="80" rx="24" ry="22" fill="#B9774B" />
        <ellipse cx="36" cy="82" rx="14" ry="14" fill="#FDE68A" opacity="0.55" />
        <ellipse cx="36" cy="45" rx="10" ry="7.5" fill="#FEF3C7" />
        <circle cx="25" cy="36" r="2.8" fill="#292524" />
        <circle cx="47" cy="36" r="2.8" fill="#292524" />
        <ellipse cx="36" cy="43" rx="3.2" ry="2.2" fill="#292524" />
        <circle cx="18" cy="44" r="4" fill="#FDA4AF" opacity="0.7" />
        <circle cx="54" cy="44" r="4" fill="#FDA4AF" opacity="0.7" />
      </g>

      {/* Right Panda */}
      <g transform="translate(180, 68)">
        <polygon points="36,-18 22,12 50,12" fill="#38BDF8" />
        <circle cx="36" cy="-19" r="5" fill="#FDA4AF" />
        <circle cx="14" cy="20" r="11" fill="#292524" />
        <circle cx="58" cy="20" r="11" fill="#292524" />
        <ellipse cx="36" cy="40" rx="28" ry="25" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="1.5" />
        <ellipse cx="36" cy="80" rx="24" ry="22" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="1.5" />
        <ellipse cx="25" cy="37" rx="7" ry="6" transform="rotate(-15 25 37)" fill="#292524" />
        <ellipse cx="47" cy="37" rx="7" ry="6" transform="rotate(15 47 37)" fill="#292524" />
        <circle cx="25.5" cy="36.5" r="1.8" fill="#FFFFFF" />
        <circle cx="46.5" cy="36.5" r="1.8" fill="#FFFFFF" />
        <ellipse cx="36" cy="44" rx="3" ry="2" fill="#292524" />
        <circle cx="17" cy="45" r="4.5" fill="#FDA4AF" opacity="0.75" />
        <circle cx="55" cy="45" r="4.5" fill="#FDA4AF" opacity="0.75" />
      </g>

      {/* Center Birthday Cake */}
      <g transform="translate(101, 96)">
        <rect x="36" y="4" width="6" height="22" rx="3" fill="#FB7185" />
        <g className="animate-flame">
          <path d="M39 -12 C43 -5 43 1 39 4 C35 1 35 -5 39 -12 Z" fill="#F59E0B" />
          <path d="M39 -8 C41 -4 41 0 39 2 C37 0 37 -4 39 -8 Z" fill="#FEF08A" />
        </g>
        <rect x="10" y="26" width="58" height="24" rx="7" fill="#FDA4AF" />
        <path
          d="M10 34 Q20 41 30 34 T50 34 T68 34 L68 26 Q68 23 62 23 L16 23 Q10 23 10 26 Z"
          fill="#FFFDF8"
        />
        <rect x="2" y="48" width="74" height="28" rx="8" fill="#FDE68A" />
        <text
          x="39"
          y="66"
          textAnchor="middle"
          fill="#9F1239"
          fontSize="10"
          fontWeight="700"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          HAPPY BDAY
        </text>
      </g>
    </svg>
  );
}

interface PastelBalloonSvgProps {
  color: string;
  highlightColor: string;
  ribbonColor: string;
}

export function PastelBalloonSvg({
  color,
  highlightColor,
  ribbonColor,
}: PastelBalloonSvgProps) {
  return (
    <svg
      width="96"
      height="140"
      viewBox="0 0 96 140"
      fill="none"
      className="animate-balloon-bob drop-shadow-sm"
    >
      {/* Curly ribbon */}
      <path
        d="M48 94 C41 106, 56 116, 44 131 C41 135, 48 138, 50 137"
        stroke={ribbonColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M48 94 C54 102, 40 108, 53 120"
        stroke={ribbonColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Knot */}
      <polygon points="43,89 53,89 48,95" fill={color} />
      {/* Balloon Sphere */}
      <ellipse cx="48" cy="48" rx="35" ry="42" fill={color} />
      {/* Gloss reflection */}
      <ellipse
        cx="32"
        cy="30"
        rx="8.5"
        ry="15"
        transform="rotate(-22 32 30)"
        fill={highlightColor}
        opacity="0.68"
      />
      {/* Cute daisy sticker */}
      <g transform="translate(48, 54)">
        <circle cx="0" cy="-6" r="4.2" fill="rgba(255,255,255,0.88)" />
        <circle cx="6" cy="-2" r="4.2" fill="rgba(255,255,255,0.88)" />
        <circle cx="3.8" cy="5" r="4.2" fill="rgba(255,255,255,0.88)" />
        <circle cx="-3.8" cy="5" r="4.2" fill="rgba(255,255,255,0.88)" />
        <circle cx="-6" cy="-2" r="4.2" fill="rgba(255,255,255,0.88)" />
        <circle cx="0" cy="0" r="4" fill="#FBBF24" />
      </g>
    </svg>
  );
}

export function SingleCandleCakeSvg({
  lit,
  darkMode = false,
}: {
  lit: boolean;
  darkMode?: boolean;
}) {
  return (
    <svg
      width="224"
      height="192"
      viewBox="0 0 220 190"
      fill="none"
      role="img"
      aria-label={lit ? 'Birthday cake with lit candle' : 'Birthday cake with extinguished candle'}
    >
      <ellipse
        cx="110"
        cy="166"
        rx="88"
        ry="13"
        fill={darkMode ? 'rgba(255,255,255,0.16)' : '#F5E6EA'}
      />
      <rect x="42" y="102" width="136" height="62" rx="14" fill="#6D4C3D" />
      <path
        d="M42 102 C42 92 50 88 60 88 H160 C170 88 178 92 178 102 V116 C172 124 162 122 158 114 C153 128 139 128 135 114 C128 124 116 122 112 113 C106 129 92 129 88 114 C81 124 68 122 64 113 C58 124 46 122 42 114 Z"
        fill="#FFF8EB"
      />
      <rect x="104" y="48" width="12" height="42" rx="4" fill="#E11D48" />
      <rect x="107" y="54" width="6" height="8" rx="1" fill="#FDA4AF" opacity="0.6" />
      <line x1="110" y1="48" x2="110" y2="41" stroke="#44403C" strokeWidth="2" strokeLinecap="round" />

      {lit ? (
        <g className="animate-flame">
          <ellipse cx="110" cy="27" rx="14" ry="18" fill="rgba(251, 191, 36, 0.35)" />
          <path
            d="M110 12 C117 22 116 34 110 38 C104 34 103 22 110 12 Z"
            fill="#F59E0B"
          />
          <path
            d="M110 20 C113 25 113 32 110 35 C107 32 107 25 110 20 Z"
            fill="#FEF08A"
          />
        </g>
      ) : (
        <g className="animate-smoke">
          <circle cx="110" cy="30" r="4" fill="rgba(255,255,255,0.55)" />
          <circle cx="115" cy="20" r="5" fill="rgba(255,255,255,0.4)" />
        </g>
      )}
    </svg>
  );
}

export function HeartTreeSvg({ flip = false }: { flip?: boolean }) {
  const leafHearts = [
    { x: 48, y: 20, s: 0.75, c: '#F43F5E' },
    { x: 24, y: 32, s: 0.68, c: '#FB7185' },
    { x: 72, y: 30, s: 0.7, c: '#FB7185' },
    { x: 38, y: 46, s: 0.78, c: '#EC4899' },
    { x: 64, y: 48, s: 0.72, c: '#F43F5E' },
    { x: 16, y: 56, s: 0.6, c: '#FDA4AF' },
    { x: 82, y: 54, s: 0.62, c: '#FDA4AF' },
    { x: 50, y: 62, s: 0.65, c: '#E11D48' },
  ];

  return (
    <svg
      width="104"
      height="128"
      viewBox="0 0 104 128"
      fill="none"
      aria-hidden="true"
      className={flip ? 'scale-x-[-1]' : ''}
    >
      {/* Trunk & Branches */}
      <path
        d="M52 124 V74 M52 86 L28 60 M52 82 L76 58 M52 74 L44 46 M52 74 L64 48"
        stroke="#8D6E63"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.65"
      />
      {/* Heart leaves */}
      {leafHearts.map((lh, idx) => (
        <g
          key={idx}
          transform={`translate(${lh.x}, ${lh.y}) scale(${lh.s})`}
          opacity="0.72"
        >
          <path
            d="M0 10 C0 10 -10 2 -10 -4 C-10 -8 -6.5 -10 -3 -10 C-1 -10 0 -8.5 0 -7 C0 -8.5 1 -10 3 -10 C6.5 -10 10 -8 10 -4 C10 2 0 10 0 10 Z"
            fill={lh.c}
          />
        </g>
      ))}
    </svg>
  );
}

export function RoseBouquetSvg() {
  return (
    <svg
      width="220"
      height="210"
      viewBox="0 0 220 210"
      fill="none"
      role="img"
      aria-label="Bouquet of crimson roses wrapped in kraft paper"
    >
      <ellipse cx="64" cy="74" rx="22" ry="11" transform="rotate(-30 64 74)" fill="#15803D" />
      <ellipse cx="156" cy="74" rx="22" ry="11" transform="rotate(30 156 74)" fill="#15803D" />
      <ellipse cx="110" cy="40" rx="14" ry="22" fill="#16A34A" />
      <ellipse cx="52" cy="94" rx="18" ry="9" transform="rotate(-15 52 94)" fill="#22C55E" />
      <ellipse cx="168" cy="94" rx="18" ry="9" transform="rotate(15 168 94)" fill="#22C55E" />

      <polygon points="50,96 170,96 126,188 94,188" fill="#E7C8A0" stroke="#D4AD7D" strokeWidth="2" />
      <polygon points="62,96 158,96 126,188 94,188" fill="#F3DEC0" />

      {[
        { cx: 82, cy: 68, r: 21, c: '#E11D48' },
        { cx: 138, cy: 68, r: 21, c: '#E11D48' },
        { cx: 110, cy: 56, r: 23, c: '#BE123C' },
        { cx: 68, cy: 90, r: 19, c: '#F43F5E' },
        { cx: 152, cy: 90, r: 19, c: '#F43F5E' },
        { cx: 96, cy: 88, r: 22, c: '#E11D48' },
        { cx: 124, cy: 88, r: 22, c: '#BE123C' },
        { cx: 110, cy: 102, r: 20, c: '#F43F5E' },
      ].map((rose, i) => (
        <g key={i}>
          <circle cx={rose.cx} cy={rose.cy} r={rose.r} fill={rose.c} />
          <path
            d={`M${rose.cx - 8} ${rose.cy - 3} Q${rose.cx} ${rose.cy - 10} ${rose.cx + 8} ${rose.cy - 2} Q${rose.cx + 4} ${rose.cy + 8} ${rose.cx - 5} ${rose.cy + 5}`}
            stroke="#FDA4AF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ))}

      <rect x="86" y="138" width="48" height="12" rx="6" fill="#E11D48" />
      <ellipse cx="94" cy="144" rx="14" ry="9" transform="rotate(-18 94 144)" fill="#F43F5E" />
      <ellipse cx="126" cy="144" rx="14" ry="9" transform="rotate(18 126 144)" fill="#F43F5E" />
      <circle cx="110" cy="144" r="6" fill="#BE123C" />
      <path d="M104 148 L92 180 L102 178 Z" fill="#E11D48" />
      <path d="M116 148 L128 180 L118 178 Z" fill="#E11D48" />
    </svg>
  );
}

export function GoldTrimEnvelopeSvg({ opened }: { opened: boolean }) {
  return (
    <svg
      width="256"
      height="176"
      viewBox="0 0 256 176"
      fill="none"
      role="img"
      aria-label="Cream and blush envelope with gold trim"
      className="drop-shadow-md transition-transform duration-300"
    >
      <rect
        x="8"
        y="28"
        width="240"
        height="140"
        rx="14"
        fill="#FFFBF5"
        stroke="#D4AF37"
        strokeWidth="2.5"
      />
      <path d="M10 34 L128 112 L10 162 Z" fill="#FFF3E6" />
      <path d="M246 34 L128 112 L246 162 Z" fill="#FFF3E6" />
      <path d="M10 162 L128 96 L246 162 Z" fill="#FFF8F0" stroke="#E5C878" strokeWidth="1.5" />

      {!opened ? (
        <path
          d="M10 32 Q128 126 246 32 Z"
          fill="#FECDD3"
          stroke="#D4AF37"
          strokeWidth="2.5"
        />
      ) : (
        <path
          d="M10 32 Q128 -26 246 32 Z"
          fill="#FFE4E6"
          stroke="#D4AF37"
          strokeWidth="2"
        />
      )}

      <circle cx="128" cy="86" r="14" fill="#F43F5E" stroke="#D4AF37" strokeWidth="2" />
      <path
        d="M128 92 C128 92 121 87.5 121 83.5 C121 81.5 122.6 80 124.5 80 C126 80 127.3 80.8 128 82 C128.7 80.8 130 80 131.5 80 C133.4 80 135 81.5 135 83.5 C135 87.5 128 92 128 92 Z"
        fill="#FFF1F2"
      />
    </svg>
  );
}

export function CuteKittensSvg() {
  return (
    <svg
      width="82"
      height="54"
      viewBox="0 0 82 54"
      fill="none"
      aria-hidden="true"
    >
      {/* Left cream kitten */}
      <g transform="translate(2, 6)">
        <polygon points="8,14 11,3 17,11" fill="#F5D0A9" />
        <polygon points="24,11 30,3 33,14" fill="#F5D0A9" />
        <ellipse cx="20.5" cy="21" rx="13" ry="11" fill="#FDE6C4" stroke="#E5B98A" strokeWidth="1" />
        <ellipse cx="20.5" cy="36" rx="11" ry="10" fill="#FDE6C4" stroke="#E5B98A" strokeWidth="1" />
        <circle cx="16" cy="20" r="1.6" fill="#292524" />
        <circle cx="25" cy="20" r="1.6" fill="#292524" />
        <circle cx="13" cy="23" r="2.2" fill="#FDA4AF" opacity="0.7" />
        <circle cx="28" cy="23" r="2.2" fill="#FDA4AF" opacity="0.7" />
        <polygon points="19.5,22 21.5,22 20.5,23.5" fill="#FB7185" />
      </g>

      {/* Right gray kitten */}
      <g transform="translate(40, 8)">
        <polygon points="7,13 10,2 16,10" fill="#D6D3D1" />
        <polygon points="22,10 28,2 31,13" fill="#D6D3D1" />
        <ellipse cx="19" cy="20" rx="12" ry="10.5" fill="#E7E5E4" stroke="#A8A29E" strokeWidth="1" />
        <ellipse cx="19" cy="35" rx="10.5" ry="9.5" fill="#E7E5E4" stroke="#A8A29E" strokeWidth="1" />
        <circle cx="15" cy="19" r="1.6" fill="#292524" />
        <circle cx="23" cy="19" r="1.6" fill="#292524" />
        <circle cx="12" cy="22" r="2.2" fill="#FDA4AF" opacity="0.7" />
        <circle cx="26" cy="22" r="2.2" fill="#FDA4AF" opacity="0.7" />
        <polygon points="18,21 20,21 19,22.5" fill="#FB7185" />
      </g>

      {/* Tiny heart above them */}
      <path
        d="M41 11 C41 11 36 7 36 4.5 C36 3 37.2 2 38.5 2 C39.5 2 40.5 2.6 41 3.5 C41.5 2.6 42.5 2 43.5 2 C44.8 2 46 3 46 4.5 C46 7 41 11 41 11 Z"
        fill="#F43F5E"
      />
    </svg>
  );
}

export function GiftBoxSvg({ taps }: { taps: number }) {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      role="img"
      aria-label="Wrapped birthday gift box"
      className={`transition-transform duration-200 ${
        taps === 1
          ? 'scale-105 -rotate-3'
          : taps === 2
          ? 'scale-110 rotate-3'
          : 'hover:scale-105'
      }`}
    >
      <ellipse cx="80" cy="144" rx="52" ry="8" fill="rgba(225, 29, 72, 0.14)" />
      {/* Box base */}
      <rect x="30" y="66" width="100" height="74" rx="10" fill="#FFE4E6" stroke="#FB7185" strokeWidth="2.5" />
      {/* Soft pastel stripes */}
      <rect x="42" y="70" width="8" height="66" rx="4" fill="#FECDD3" />
      <rect x="110" y="70" width="8" height="66" rx="4" fill="#FECDD3" />
      {/* Vertical ribbon */}
      <rect x="70" y="66" width="20" height="74" fill="#F43F5E" />
      {/* Box lid */}
      <rect x="22" y="48" width="116" height="24" rx="7" fill="#FFF1F2" stroke="#FB7185" strokeWidth="2.5" />
      <rect x="70" y="48" width="20" height="24" fill="#E11D48" />
      {/* Bow */}
      <ellipse cx="64" cy="40" rx="16" ry="10" transform="rotate(-16 64 40)" fill="#F43F5E" />
      <ellipse cx="96" cy="40" rx="16" ry="10" transform="rotate(16 96 40)" fill="#F43F5E" />
      <circle cx="80" cy="44" r="7" fill="#BE123C" />
    </svg>
  );
}

export function FinaleDuoSvg() {
  return (
    <svg
      width="240"
      height="176"
      viewBox="0 0 240 176"
      fill="none"
      role="img"
      aria-label="Cute bunny with birthday cake and bear holding a gift"
    >
      <text
        x="120"
        y="30"
        textAnchor="middle"
        fill="#E11D48"
        fontSize="24"
        fontWeight="700"
        fontFamily="Fraunces, Georgia, serif"
      >
        HBD
      </text>

      {/* Bunny */}
      <g transform="translate(26, 38)">
        <ellipse cx="32" cy="14" rx="9" ry="24" transform="rotate(-8 32 14)" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="1.5" />
        <ellipse cx="56" cy="14" rx="9" ry="24" transform="rotate(8 56 14)" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="1.5" />
        <ellipse cx="32" cy="16" rx="4.5" ry="15" transform="rotate(-8 32 16)" fill="#FDA4AF" />
        <ellipse cx="56" cy="16" rx="4.5" ry="15" transform="rotate(8 56 16)" fill="#FDA4AF" />
        <ellipse cx="44" cy="54" rx="28" ry="24" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="1.5" />
        <ellipse cx="44" cy="96" rx="24" ry="24" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="1.5" />
        <circle cx="34" cy="52" r="2.8" fill="#292524" />
        <circle cx="54" cy="52" r="2.8" fill="#292524" />
        <circle cx="26" cy="59" r="4.5" fill="#FDA4AF" opacity="0.75" />
        <circle cx="62" cy="59" r="4.5" fill="#FDA4AF" opacity="0.75" />
        <rect x="26" y="72" width="36" height="20" rx="5" fill="#FDA4AF" />
        <rect x="26" y="72" width="36" height="7" rx="3" fill="#FFFDF8" />
        <rect x="42" y="60" width="4" height="12" rx="2" fill="#F59E0B" />
        <circle cx="44" cy="57" r="3" fill="#FDE047" />
      </g>

      {/* Bear */}
      <g transform="translate(128, 42)">
        <circle cx="20" cy="30" r="10" fill="#B9774B" />
        <circle cx="68" cy="30" r="10" fill="#B9774B" />
        <ellipse cx="44" cy="50" rx="28" ry="24" fill="#B9774B" />
        <ellipse cx="44" cy="92" rx="24" ry="24" fill="#B9774B" />
        <ellipse cx="44" cy="56" rx="10" ry="7" fill="#FEF3C7" />
        <circle cx="33" cy="47" r="2.8" fill="#292524" />
        <circle cx="55" cy="47" r="2.8" fill="#292524" />
        <ellipse cx="44" cy="54" rx="3" ry="2" fill="#292524" />
        <circle cx="25" cy="54" r="4.2" fill="#FDA4AF" opacity="0.7" />
        <circle cx="63" cy="54" r="4.2" fill="#FDA4AF" opacity="0.7" />
        <rect x="24" y="72" width="38" height="32" rx="5" fill="#FBBF24" />
        <rect x="40" y="72" width="6" height="32" fill="#E11D48" />
        <rect x="24" y="85" width="38" height="6" fill="#E11D48" />
      </g>
    </svg>
  );
}
