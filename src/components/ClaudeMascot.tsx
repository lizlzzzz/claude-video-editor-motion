import React from 'react';
import { COLORS, FONT_FAMILY } from '../constants';

export type MascotMood =
  | 'normal'
  | 'star'
  | 'squint'
  | 'dizzy'
  | 'happy'
  | 'wink'
  | 'sweat';

export interface MascotProps {
  x: number;
  y: number;
  frame: number;
  scale?: number;
  mood?: MascotMood;
  sunglasses?: 'none' | 'on' | 'forehead';
  leftArmTarget?: { x: number; y: number } | null;
  rightArmTarget?: { x: number; y: number } | null;
  knifeAngle?: number | null; // if set, draws utility knife at rightArmTarget or hand
  speechBubble?: string | null;
  dustPuff?: number; // 0..1 landing dust
  walkCycle?: number; // 0 = standing, >0 = walking/hopping phase
  armsUp?: boolean;
  winkWave?: boolean;
}

/**
 * Stretchy rubber-hose arm rendered in stage coordinates (so it can reach any panel!)
 */
export const StretchyArm: React.FC<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  thickness?: number;
  showHand?: boolean;
}> = ({ fromX, fromY, toX, toY, thickness = 11, showHand = true }) => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const midX = (fromX + toX) / 2 - dy * 0.04;
  const midY = (fromY + toY) / 2 + dx * 0.03;
  const d = `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;

  return (
    <g>
      <path d={d} fill="none" stroke={COLORS.ink} strokeWidth={thickness + 5} strokeLinecap="round" />
      <path d={d} fill="none" stroke={COLORS.terracotta} strokeWidth={thickness} strokeLinecap="round" />
      {showHand && (
        <circle
          cx={toX}
          cy={toY}
          r={thickness * 0.58}
          fill={COLORS.terracotta}
          stroke={COLORS.ink}
          strokeWidth={2.5}
        />
      )}
    </g>
  );
};

/**
 * Claude Mascot ("小克") — Terracotta rounded-block character with lively expressions & rubber-hose arms.
 * Rendered inside a full-stage SVG overlay (1280x720) so stretchy arms can effortlessly cross panel borders.
 */
export const ClaudeMascotLayer: React.FC<MascotProps> = ({
  x,
  y,
  frame,
  scale = 1,
  mood = 'normal',
  sunglasses = 'none',
  leftArmTarget = null,
  rightArmTarget = null,
  knifeAngle = null,
  speechBubble = null,
  dustPuff = 0,
  walkCycle = 0,
  armsUp = false,
  winkWave = false,
}) => {
  const idleBob = Math.sin(frame * 0.16) * 2.2;
  const legSwing = walkCycle > 0 ? Math.sin(walkCycle) * 8 : 0;
  const bodyW = 84 * scale;
  const bodyH = 58 * scale;
  const cx = x;
  const cy = y + idleBob;

  const leftShoulderX = cx - bodyW * 0.48;
  const leftShoulderY = cy + bodyH * 0.05;
  const rightShoulderX = cx + bodyW * 0.48;
  const rightShoulderY = cy + bodyH * 0.05;

  const blink = mood === 'normal' && frame % 85 > 81;

  return (
    <svg
      width={1280}
      height={720}
      viewBox="0 0 1280 720"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {/* Landing Dust Puffs */}
      {dustPuff > 0.02 && (
        <g opacity={Math.min(1, dustPuff * 1.4)}>
          <ellipse
            cx={cx - 38 * scale - (1 - dustPuff) * 16}
            cy={cy + bodyH * 0.65}
            rx={15 * scale * (1.2 - dustPuff * 0.3)}
            ry={10 * scale}
            fill="#FFFFFF"
            stroke={COLORS.ink}
            strokeWidth={2}
          />
          <ellipse
            cx={cx + 38 * scale + (1 - dustPuff) * 16}
            cy={cy + bodyH * 0.65}
            rx={14 * scale * (1.2 - dustPuff * 0.3)}
            ry={9 * scale}
            fill="#FFFFFF"
            stroke={COLORS.ink}
            strokeWidth={2}
          />
        </g>
      )}

      {/* Stretchy Arms (drawn behind or over body) */}
      {leftArmTarget && (
        <StretchyArm
          fromX={leftShoulderX}
          fromY={leftShoulderY}
          toX={leftArmTarget.x}
          toY={leftArmTarget.y}
          thickness={10 * scale}
        />
      )}
      {rightArmTarget && (
        <StretchyArm
          fromX={rightShoulderX}
          fromY={rightShoulderY}
          toX={rightArmTarget.x}
          toY={rightArmTarget.y}
          thickness={10 * scale}
        />
      )}

      {/* Utility Knife Prop held at right arm target */}
      {knifeAngle !== null && rightArmTarget && (
        <g transform={`translate(${rightArmTarget.x}, ${rightArmTarget.y}) rotate(${knifeAngle})`}>
          {/* Silver blade */}
          <polygon
            points="8,-5 38,-6 46,3 8,5"
            fill="#E8EDF2"
            stroke={COLORS.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <line x1="22" y1="-5" x2="18" y2="5" stroke="#9AA5B1" strokeWidth="1.5" />
          <line x1="32" y1="-5" x2="28" y2="5" stroke="#9AA5B1" strokeWidth="1.5" />
          {/* Yellow handle */}
          <rect
            x="-12"
            y="-7"
            width="24"
            height="14"
            rx="3"
            fill={COLORS.yellow}
            stroke={COLORS.ink}
            strokeWidth={2.2}
          />
          <rect x="-4" y="-3" width="10" height="5" rx="1.5" fill={COLORS.ink} />
          {/* Glint star */}
          <path
            d="M 44 -10 L 46 -4 L 52 -2 L 46 0 L 44 6 L 42 0 L 36 -2 L 42 -4 Z"
            fill="#FFFFFF"
            stroke={COLORS.ink}
            strokeWidth={1.2}
          />
        </g>
      )}

      {/* Short Default Arms when not stretching */}
      {!leftArmTarget && (
        armsUp ? (
          <g>
            <path
              d={`M ${leftShoulderX} ${leftShoulderY} Q ${leftShoulderX - 18 * scale} ${leftShoulderY - 18 * scale} ${leftShoulderX - 12 * scale} ${leftShoulderY - 34 * scale}`}
              fill="none"
              stroke={COLORS.ink}
              strokeWidth={14 * scale}
              strokeLinecap="round"
            />
            <path
              d={`M ${leftShoulderX} ${leftShoulderY} Q ${leftShoulderX - 18 * scale} ${leftShoulderY - 18 * scale} ${leftShoulderX - 12 * scale} ${leftShoulderY - 34 * scale}`}
              fill="none"
              stroke={COLORS.terracotta}
              strokeWidth={9 * scale}
              strokeLinecap="round"
            />
          </g>
        ) : (
          <rect
            x={leftShoulderX - 11 * scale}
            y={leftShoulderY - 5 * scale}
            width={13 * scale}
            height={11 * scale}
            rx={3 * scale}
            fill={COLORS.terracottaDark}
            stroke={COLORS.ink}
            strokeWidth={2.4}
          />
        )
      )}

      {!rightArmTarget && (
        armsUp || winkWave ? (
          <g>
            <path
              d={`M ${rightShoulderX} ${rightShoulderY} Q ${rightShoulderX + 20 * scale} ${rightShoulderY - 14 * scale} ${rightShoulderX + 24 * scale} ${rightShoulderY - (winkWave ? 26 + Math.sin(frame * 0.45) * 8 : 34) * scale}`}
              fill="none"
              stroke={COLORS.ink}
              strokeWidth={14 * scale}
              strokeLinecap="round"
            />
            <path
              d={`M ${rightShoulderX} ${rightShoulderY} Q ${rightShoulderX + 20 * scale} ${rightShoulderY - 14 * scale} ${rightShoulderX + 24 * scale} ${rightShoulderY - (winkWave ? 26 + Math.sin(frame * 0.45) * 8 : 34) * scale}`}
              fill="none"
              stroke={COLORS.terracotta}
              strokeWidth={9 * scale}
              strokeLinecap="round"
            />
          </g>
        ) : (
          <rect
            x={rightShoulderX - 2 * scale}
            y={rightShoulderY - 5 * scale}
            width={13 * scale}
            height={11 * scale}
            rx={3 * scale}
            fill={COLORS.terracottaDark}
            stroke={COLORS.ink}
            strokeWidth={2.4}
          />
        )
      )}

      {/* Legs */}
      <g>
        <rect
          x={cx - bodyW * 0.34}
          y={cy + bodyH * 0.44 + Math.max(0, legSwing * 0.3)}
          width={13 * scale}
          height={18 * scale}
          rx={3 * scale}
          fill={COLORS.terracottaDark}
          stroke={COLORS.ink}
          strokeWidth={2.4}
        />
        <rect
          x={cx + bodyW * 0.18}
          y={cy + bodyH * 0.44 + Math.max(0, -legSwing * 0.3)}
          width={13 * scale}
          height={18 * scale}
          rx={3 * scale}
          fill={COLORS.terracottaDark}
          stroke={COLORS.ink}
          strokeWidth={2.4}
        />
      </g>

      {/* Main Terracotta Body */}
      <g transform={`translate(${cx}, ${cy})`}>
        <rect
          x={-bodyW / 2}
          y={-bodyH / 2}
          width={bodyW}
          height={bodyH}
          rx={7 * scale}
          fill={COLORS.terracotta}
          stroke={COLORS.ink}
          strokeWidth={2.8}
        />
        {/* Subtle warm highlight along top */}
        <rect
          x={-bodyW / 2 + 4 * scale}
          y={-bodyH / 2 + 3 * scale}
          width={bodyW - 8 * scale}
          height={7 * scale}
          rx={3 * scale}
          fill={COLORS.terracottaLight}
          opacity={0.45}
        />

        {/* Rosy cheeks for happy/wink */}
        {(mood === 'happy' || mood === 'wink' || mood === 'star') && (
          <>
            <ellipse cx={-23 * scale} cy={6 * scale} rx={6 * scale} ry={3.5 * scale} fill="#FF9AA8" opacity={0.65} />
            <ellipse cx={23 * scale} cy={6 * scale} rx={6 * scale} ry={3.5 * scale} fill="#FF9AA8" opacity={0.65} />
          </>
        )}

        {/* Eyes by Mood */}
        {mood === 'star' && (
          <>
            {[-14, 14].map((ex, i) => (
              <path
                key={i}
                d={`M ${ex * scale} ${-11 * scale} L ${(ex + 3) * scale} ${-4 * scale} L ${(ex + 10) * scale} ${-1 * scale} L ${(ex + 3) * scale} ${2 * scale} L ${ex * scale} ${9 * scale} L ${(ex - 3) * scale} ${2 * scale} L ${(ex - 10) * scale} ${-1 * scale} L ${(ex - 3) * scale} ${-4 * scale} Z`}
                fill="#FFE46B"
                stroke={COLORS.ink}
                strokeWidth={2}
              />
            ))}
          </>
        )}

        {mood === 'normal' && (
          blink ? (
            <>
              <line x1={-18 * scale} y1={-2 * scale} x2={-9 * scale} y2={-2 * scale} stroke={COLORS.ink} strokeWidth={3} strokeLinecap="round" />
              <line x1={9 * scale} y1={-2 * scale} x2={18 * scale} y2={-2 * scale} stroke={COLORS.ink} strokeWidth={3} strokeLinecap="round" />
            </>
          ) : (
            <>
              <rect x={-16 * scale} y={-9 * scale} width={7 * scale} height={14 * scale} rx={3.5 * scale} fill={COLORS.ink} />
              <circle cx={-13.5 * scale} cy={-5.5 * scale} r={1.8 * scale} fill="#FFFFFF" />
              <rect x={9 * scale} y={-9 * scale} width={7 * scale} height={14 * scale} rx={3.5 * scale} fill={COLORS.ink} />
              <circle cx={11.5 * scale} cy={-5.5 * scale} r={1.8 * scale} fill="#FFFFFF" />
            </>
          )
        )}

        {mood === 'squint' && (
          <>
            <rect x={-20 * scale} y={-6 * scale} width={14 * scale} height={6 * scale} rx={2 * scale} fill={COLORS.ink} />
            <rect x={6 * scale} y={-6 * scale} width={14 * scale} height={6 * scale} rx={2 * scale} fill={COLORS.ink} />
          </>
        )}

        {mood === 'dizzy' && (
          <>
            {[-14, 14].map((ex, i) => (
              <g key={i} transform={`translate(${ex * scale}, ${-2 * scale}) rotate(${frame * 16 * (i === 0 ? 1 : -1)})`}>
                <circle cx={0} cy={0} r={8 * scale} fill="none" stroke={COLORS.ink} strokeWidth={2.2} />
                <circle cx={0} cy={0} r={4 * scale} fill="none" stroke={COLORS.ink} strokeWidth={2} />
                <circle cx={0} cy={0} r={1.5 * scale} fill={COLORS.ink} />
              </g>
            ))}
          </>
        )}

        {mood === 'happy' && (
          <>
            <path d={`M ${-20 * scale} ${0} Q ${-13 * scale} ${-10 * scale} ${-6 * scale} ${0}`} fill="none" stroke={COLORS.ink} strokeWidth={3.2} strokeLinecap="round" />
            <path d={`M ${6 * scale} ${0} Q ${13 * scale} ${-10 * scale} ${20 * scale} ${0}`} fill="none" stroke={COLORS.ink} strokeWidth={3.2} strokeLinecap="round" />
          </>
        )}

        {mood === 'wink' && (
          <>
            <rect x={-16 * scale} y={-9 * scale} width={7 * scale} height={14 * scale} rx={3.5 * scale} fill={COLORS.ink} />
            <circle cx={-13.5 * scale} cy={-5.5 * scale} r={1.8 * scale} fill="#FFFFFF" />
            <path d={`M ${7 * scale} ${-2 * scale} Q ${14 * scale} ${-9 * scale} ${21 * scale} ${-2 * scale}`} fill="none" stroke={COLORS.ink} strokeWidth={3.2} strokeLinecap="round" />
          </>
        )}

        {mood === 'sweat' && (
          <>
            <rect x={-16 * scale} y={-8 * scale} width={7 * scale} height={12 * scale} rx={3.5 * scale} fill={COLORS.ink} />
            <rect x={9 * scale} y={-8 * scale} width={7 * scale} height={12 * scale} rx={3.5 * scale} fill={COLORS.ink} />
            <path d={`M ${28 * scale} ${-16 * scale} Q ${34 * scale} ${-6 * scale} ${28 * scale} ${-2 * scale} Q ${22 * scale} ${-6 * scale} ${28 * scale} ${-16 * scale} Z`} fill="#8AD8FF" stroke={COLORS.ink} strokeWidth={1.6} />
          </>
        )}

        {/* Cool Sunglasses */}
        {sunglasses !== 'none' && (
          <g transform={`translate(0, ${sunglasses === 'forehead' ? -28 * scale : -4 * scale})`}>
            <rect x={-26 * scale} y={-6 * scale} width={22 * scale} height={13 * scale} rx={3 * scale} fill="#1E1C1A" stroke={COLORS.ink} strokeWidth={1.8} />
            <rect x={4 * scale} y={-6 * scale} width={22 * scale} height={13 * scale} rx={3 * scale} fill="#1E1C1A" stroke={COLORS.ink} strokeWidth={1.8} />
            <line x1={-4 * scale} y1={-2 * scale} x2={4 * scale} y2={-2 * scale} stroke={COLORS.ink} strokeWidth={3} />
            <line x1={-22 * scale} y1={-3 * scale} x2={-15 * scale} y2={4 * scale} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} />
            <line x1={8 * scale} y1={-3 * scale} x2={15 * scale} y2={4 * scale} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} />
          </g>
        )}
      </g>

      {/* Speech Bubble */}
      {speechBubble && (
        <g transform={`translate(${cx + 12}, ${cy - bodyH * 0.92 - 22})`}>
          <rect
            x={-Math.max(44, speechBubble.length * 11 + 20)}
            y={-22}
            width={Math.max(88, speechBubble.length * 22 + 32)}
            height={38}
            rx={12}
            fill="#FFFFFF"
            stroke={COLORS.ink}
            strokeWidth={2.5}
          />
          <polygon points="-8,15 0,27 9,15" fill="#FFFFFF" stroke={COLORS.ink} strokeWidth={2.5} strokeLinejoin="round" />
          <line x1="-6" y1="15" x2="7" y2="15" stroke="#FFFFFF" strokeWidth={4} />
          <text
            x={-Math.max(44, speechBubble.length * 11 + 20) + Math.max(88, speechBubble.length * 22 + 32) / 2}
            y={4}
            textAnchor="middle"
            fill={COLORS.ink}
            fontSize={19}
            fontWeight={800}
            fontFamily={FONT_FAMILY}
          >
            {speechBubble}
          </text>
        </g>
      )}
    </svg>
  );
};

/**
 * Manga / Comic Onomatopoeia Pop Text ("唰！", "空心入网！", "饱和度：拉满", "卡点！", "叮！", "BONK!")
 */
export const ComicPopText: React.FC<{
  text: string;
  x: number;
  y: number;
  color: string;
  scale?: number;
  rotate?: number;
  fontSize?: number;
  opacity?: number;
}> = ({ text, x, y, color, scale = 1, rotate = -4, fontSize = 36, opacity = 1 }) => {
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        fontFamily: FONT_FAMILY,
        fontWeight: 900,
        fontSize,
        color,
        WebkitTextStroke: `2.5px ${COLORS.ink}`,
        paintOrder: 'stroke fill',
        textShadow: `3px 4px 0px ${COLORS.ink}`,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 60,
        letterSpacing: 1,
      }}
    >
      {text}
    </div>
  );
};
