import React from 'react';
import { Easing, interpolate } from 'remotion';
import { COLORS, FONT_FAMILY, MONO_FONT } from '../constants';

/**
 * Act 1: Hand-drawn Terminal Window ("小克.js — 终端") typing `const 剪辑软件 = 小克.写代码()`
 */
export const TerminalIntro: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame > 34) return null;

  const fullCode = 'const 剪辑软件 = 小克.写代码()';
  const chars = Math.min(
    fullCode.length,
    Math.floor(interpolate(frame, [2, 23], [1, fullCode.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  );
  const typed = fullCode.slice(0, chars);

  // Morph out into editor
  const morph = interpolate(frame, [25, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const scaleX = 1 + morph * 0.9;
  const scaleY = 1 + morph * 1.4;
  const opacity = 1 - morph;

  // Colorize segments cleanly
  const renderTokens = (str: string) => {
    const parts: Array<{ text: string; color: string }> = [
      { text: 'const ', color: '#7D63D9' },
      { text: '剪辑软件', color: '#47A396' },
      { text: ' = ', color: COLORS.ink },
      { text: '小克', color: COLORS.terracotta },
      { text: '.写代码()', color: COLORS.ink },
    ];
    let remaining = str.length;
    return parts.map((p, idx) => {
      if (remaining <= 0) return null;
      const slice = p.text.slice(0, remaining);
      remaining -= slice.length;
      return (
        <span key={idx} style={{ color: p.color }}>
          {slice}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 80,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 650,
          height: 204,
          borderRadius: 12,
          border: `2.6px solid ${COLORS.ink}`,
          background: COLORS.panelBg,
          boxShadow: '0 14px 36px rgba(35,31,29,0.12)',
          overflow: 'hidden',
          transform: `scale(${scaleX}, ${scaleY})`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 36,
            background: '#EFECE2',
            borderBottom: `1.8px solid ${COLORS.borderGray}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: FONT_FAMILY,
            fontSize: 13,
            color: COLORS.inkMuted,
            fontWeight: 600,
          }}
        >
          <div style={{ position: 'absolute', left: 14, display: 'flex', gap: 7 }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ED6A5E', border: `1.5px solid ${COLORS.ink}` }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#F4BF4F', border: `1.5px solid ${COLORS.ink}` }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#61C554', border: `1.5px solid ${COLORS.ink}` }} />
          </div>
          小克.js — 终端
        </div>

        {/* Code lines */}
        <div style={{ padding: '22px 26px', fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ fontFamily: MONO_FONT, fontSize: 15, color: '#A59E92', width: 14 }}>1</span>
            <span>
              {renderTokens(typed)}
              <span
                style={{
                  display: 'inline-block',
                  width: 11,
                  height: 28,
                  background: COLORS.terracotta,
                  marginLeft: 3,
                  verticalAlign: 'middle',
                  opacity: Math.floor(frame / 6) % 2 === 0 ? 1 : 0.2,
                }}
              />
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14 }}>
            <span style={{ fontFamily: MONO_FONT, fontSize: 15, color: '#A59E92', width: 14 }}>2</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14 }}>
            <span style={{ fontFamily: MONO_FONT, fontSize: 15, color: '#A59E92', width: 14 }}>3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Act 5: Chunky Mechanical Keycap `Ctrl+Z` + Green Tilted Stamp `已修正`
 */
export const UndoAndStampOverlay: React.FC<{
  showUndo: boolean;
  undoPressed: number; // 0..1
  showStamp: boolean;
  stampScale: number;
}> = ({ showUndo, undoPressed, showStamp, stampScale }) => {
  return (
    <>
      {showUndo && (
        <div
          style={{
            position: 'absolute',
            left: 330,
            top: 560,
            transform: `translate(-50%, -50%) translateY(${undoPressed * 8}px)`,
            width: 196,
            height: 92,
            borderRadius: 16,
            background: '#D9D4C8',
            border: `3px solid ${COLORS.ink}`,
            boxShadow: `0 ${10 - undoPressed * 6}px 0 ${COLORS.ink}`,
            padding: 8,
            boxSizing: 'border-box',
            zIndex: 65,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 10,
              background: '#FCFBF8',
              border: `2px solid ${COLORS.ink}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: MONO_FONT,
              fontSize: 38,
              fontWeight: 900,
              color: COLORS.ink,
            }}
          >
            Ctrl+Z
          </div>
        </div>
      )}

      {showStamp && (
        <div
          style={{
            position: 'absolute',
            left: 880,
            top: 215,
            transform: `translate(-50%, -50%) rotate(-12deg) scale(${stampScale})`,
            padding: '10px 26px',
            borderRadius: 10,
            border: `4px double ${COLORS.greenStamp}`,
            color: COLORS.greenStamp,
            fontFamily: FONT_FAMILY,
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 6,
            background: 'rgba(255,255,255,0.45)',
            boxShadow: `0 0 0 2px ${COLORS.greenStamp}`,
            zIndex: 66,
            pointerEvents: 'none',
          }}
        >
          已修正
        </div>
      )}
    </>
  );
};

/**
 * Act 8 & 9: Confetti burst + Finale Taped Sticky Note ("30 秒剪完，Opus 5.5 — 小克")
 */
export const ConfettiLayer: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  if (frame < startFrame) return null;
  const elapsed = frame - startFrame;
  const palette = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#FF85A1'];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 70, overflow: 'hidden' }}>
      {Array.from({ length: 34 }).map((_, i) => {
        const seed = i * 137.5;
        const startX = 940 + ((seed % 260) - 130);
        const startY = 34;
        const vx = Math.cos(seed) * 4.2;
        const vy = 2.8 + (i % 5) * 0.9;
        const x = startX + vx * elapsed;
        const y = startY + vy * elapsed + 0.04 * elapsed * elapsed * 0.15;
        const rot = seed + elapsed * (5 + (i % 4) * 2);
        const opacity = interpolate(elapsed, [0, 95, 130], [1, 0.9, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        if (y > 760 || opacity <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: i % 2 === 0 ? 11 : 8,
              height: i % 3 === 0 ? 7 : 12,
              background: palette[i % palette.length],
              border: `1.5px solid ${COLORS.ink}`,
              borderRadius: 2,
              transform: `rotate(${rot}deg)`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

export const FinaleStickyNote: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  if (progress <= 0.01) return null;

  const line1 = '30 秒剪完，';
  const line2 = 'Opus 5.5';
  const line3 = '— 小克';

  const l1Chars = Math.floor(interpolate(progress, [0.15, 0.42], [0, line1.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const l2Chars = Math.floor(interpolate(progress, [0.42, 0.72], [0, line2.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const underlinePct = interpolate(progress, [0.7, 0.88], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const l3Opacity = interpolate(progress, [0.82, 0.96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: 44,
        top: 162,
        width: 360,
        height: 328,
        background: '#FFFDF8',
        border: `2.8px solid ${COLORS.ink}`,
        borderRadius: 12,
        boxShadow: '6px 10px 24px rgba(35,31,29,0.16)',
        transform: `rotate(-1.8deg) scale(${0.86 + progress * 0.14})`,
        opacity: Math.min(1, progress * 2.5),
        padding: '44px 32px',
        boxSizing: 'border-box',
        fontFamily: FONT_FAMILY,
        zIndex: 55,
        backgroundImage:
          'repeating-linear-gradient(transparent, transparent 34px, rgba(180,174,162,0.22) 35px)',
      }}
    >
      {/* Yellow masking tape at top */}
      <div
        style={{
          position: 'absolute',
          top: -14,
          left: '50%',
          transform: 'translateX(-50%) rotate(1.5deg)',
          width: 98,
          height: 26,
          background: 'rgba(245, 201, 76, 0.85)',
          borderRadius: 3,
        }}
      />

      <div style={{ fontSize: 34, fontWeight: 700, color: '#3E3A36', minHeight: 48 }}>
        {line1.slice(0, l1Chars)}
      </div>

      <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.ink, marginTop: 18, lineHeight: 1.1, minHeight: 74 }}>
        {line2.slice(0, l2Chars)}
      </div>

      {/* Hand-drawn red brush underline */}
      <svg width="286" height="22" viewBox="0 0 286 22" style={{ marginTop: 4 }}>
        <path
          d="M 4 15 Q 140 3 280 11"
          fill="none"
          stroke={COLORS.terracotta}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeDasharray="290"
          strokeDashoffset={290 * (1 - underlinePct)}
        />
      </svg>

      <div
        style={{
          marginTop: 22,
          textAlign: 'center',
          fontSize: 30,
          fontWeight: 700,
          color: '#5C554E',
          opacity: l3Opacity,
          transform: `translateY(${(1 - l3Opacity) * 8}px)`,
        }}
      >
        {line3}
      </div>

      {/* Subtle sparkle */}
      <div
        style={{
          position: 'absolute',
          right: 22,
          bottom: 18,
          fontSize: 20,
          color: COLORS.yellow,
          opacity: l3Opacity * (0.6 + 0.4 * Math.sin(frame * 0.25)),
        }}
      >
        ✦
      </div>
    </div>
  );
};
