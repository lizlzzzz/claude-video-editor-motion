import React from 'react';
import { COLORS, FONT_FAMILY } from '../constants';

interface ArtProps {
  frame: number;
  width?: number | string;
  height?: number | string;
  blurred?: boolean;
  showRamenBanner?: boolean;
  beatPulse?: number;
}

/** Clip 1: 夜景.mp4 — Starry city skyline with crescent moon */
export const NightCityArt: React.FC<ArtProps> = ({ frame }) => {
  const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.25);
  const buildings = [
    { x: 4, w: 28, h: 68 },
    { x: 34, w: 22, h: 96 },
    { x: 58, w: 32, h: 80 },
    { x: 92, w: 26, h: 110 },
    { x: 120, w: 34, h: 74 },
    { x: 156, w: 28, h: 98 },
    { x: 186, w: 24, h: 62 },
  ];

  return (
    <svg viewBox="0 0 210 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D234A" />
          <stop offset="65%" stopColor="#2F3B72" />
          <stop offset="100%" stopColor="#46528C" />
        </linearGradient>
      </defs>
      <rect width="210" height="280" fill="url(#nightSky)" />
      {/* Stars */}
      {[
        [28, 36, 2.2],
        [68, 22, 1.8],
        [96, 56, 2.5],
        [176, 30, 2.1],
        [44, 78, 1.6],
        [152, 82, 2.0],
        [18, 110, 1.5],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="#FFF4B8"
          opacity={i % 2 === 0 ? twinkle : 1.1 - twinkle * 0.5}
        />
      ))}
      {/* Crescent Moon */}
      <g transform={`translate(148, 52) rotate(${Math.sin(frame * 0.05) * 4})`}>
        <circle cx="0" cy="0" r="18" fill="#FFE67A" />
        <circle cx="8" cy="-4" r="15" fill="#252D5B" />
      </g>
      {/* Distant silhouette */}
      <path
        d="M0 190 L22 190 L22 168 L48 168 L48 182 L82 182 L82 156 L112 156 L112 178 L145 178 L145 162 L178 162 L178 185 L210 185 L210 280 L0 280 Z"
        fill="#1E2547"
      />
      {/* Foreground buildings + lit windows */}
      {buildings.map((b, idx) => {
        const y = 280 - b.h;
        return (
          <g key={idx}>
            <rect
              x={b.x}
              y={y}
              width={b.w}
              height={b.h}
              fill="#171C36"
              stroke="#0F1327"
              strokeWidth="1.5"
            />
            {Array.from({ length: Math.floor(b.h / 16) }).map((_, r) =>
              Array.from({ length: 2 }).map((__, c) => {
                const lit = (idx * 7 + r * 3 + c + Math.floor(frame / 18)) % 3 !== 0;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={b.x + 5 + c * 10}
                    y={y + 8 + r * 14}
                    width="5"
                    height="7"
                    rx="1"
                    fill={lit ? '#FFD866' : '#293259'}
                  />
                );
              })
            )}
          </g>
        );
      })}
    </svg>
  );
};

/** Clip 2: 拉面.mp4 — Steaming ramen bowl with chopsticks + optional blurred focus-hunting state */
export const RamenArt: React.FC<ArtProps> = ({ frame, blurred = false, showRamenBanner = false }) => {
  const liftY = Math.sin(frame * 0.16) * 7;
  const steamShift = (frame * 1.4) % 24;

  return (
    <svg viewBox="0 0 210 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ramenWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9EBC3" />
          <stop offset="100%" stopColor="#F4DA9B" />
        </linearGradient>
        <filter id="ramenBlur">
          <feGaussianBlur stdDeviation="5.5" />
          <feColorMatrix type="saturate" values="0.15" />
        </filter>
      </defs>

      <g filter={blurred ? 'url(#ramenBlur)' : undefined}>
        {/* Warm dining background + wooden table */}
        <rect width="210" height="205" fill="url(#ramenWall)" />
        <rect y="198" width="210" height="82" fill="#E3B178" stroke={COLORS.ink} strokeWidth="2.5" />
        <line x1="0" y1="226" x2="210" y2="226" stroke="#C9945A" strokeWidth="2" />
        <line x1="0" y1="254" x2="210" y2="254" stroke="#C9945A" strokeWidth="2" />

        {/* Steam wisps */}
        {[72, 104, 134].map((sx, i) => (
          <path
            key={i}
            d={`M ${sx} ${135 - steamShift * 0.5} Q ${sx - 8} ${118 - steamShift * 0.5} ${sx + 4} ${102 - steamShift * 0.5}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            opacity={0.65}
          />
        ))}

        {/* Bowl base & body */}
        <path
          d="M 42 156 C 42 216, 70 226, 105 226 C 140 226, 168 216, 168 156 Z"
          fill="#FFFDF8"
          stroke={COLORS.ink}
          strokeWidth="3"
        />
        <rect x="80" y="222" width="50" height="10" rx="3" fill="#FFFDF8" stroke={COLORS.ink} strokeWidth="2.5" />
        {/* Red geometric ramen stripe */}
        <path
          d="M 47 175 Q 105 186 163 175 L 160 190 Q 105 201 50 190 Z"
          fill="none"
          stroke="#D84040"
          strokeWidth="2.5"
        />
        <path
          d="M 53 182 L 62 182 L 62 187 L 70 187 L 70 182 L 80 182 L 80 187 L 90 187 L 90 182 L 100 182 L 100 187 L 110 187 L 110 182 L 120 182 L 120 187 L 130 187 L 130 182 L 140 182 L 140 187 L 150 187 L 150 182 L 157 182"
          fill="none"
          stroke="#D84040"
          strokeWidth="2.2"
        />

        {/* Broth ellipse */}
        <ellipse cx="105" cy="156" rx="63" ry="18" fill="#FFFDF8" stroke={COLORS.ink} strokeWidth="3" />
        <ellipse cx="105" cy="157" rx="56" ry="14" fill="#E5A243" stroke={COLORS.ink} strokeWidth="2" />

        {/* Nori seaweed */}
        <rect x="120" y="126" width="24" height="30" rx="2" fill="#2A3B2D" stroke={COLORS.ink} strokeWidth="2" transform="rotate(6 132 141)" />
        {/* Chashu & Ajitama Egg & Narutomaki */}
        <ellipse cx="78" cy="154" rx="14" ry="8" fill="#B86B52" stroke={COLORS.ink} strokeWidth="2" />
        <ellipse cx="74" cy="161" rx="11" ry="7" fill="#FFFDF6" stroke={COLORS.ink} strokeWidth="2" />
        <ellipse cx="74" cy="161" rx="5.5" ry="3.8" fill="#F29E2E" />
        <circle cx="132" cy="161" r="8.5" fill="#FFFDF6" stroke={COLORS.ink} strokeWidth="2" />
        <path d="M 132 161 m -3 0 a 3 3 0 1 1 6 0 a 4.5 4.5 0 1 1 -8 0" fill="none" stroke="#EA738D" strokeWidth="2" />

        {/* Noodles lifted by chopsticks */}
        <g transform={`translate(0, ${liftY})`}>
          {[-6, -2, 2, 6].map((dx, i) => (
            <path
              key={i}
              d={`M ${103 + dx} 112 Q ${101 + dx} 134 ${104 + dx} 162`}
              fill="none"
              stroke="#F7DE8B"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ))}
          {[-6, -2, 2, 6].map((dx, i) => (
            <path
              key={`o-${i}`}
              d={`M ${103 + dx} 112 Q ${101 + dx} 134 ${104 + dx} 162`}
              fill="none"
              stroke="#C99738"
              strokeWidth="1"
            />
          ))}
          {/* Chopsticks */}
          <line x1="100" y1="112" x2="214" y2="38" stroke="#6E4627" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="103" y1="118" x2="216" y2="52" stroke="#8C5C36" strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>

      {/* Optional Retro Ramen Banner (Act 4) */}
      {showRamenBanner && !blurred && (
        <g>
          <rect x="10" y="16" width="190" height="36" rx="4" fill="#324472" stroke={COLORS.ink} strokeWidth="2.5" />
          <line x1="56" y1="16" x2="56" y2="52" stroke="#53689E" strokeWidth="2" />
          <line x1="154" y1="16" x2="154" y2="52" stroke="#53689E" strokeWidth="2" />
          <circle cx="33" cy="34" r="5" fill="#FFFDF6" />
          <circle cx="177" cy="34" r="5" fill="#FFFDF6" />
          <text
            x="105"
            y="41"
            textAnchor="middle"
            fill="#FFFDF6"
            fontSize="22"
            fontWeight="800"
            fontFamily={FONT_FAMILY}
            letterSpacing="8"
          >
            拉面
          </text>
        </g>
      )}

      {/* Dead-air camera autofocus overlay (Act 3) */}
      {blurred && (
        <g>
          <rect width="210" height="280" fill="rgba(50,48,44,0.22)" />
          {/* Focus brackets */}
          <path d="M 32 76 L 32 52 L 56 52" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 178 76 L 178 52 L 154 52" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 32 184 L 32 208 L 56 208" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 178 184 L 178 208 L 154 208" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          {/* Spinning focus ring */}
          <g transform={`translate(105, 112) rotate(${frame * 12})`}>
            <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
            <path d="M 0 -18 A 18 18 0 0 1 18 0" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </g>
          <text
            x="105"
            y="162"
            textAnchor="middle"
            fill="#FFFFFF"
            stroke={COLORS.ink}
            strokeWidth="4"
            paintOrder="stroke"
            fontSize="22"
            fontWeight="800"
            fontFamily={FONT_FAMILY}
          >
            对焦中..
          </text>
        </g>
      )}
    </svg>
  );
};

/** Clip 3: 柴犬.mov — Cute Shiba Inu on mint polka-dot backdrop with floating hearts */
export const ShibaArt: React.FC<ArtProps> = ({ frame, beatPulse = 0 }) => {
  const bob = Math.sin(frame * 0.22) * 3.5;
  const heartFloat = Math.sin(frame * 0.18) * 5;
  const happyEyes = Math.floor(frame / 18) % 2 === 0;

  return (
    <svg viewBox="0 0 210 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="210" height="280" fill="#D2F0E4" />
      {/* Subtle polka dots */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 5 }).map((__, c) => (
          <circle
            key={`${r}-${c}`}
            cx={22 + c * 42 + (r % 2) * 18}
            cy={24 + r * 44}
            r="6"
            fill="#E5F8F0"
          />
        ))
      )}

      {/* Floating hearts */}
      <g transform={`translate(46, ${88 + heartFloat}) scale(0.9)`}>
        <path
          d="M 0 6 C -8 -4, -18 4, 0 18 C 18 4, 8 -4, 0 6 Z"
          fill="#F47CA0"
          stroke={COLORS.ink}
          strokeWidth="2.5"
        />
      </g>
      <g transform={`translate(158, ${70 - heartFloat}) scale(1.05)`}>
        <path
          d="M 0 6 C -8 -4, -18 4, 0 18 C 18 4, 8 -4, 0 6 Z"
          fill="#F47CA0"
          stroke={COLORS.ink}
          strokeWidth="2.5"
        />
      </g>

      {/* Shiba body & head */}
      <g transform={`translate(105, ${188 + bob}) scale(${1 + beatPulse * 0.05})`}>
        {/* Wagging tail */}
        <path
          d="M 48 16 Q 74 -8 64 26"
          fill="#D98344"
          stroke={COLORS.ink}
          strokeWidth="3"
          transform={`rotate(${Math.sin(frame * 0.5) * 10} 48 16)`}
        />
        {/* Body */}
        <path
          d="M -56 92 L -56 32 C -56 -8, 56 -8, 56 32 L 56 92 Z"
          fill="#D98344"
          stroke={COLORS.ink}
          strokeWidth="3"
        />
        {/* White belly */}
        <ellipse cx="0" cy="48" rx="34" ry="38" fill="#FFFDF8" />
        {/* Red collar */}
        <path d="M -38 8 Q 0 22 38 8" fill="none" stroke="#E04F5F" strokeWidth="6" strokeLinecap="round" />
        <circle cx="0" cy="18" r="5" fill="#F5C94C" stroke={COLORS.ink} strokeWidth="2" />

        {/* Ears */}
        <path d="M -46 -32 L -52 -78 L -14 -52 Z" fill="#D98344" stroke={COLORS.ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M -42 -36 L -45 -64 L -22 -48 Z" fill="#F6C5B2" />
        <path d="M 46 -32 L 52 -78 L 14 -52 Z" fill="#D98344" stroke={COLORS.ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M 42 -36 L 45 -64 L 22 -48 Z" fill="#F6C5B2" />

        {/* Head */}
        <ellipse cx="0" cy="-22" rx="54" ry="44" fill="#D98344" stroke={COLORS.ink} strokeWidth="3" />
        {/* White cheek mask */}
        <path
          d="M -50 -14 C -36 -30, -14 -24, 0 -14 C 14 -24, 36 -30, 50 -14 C 46 14, 24 22, 0 22 C -24 22, -46 14, -50 -14 Z"
          fill="#FFFDF8"
        />
        {/* Eyebrows */}
        <ellipse cx="-20" cy="-36" rx="6" ry="3.5" fill="#FFFDF8" />
        <ellipse cx="20" cy="-36" rx="6" ry="3.5" fill="#FFFDF8" />
        {/* Eyes */}
        {happyEyes ? (
          <>
            <path d="M -28 -20 Q -20 -28 -12 -20" fill="none" stroke={COLORS.ink} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 12 -20 Q 20 -28 28 -20" fill="none" stroke={COLORS.ink} strokeWidth="3.2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="-20" cy="-22" r="5" fill={COLORS.ink} />
            <circle cx="-22" cy="-24" r="1.8" fill="#FFFFFF" />
            <circle cx="20" cy="-22" r="5" fill={COLORS.ink} />
            <circle cx="18" cy="-24" r="1.8" fill="#FFFFFF" />
          </>
        )}
        {/* Rosy cheeks */}
        <ellipse cx="-32" cy="-10" rx="8" ry="4.5" fill="#FFA6B8" opacity="0.7" />
        <ellipse cx="32" cy="-10" rx="8" ry="4.5" fill="#FFA6B8" opacity="0.7" />
        {/* Nose & mouth */}
        <ellipse cx="0" cy="-13" rx="6" ry="4.5" fill={COLORS.ink} />
        <path d="M -7 -5 Q -3.5 0 0 -5 Q 3.5 0 7 -5" fill="none" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** Clip 4: 小克蹦迪.mp4 — Disco ball, neon dance floor & dancing Claude mascot */
export const DiscoClaudeArt: React.FC<ArtProps> = ({ frame, beatPulse = 0 }) => {
  const danceBounce = Math.abs(Math.sin(frame * 0.35)) * 12;
  const armWave = Math.sin(frame * 0.35) * 18;
  const beamRot = Math.sin(frame * 0.12) * 16;
  const tilePalette = ['#5E72EB', '#FF6B9D', '#FFD166', '#56CFE1', '#9B5DE5'];

  return (
    <svg viewBox="0 0 210 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="discoBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5D4B9E" />
          <stop offset="58%" stopColor="#9A6CB8" />
          <stop offset="100%" stopColor="#3B3A7A" />
        </linearGradient>
      </defs>
      <rect width="210" height="280" fill="url(#discoBg)" />

      {/* Light beams */}
      <g transform={`translate(105, 52) rotate(${beamRot})`} opacity="0.26">
        <polygon points="0,0 -110,190 -50,190" fill="#FF9CE3" />
        <polygon points="0,0 50,190 110,190" fill="#9BF6FF" />
        <polygon points="0,0 -25,190 25,190" fill="#FDFFB6" />
      </g>

      {/* Perspective Disco Floor */}
      <rect x="0" y="175" width="210" height="105" fill="#2A275A" />
      {Array.from({ length: 4 }).map((_, row) => {
        const y0 = 178 + row * 26;
        const y1 = y0 + 24;
        return Array.from({ length: 5 }).map((__, col) => {
          const spread0 = 28 + row * 11;
          const spread1 = 28 + (row + 1) * 11;
          const x0 = 105 + (col - 2.5) * spread0;
          const x1 = 105 + (col - 1.5) * spread0;
          const x2 = 105 + (col - 1.5) * spread1;
          const x3 = 105 + (col - 2.5) * spread1;
          const colorIdx = (row * 3 + col + Math.floor(frame / 6)) % tilePalette.length;
          return (
            <polygon
              key={`${row}-${col}`}
              points={`${x0},${y0} ${x1},${y0} ${x2},${y1} ${x3},${y1}`}
              fill={tilePalette[colorIdx]}
              opacity={0.78}
              stroke="#2A275A"
              strokeWidth="1.5"
            />
          );
        });
      })}

      {/* Disco Ball */}
      <line x1="105" y1="0" x2="105" y2="36" stroke={COLORS.ink} strokeWidth="2.5" />
      <circle cx="105" cy="52" r="18" fill="#E3E6F2" stroke={COLORS.ink} strokeWidth="2.5" />
      <path d="M 88 52 Q 105 46 122 52 M 89 44 Q 105 40 121 44 M 89 60 Q 105 64 121 60" fill="none" stroke="#8C93B0" strokeWidth="1.5" />
      <ellipse cx="100" cy="46" rx="5" ry="3.5" fill="#FFFFFF" />

      {/* Sparkles */}
      {[
        [34, 48],
        [168, 60],
        [44, 118],
        [164, 128],
      ].map(([sx, sy], i) => (
        <path
          key={i}
          d={`M ${sx} ${sy - 7} L ${sx + 2} ${sy - 2} L ${sx + 7} ${sy} L ${sx + 2} ${sy + 2} L ${sx} ${sy + 7} L ${sx - 2} ${sy + 2} L ${sx - 7} ${sy} L ${sx - 2} ${sy - 2} Z`}
          fill="#FFF49C"
          stroke={COLORS.ink}
          strokeWidth="1"
          transform={`scale(${0.8 + 0.3 * Math.sin(frame * 0.3 + i)})`}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        />
      ))}

      {/* Mini Dancing Claude */}
      <g transform={`translate(105, ${168 - danceBounce}) scale(${1 + beatPulse * 0.08})`}>
        {/* Left & Right raised arms */}
        <path
          d={`M -34 -8 Q -50 ${-24 + armWave * 0.4} -44 ${-40 + armWave * 0.5}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d={`M -34 -8 Q -50 ${-24 + armWave * 0.4} -44 ${-40 + armWave * 0.5}`}
          fill="none"
          stroke={COLORS.terracotta}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d={`M 34 -8 Q 50 ${-24 - armWave * 0.4} 44 ${-40 - armWave * 0.5}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d={`M 34 -8 Q 50 ${-24 - armWave * 0.4} 44 ${-40 - armWave * 0.5}`}
          fill="none"
          stroke={COLORS.terracotta}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Legs */}
        <rect x="-24" y="18" width="12" height="18" rx="3" fill={COLORS.terracottaDark} stroke={COLORS.ink} strokeWidth="2.5" />
        <rect x="12" y="18" width="12" height="18" rx="3" fill={COLORS.terracottaDark} stroke={COLORS.ink} strokeWidth="2.5" />
        {/* Body */}
        <rect x="-34" y="-28" width="68" height="48" rx="6" fill={COLORS.terracotta} stroke={COLORS.ink} strokeWidth="3" />
        {/* Happy curved eyes */}
        <path d="M -18 -6 Q -12 -14 -6 -6" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M 6 -6 Q 12 -14 18 -6" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
        {/* Cheeks */}
        <ellipse cx="-22" cy="4" rx="5" ry="3" fill="#FF9AA2" opacity="0.65" />
        <ellipse cx="22" cy="4" rx="5" ry="3" fill="#FF9AA2" opacity="0.65" />
      </g>
    </svg>
  );
};
