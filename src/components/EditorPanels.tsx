import React from 'react';
import { COLORS, FONT_FAMILY, MONO_FONT } from '../constants';
import { DiscoClaudeArt, NightCityArt, RamenArt, ShibaArt } from './SceneArtwork';

export type LeftTab = 'media' | 'transition' | 'text';
export type ClipKey = 'night' | 'ramen' | 'shiba' | 'disco';

/* ============================================================================
 * 1. TOP BAR
 * ==========================================================================*/
export const TopBar: React.FC<{
  timecode: string;
  exportState: 'idle' | 'progress' | 'done';
  exportProgress: number; // 0..99.9
  dimmed?: boolean;
}> = ({ timecode, exportState, exportProgress, dimmed = false }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        top: 10,
        right: 16,
        height: 44,
        backgroundColor: COLORS.panelBg,
        border: `2.4px solid ${COLORS.ink}`,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        boxSizing: 'border-box',
        opacity: dimmed ? 0.35 : 1,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Left: traffic lights + clapperboard + filename */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, marginRight: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ED6A5E', border: `1.5px solid ${COLORS.ink}` }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F4BF4F', border: `1.5px solid ${COLORS.ink}` }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#61C554', border: `1.5px solid ${COLORS.ink}` }} />
        </div>
        {/* Mini clapperboard */}
        <svg width="22" height="20" viewBox="0 0 24 22">
          <rect x="2" y="7" width="20" height="13" rx="2" fill={COLORS.terracotta} stroke={COLORS.ink} strokeWidth="2" />
          <path d="M 2 7 L 20 2 L 22 6 L 4 11 Z" fill="#FFFDF6" stroke={COLORS.ink} strokeWidth="1.8" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>
          小克剪辑_最终版_打死不改(3).mp4
        </span>
      </div>

      {/* Center: digital timecode + autosave */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            background: '#22201E',
            color: '#F8F6F0',
            fontFamily: MONO_FONT,
            fontSize: 16,
            fontWeight: 700,
            padding: '5px 18px',
            borderRadius: 8,
            letterSpacing: 1,
          }}
        >
          {timecode}
        </div>
        <span style={{ fontSize: 12, color: COLORS.inkMuted }}>· 已自动保存</span>
      </div>

      {/* Right: 1080p badge + Export button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            border: `2px solid ${COLORS.ink}`,
            borderRadius: 8,
            padding: '3px 12px',
            fontSize: 13,
            fontWeight: 700,
            background: '#F4F1E8',
            color: COLORS.ink,
          }}
        >
          1080p
        </div>
        <div
          style={{
            position: 'relative',
            width: 150,
            height: 30,
            border: `2.2px solid ${COLORS.ink}`,
            borderRadius: 9,
            overflow: 'hidden',
            background:
              exportState === 'done'
                ? COLORS.greenDone
                : exportState === 'progress'
                ? '#FFF3C4'
                : COLORS.teal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14,
            color: exportState === 'progress' ? COLORS.ink : '#FFFFFF',
          }}
        >
          {exportState === 'progress' && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.min(100, exportProgress)}%`,
                background: COLORS.yellow,
              }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 2 }}>
            {exportState === 'idle' && '↑ 导出'}
            {exportState === 'progress' && `导出中 ${exportProgress.toFixed(1)}%`}
            {exportState === 'done' && '完成 ✓'}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. LEFT PANEL (素材 / 转场 / 文字)
 * ==========================================================================*/
export const LeftPanel: React.FC<{
  activeTab: LeftTab;
  frame: number;
  highlightClip?: ClipKey | null;
  dimmed?: boolean;
}> = ({ activeTab, frame, highlightClip = null, dimmed = false }) => {
  const tabs: Array<{ id: LeftTab; label: string }> = [
    { id: 'media', label: '素材' },
    { id: 'transition', label: '转场' },
    { id: 'text', label: '文字' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 20,
        top: 66,
        width: 262,
        height: 312,
        backgroundColor: COLORS.panelBg,
        border: `2.4px solid ${COLORS.ink}`,
        borderRadius: 14,
        padding: 12,
        boxSizing: 'border-box',
        opacity: dimmed ? 0.3 : 1,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {tabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <div
              key={t.id}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '4px 0',
                fontSize: 13,
                fontWeight: 800,
                borderRadius: 8,
                border: `2px solid ${active ? COLORS.ink : COLORS.borderGray}`,
                background: active ? COLORS.yellow : '#F1EEE4',
                color: active ? COLORS.ink : COLORS.inkMuted,
              }}
            >
              {t.label}
            </div>
          );
        })}
      </div>

      {/* Tab 1: 素材 */}
      {activeTab === 'media' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { id: 'night' as ClipKey, name: '夜景.mp4', dur: '2.4s', art: <NightCityArt frame={frame} /> },
            { id: 'ramen' as ClipKey, name: '拉面.mp4', dur: '4.6s', art: <RamenArt frame={frame} /> },
            { id: 'shiba' as ClipKey, name: '柴犬.mov', dur: '2.4s', art: <ShibaArt frame={frame} /> },
            { id: 'disco' as ClipKey, name: '小克蹦迪.mp4', dur: '2.8s', art: <DiscoClaudeArt frame={frame} /> },
          ].map((item) => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 66,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: `2.2px solid ${highlightClip === item.id ? COLORS.yellow : COLORS.ink}`,
                  boxShadow: highlightClip === item.id ? `0 0 0 2px ${COLORS.yellow}` : 'none',
                }}
              >
                {item.art}
                <span
                  style={{
                    position: 'absolute',
                    right: 4,
                    bottom: 3,
                    background: 'rgba(20,20,20,0.75)',
                    color: '#FFFFFF',
                    fontSize: 10,
                    padding: '1px 4px',
                    borderRadius: 4,
                    fontFamily: MONO_FONT,
                  }}
                >
                  {item.dur}
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.ink, marginTop: 3 }}>{item.name}</span>
            </div>
          ))}
          {[0, 1].map((idx) => (
            <div
              key={idx}
              style={{
                height: 62,
                borderRadius: 8,
                border: `1.8px dashed ${COLORS.borderGray}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A59E92',
                fontSize: 22,
              }}
            >
              <span>+</span>
              <span style={{ fontSize: 10 }}>导入素材</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: 转场 */}
      {activeTab === 'transition' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { name: '旋转', bg: '#E6E2FA', icon: '🌀' },
            { name: '翻页', bg: '#E9F2E8', icon: '📄' },
            { name: '故障', bg: '#FCE3EC', icon: '⚡' },
            { name: '缩放', bg: '#E0F2FC', icon: '🔍' },
            { name: '滑动', bg: '#FEF4D8', icon: '⏩' },
            { name: '溶解', bg: '#EFEAF5', icon: '✨' },
          ].map((tr) => (
            <div key={tr.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: 62,
                  borderRadius: 9,
                  background: tr.bg,
                  border: `2px solid ${COLORS.ink}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                }}
              >
                {tr.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.ink, marginTop: 3 }}>{tr.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: 文字 */}
      {activeTab === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              height: 74,
              borderRadius: 10,
              border: `2px solid ${COLORS.ink}`,
              background: '#FFF8DF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 900,
              color: COLORS.yellow,
              WebkitTextStroke: `2px ${COLORS.ink}`,
              paintOrder: 'stroke fill',
              textShadow: `2px 3px 0 ${COLORS.ink}`,
            }}
          >
            前方高能
          </div>
          <div
            style={{
              height: 74,
              borderRadius: 10,
              border: `2px solid ${COLORS.ink}`,
              background: '#FCEBF2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                background: '#FFFFFF',
                border: '2px solid #E58EA8',
                borderRadius: 20,
                padding: '4px 20px',
                fontSize: 22,
                fontWeight: 800,
                color: '#D95D84',
              }}
            >
              好耶~
            </span>
          </div>
          <div
            style={{
              height: 74,
              borderRadius: 10,
              border: `2px solid ${COLORS.ink}`,
              background: '#2C2738',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: '#F5E6FF',
              textShadow: '0 0 12px #E056FD, 0 0 22px #9B5DE5',
            }}
          >
            霓虹 NEON
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 3. RIGHT PANEL (调整 ✦)
 * ==========================================================================*/
export const RightPanel: React.FC<{
  flashVal: number; // 0..100
  satVal: number; // 0..220 (over 180 = 爆表!!)
  zoomVal: number; // 0..100
  speedVal: number; // 0.5..2.0
  drawProgress: number; // 0..1 for Act 1 pencil outline draw
  dimmed?: boolean;
}> = ({ flashVal, satVal, zoomVal, speedVal, drawProgress, dimmed = false }) => {
  const isOverflow = satVal > 180;
  const sliders = [
    { label: '闪光', valText: `${Math.round(flashVal)}%`, pct: flashVal / 100, color: COLORS.teal },
    {
      label: '饱和度',
      valText: isOverflow ? '爆表!!' : `${Math.round(satVal)}%`,
      pct: Math.min(1, satVal / 200),
      color: isOverflow ? COLORS.redAlert : COLORS.teal,
      danger: isOverflow,
    },
    { label: '缩放冲击', valText: `${Math.round(zoomVal)}%`, pct: zoomVal / 100, color: COLORS.teal },
    { label: '速度', valText: `${speedVal.toFixed(1)}x`, pct: (speedVal - 0.5) / 1.5, color: COLORS.teal },
  ];

  // Hand-drawn intro border animation
  const perimeter = 2 * (258 + 312);
  const dashOffset = perimeter * (1 - drawProgress);

  return (
    <div
      style={{
        position: 'absolute',
        right: 20,
        top: 66,
        width: 258,
        height: 312,
        opacity: dimmed ? 0.3 : 1,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Animated SVG Border for Act 1 hand-drawn reveal */}
      <svg
        width="262"
        height="316"
        viewBox="0 0 262 316"
        style={{ position: 'absolute', left: -2, top: -2, pointerEvents: 'none' }}
      >
        <rect
          x="2"
          y="2"
          width="258"
          height="312"
          rx="14"
          fill={drawProgress > 0.85 ? COLORS.panelBg : 'transparent'}
          stroke={COLORS.ink}
          strokeWidth="2.4"
          strokeDasharray={perimeter}
          strokeDashoffset={dashOffset}
        />
      </svg>

      {/* Panel contents appear once outline is mostly drawn */}
      <div
        style={{
          position: 'relative',
          padding: '14px 16px',
          opacity: drawProgress > 0.75 ? Math.min(1, (drawProgress - 0.75) * 4) : 0,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink, marginBottom: 16 }}>
          调整 <span style={{ color: COLORS.yellow }}>✦</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {sliders.map((s) => (
            <div key={s.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink }}>{s.label}</span>
                <span
                  style={{
                    fontSize: s.danger ? 15 : 13,
                    fontWeight: s.danger ? 900 : 700,
                    color: s.danger ? COLORS.redAlert : COLORS.inkMuted,
                    fontFamily: s.danger ? FONT_FAMILY : MONO_FONT,
                  }}
                >
                  {s.valText}
                </span>
              </div>
              {/* Track */}
              <div
                style={{
                  position: 'relative',
                  height: 8,
                  borderRadius: 6,
                  background: '#EEE9DD',
                  border: `1.8px solid ${COLORS.ink}`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${Math.max(0, Math.min(100, s.pct * 100))}%`,
                    background: s.color,
                    borderRadius: 4,
                  }}
                />
                {/* Thumb */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${Math.max(0, Math.min(100, s.pct * 100))}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    background: s.danger ? COLORS.yellow : '#FFFFFF',
                    border: `2.4px solid ${COLORS.ink}`,
                    boxShadow: s.danger ? '0 0 10px rgba(230,46,45,0.75)' : 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. CENTER PHONE PREVIEW
 * ==========================================================================*/
export const PhonePreview: React.FC<{
  frame: number;
  activeClip: ClipKey | 'blank';
  ramenBlurred?: boolean;
  showRamenBanner?: boolean;
  subtitleText?: string | null;
  satFilter: number; // 1 = normal, 3.2 = overcooked!
  flashOverlay: number; // 0..1
  beatPulse: number; // 0..1
  finaleProgress: number; // 0..1 (scales phone up and shows Douyin UI)
  isPlaying: boolean;
}> = ({
  frame,
  activeClip,
  ramenBlurred = false,
  showRamenBanner = false,
  subtitleText = null,
  satFilter,
  flashOverlay,
  beatPulse,
  finaleProgress,
  isPlaying,
}) => {
  const scale = 1 + finaleProgress * 0.48 + beatPulse * 0.035;
  const topY = 62 + finaleProgress * 82;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: topY,
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: 'top center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: finaleProgress > 0.1 ? 45 : 15,
      }}
    >
      {/* Phone Bezel */}
      <div
        style={{
          position: 'relative',
          width: 196,
          height: 294,
          borderRadius: 28,
          background: '#1E1D1B',
          padding: 8,
          boxSizing: 'border-box',
          boxShadow: '0 10px 26px rgba(35,31,29,0.2)',
        }}
      >
        {/* Screen */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 21,
            overflow: 'hidden',
            background: '#181716',
            filter: `saturate(${satFilter}) brightness(${1 + flashOverlay * 0.28})`,
          }}
        >
          {activeClip === 'night' && <NightCityArt frame={frame} />}
          {activeClip === 'ramen' && (
            <RamenArt frame={frame} blurred={ramenBlurred} showRamenBanner={showRamenBanner} />
          )}
          {activeClip === 'shiba' && <ShibaArt frame={frame} beatPulse={beatPulse} />}
          {activeClip === 'disco' && <DiscoClaudeArt frame={frame} beatPulse={beatPulse} />}

          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: 7,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 34,
              height: 8,
              borderRadius: 6,
              background: '#161514',
              zIndex: 10,
            }}
          />

          {/* Subtitle overlay ("前方高能" / "前方高能预警") */}
          {subtitleText && finaleProgress < 0.2 && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 54,
                transform: 'translateX(-50%)',
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontSize: 22,
                color: COLORS.yellow,
                WebkitTextStroke: `2px ${COLORS.ink}`,
                paintOrder: 'stroke fill',
                textShadow: `2px 3px 0 ${COLORS.ink}`,
                whiteSpace: 'nowrap',
                zIndex: 12,
              }}
            >
              {subtitleText}
            </div>
          )}

          {/* Finale Short-Video Social Overlay ("拿捏了！", likes, comments, hashtags) */}
          {finaleProgress > 0.25 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: Math.min(1, (finaleProgress - 0.25) * 2),
                fontFamily: FONT_FAMILY,
                pointerEvents: 'none',
              }}
            >
              {/* Big Gold "拿捏了！" */}
              <div
                style={{
                  position: 'absolute',
                  left: '48%',
                  top: 78,
                  transform: `translate(-50%, -50%) rotate(-4deg) scale(${0.96 + Math.sin(frame * 0.2) * 0.04})`,
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#FFE055',
                  WebkitTextStroke: `2.4px ${COLORS.ink}`,
                  paintOrder: 'stroke fill',
                  textShadow: `3px 4px 0 ${COLORS.ink}`,
                  whiteSpace: 'nowrap',
                }}
              >
                拿捏了!
              </div>

              {/* Right vertical social icons */}
              <div
                style={{
                  position: 'absolute',
                  right: 7,
                  top: 56,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 800,
                  textShadow: '0 1px 3px rgba(0,0,0,0.85)',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: COLORS.terracotta,
                    border: '2px solid #FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                  }}
                >
                  ••
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, lineHeight: 1 }}>🩷</div>
                  <div>10.2w</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 17, lineHeight: 1 }}>💬</div>
                  <div>2333</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, lineHeight: 1 }}>↪️</div>
                  <div>分享</div>
                </div>
              </div>

              {/* Bottom caption */}
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  bottom: 10,
                  right: 10,
                  color: '#FFFFFF',
                  textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800 }}>@小克 · Opus 5.5</div>
                <div style={{ fontSize: 9, opacity: 0.92 }}>#AI剪辑 #卡点 #code2video</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playback controls below phone (hidden in finale) */}
      {finaleProgress < 0.2 && (
        <div
          style={{
            marginTop: 7,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: COLORS.inkMuted,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span>⏮</span>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: `1.8px solid ${COLORS.ink}`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.ink,
              fontSize: 11,
              background: '#FFFDF8',
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </span>
          <span>⏭</span>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 5. BOTTOM TIMELINE PANEL
 * ==========================================================================*/
export const TimelinePanel: React.FC<{
  frame: number;
  clipsVisible: number; // 0..4
  bgmProgress: number; // 0..1
  playheadX: number; // 0..1080 inside track area
  deadAirState: 'intact' | 'highlighted' | 'dropping' | 'gone';
  trashDropProgress: number; // 0..1
  rippleProgress: number; // 0..1
  transitionsPlaced: number; // 0..3
  textClipText: string | null;
  beatMarkersCount: number; // 0..30
  showBeatButton: boolean;
  dimmed?: boolean;
}> = ({
  frame,
  clipsVisible,
  bgmProgress,
  playheadX,
  deadAirState,
  trashDropProgress,
  rippleProgress,
  transitionsPlaced,
  textClipText,
  beatMarkersCount,
  showBeatButton,
  dimmed = false,
}) => {
  // Base widths in px
  const wNight = 190;
  const wRamenA = 140;
  const wDeadAir = deadAirState === 'gone' ? 0 : 120 * (1 - rippleProgress);
  const wRamenB = 74;
  const wShiba = 190;
  const wDisco = 210;

  const seam1X = wNight;
  const seam2X = wNight + wRamenA + wDeadAir + wRamenB;
  const seam3X = seam2X + wShiba;

  return (
    <div
      style={{
        position: 'absolute',
        left: 20,
        right: 20,
        top: 392,
        height: 314,
        backgroundColor: COLORS.panelBg,
        border: `2.4px solid ${COLORS.ink}`,
        borderRadius: 14,
        boxSizing: 'border-box',
        opacity: dimmed ? 0.3 : 1,
        fontFamily: FONT_FAMILY,
        overflow: 'visible',
      }}
    >
      {/* Time Ruler */}
      <div
        style={{
          height: 38,
          borderBottom: `1.8px solid ${COLORS.borderGray}`,
          marginLeft: 66,
          marginRight: 20,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingBottom: 4,
        }}
      >
        {['0:00', '0:02', '0:04', '0:06', '0:08', '0:10', '0:12', '0:14', '0:16'].map((t) => (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: COLORS.inkMuted, fontFamily: MONO_FONT }}>{t}</span>
            <div style={{ width: 1.5, height: 7, background: COLORS.inkMuted, marginTop: 2 }} />
          </div>
        ))}
      </div>

      {/* Track Headers (Left column) */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          top: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 32,
            borderRadius: 8,
            background: '#FEF4CC',
            border: `2px solid ${COLORS.ink}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 15,
          }}
        >
          T
        </div>
        <div
          style={{
            width: 36,
            height: 70,
            borderRadius: 8,
            background: '#E5F5ED',
            border: `2px solid ${COLORS.ink}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          ▶
        </div>
        <div
          style={{
            width: 36,
            height: 44,
            borderRadius: 8,
            background: '#ECE8FB',
            border: `2px solid ${COLORS.ink}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
          }}
        >
          ♪
        </div>
      </div>

      {/* Tracks Area */}
      <div style={{ position: 'absolute', left: 66, right: 20, top: 48, bottom: 30 }}>
        {/* Row 1: Text Track */}
        <div style={{ height: 34, position: 'relative' }}>
          {textClipText && (
            <div
              style={{
                position: 'absolute',
                left: seam2X,
                top: 2,
                width: wShiba,
                height: 28,
                borderRadius: 7,
                background: COLORS.yellow,
                border: `2.2px solid ${COLORS.ink}`,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10,
                fontSize: 13,
                fontWeight: 800,
                color: COLORS.ink,
                boxSizing: 'border-box',
              }}
            >
              T {textClipText}
            </div>
          )}
        </div>

        {/* Row 2: Video Track */}
        <div style={{ height: 74, marginTop: 10, position: 'relative', display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Clip 1: 夜景.mp4 */}
          {clipsVisible >= 1 && (
            <div
              style={{
                width: wNight,
                height: 68,
                borderRadius: 9,
                border: `2.4px solid ${COLORS.ink}`,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <NightCityArt frame={frame} />
              <span
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 5,
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 5,
                  padding: '1px 6px',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                夜景.mp4
              </span>
            </div>
          )}

          {/* Clip 2: 拉面.mp4 (Split into Part A + DeadAir + Part B) */}
          {clipsVisible >= 2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: deadAirState === 'intact' ? 0 : 3, flexShrink: 0 }}>
              {/* Ramen A */}
              <div
                style={{
                  width: wRamenA,
                  height: 68,
                  borderRadius: deadAirState === 'intact' ? '9px 0 0 9px' : 9,
                  border: `2.4px solid ${COLORS.ink}`,
                  borderRight: deadAirState === 'intact' ? 'none' : `2.4px solid ${COLORS.ink}`,
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#F7E3AD',
                }}
              >
                <RamenArt frame={frame} />
                <span
                  style={{
                    position: 'absolute',
                    left: 6,
                    top: 5,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: 5,
                    padding: '1px 6px',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  拉面.mp4
                </span>
              </div>

              {/* Dead-air middle chunk */}
              {deadAirState !== 'gone' && wDeadAir > 4 && (
                <div
                  style={{
                    width: wDeadAir,
                    height: 68,
                    borderRadius: deadAirState === 'dropping' ? 8 : 0,
                    border: `2.4px solid ${COLORS.ink}`,
                    borderLeft: deadAirState === 'intact' ? 'none' : `2.4px solid ${COLORS.ink}`,
                    borderRight: deadAirState === 'intact' ? 'none' : `2.4px solid ${COLORS.ink}`,
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#8E8B84',
                    transform:
                      deadAirState === 'dropping'
                        ? `translateY(${trashDropProgress * 120}px) rotate(${trashDropProgress * 28}deg) scale(${1 - trashDropProgress * 0.45})`
                        : 'none',
                    opacity: deadAirState === 'dropping' ? Math.max(0, 1 - trashDropProgress * 1.1) : 1,
                    zIndex: deadAirState === 'dropping' ? 25 : 2,
                  }}
                >
                  <RamenArt frame={frame} blurred />
                  {deadAirState === 'highlighted' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'repeating-linear-gradient(-45deg, rgba(255,255,255,0.12), rgba(255,255,255,0.12) 6px, rgba(0,0,0,0.18) 6px, rgba(0,0,0,0.18) 12px)',
                        border: '2px dashed #FFD166',
                      }}
                    />
                  )}
                </div>
              )}

              {/* Ramen B */}
              <div
                style={{
                  width: wRamenB,
                  height: 68,
                  borderRadius: deadAirState === 'intact' ? '0 9px 9px 0' : 9,
                  border: `2.4px solid ${COLORS.ink}`,
                  borderLeft: deadAirState === 'intact' ? 'none' : `2.4px solid ${COLORS.ink}`,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <RamenArt frame={frame + 12} />
              </div>
            </div>
          )}

          {/* Clip 3: 柴犬.mov */}
          {clipsVisible >= 3 && (
            <div
              style={{
                width: wShiba,
                height: 68,
                borderRadius: 9,
                border: `2.4px solid ${COLORS.ink}`,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                display: 'flex',
              }}
            >
              <div style={{ flex: 1, overflow: 'hidden' }}><ShibaArt frame={frame} /></div>
              <div style={{ flex: 1, overflow: 'hidden', borderLeft: '1px solid rgba(0,0,0,0.15)' }}><ShibaArt frame={frame + 8} /></div>
              <span
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 5,
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 5,
                  padding: '1px 6px',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                柴犬.mov
              </span>
            </div>
          )}

          {/* Clip 4: 小克蹦迪.mp4 */}
          {clipsVisible >= 4 && (
            <div
              style={{
                width: wDisco,
                height: 68,
                borderRadius: 9,
                border: `2.4px solid ${COLORS.ink}`,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                display: 'flex',
              }}
            >
              <div style={{ flex: 1, overflow: 'hidden' }}><DiscoClaudeArt frame={frame} /></div>
              <div style={{ flex: 1, overflow: 'hidden', borderLeft: '1px solid rgba(0,0,0,0.2)' }}><DiscoClaudeArt frame={frame + 10} /></div>
              <span
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 5,
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 5,
                  padding: '1px 6px',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                小克蹦迪.mp4
              </span>
            </div>
          )}

          {/* Transition Badges on clip seams */}
          {transitionsPlaced >= 1 && (
            <div
              style={{
                position: 'absolute',
                left: seam1X - 11,
                top: 22,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: `2.2px solid ${COLORS.ink}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                zIndex: 15,
              }}
            >
              🌀
            </div>
          )}
          {transitionsPlaced >= 2 && (
            <div
              style={{
                position: 'absolute',
                left: seam2X - 4,
                top: 22,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: `2.2px solid ${COLORS.ink}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                zIndex: 15,
              }}
            >
              📄
            </div>
          )}
          {transitionsPlaced >= 3 && (
            <div
              style={{
                position: 'absolute',
                left: seam3X + 2,
                top: 22,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: `2.2px solid ${COLORS.ink}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                zIndex: 15,
              }}
            >
              ⚡
            </div>
          )}
        </div>

        {/* Row 3: Audio Track + Beat Sync Button */}
        <div style={{ height: 46, marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          {bgmProgress > 0.02 && (
            <div
              style={{
                width: `${Math.min(1, bgmProgress) * (showBeatButton ? 88 : 98)}%`,
                height: 40,
                borderRadius: 9,
                background: COLORS.purpleTrack,
                border: `2.2px solid ${COLORS.ink}`,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                gap: 3,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 8,
                  top: 3,
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#463C7A',
                  zIndex: 3,
                }}
              >
                ♪ bgm_小克.wav
              </span>
              {Array.from({ length: 135 }).map((_, i) => {
                const h = 8 + Math.abs(Math.sin(i * 0.65 + 1.2) * Math.cos(i * 0.23)) * 22;
                return (
                  <div
                    key={i}
                    style={{
                      width: 3,
                      height: h,
                      borderRadius: 2,
                      background: COLORS.purpleWave,
                      flexShrink: 0,
                      opacity: 0.85,
                    }}
                  />
                );
              })}
            </div>
          )}

          {showBeatButton && (
            <div
              style={{
                padding: '7px 18px',
                borderRadius: 10,
                background: COLORS.yellow,
                border: `2.4px solid ${COLORS.ink}`,
                fontWeight: 900,
                fontSize: 15,
                color: COLORS.ink,
                whiteSpace: 'nowrap',
                boxShadow: `2px 3px 0 ${COLORS.ink}`,
              }}
            >
              ▽ 卡点
            </div>
          )}
        </div>

        {/* Row 4: Yellow Beat Marker Triangles */}
        {beatMarkersCount > 0 && (
          <div style={{ display: 'flex', gap: 24, marginTop: 8, paddingLeft: 4 }}>
            {Array.from({ length: beatMarkersCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `11px solid ${COLORS.yellow}`,
                  filter: `drop-shadow(0 0 1px ${COLORS.ink})`,
                }}
              />
            ))}
          </div>
        )}

        {/* Pop-up Metallic Trash Can (Act 3) */}
        {deadAirState === 'dropping' && (
          <svg
            width="94"
            height="108"
            viewBox="0 0 94 108"
            style={{
              position: 'absolute',
              left: 356,
              top: 78,
              zIndex: 30,
              transform: `scale(${Math.min(1, trashDropProgress * 3.2)})`,
            }}
          >
            {/* Swinging Lid */}
            <g transform={`translate(74, 24) rotate(${-58 * (1 - Math.max(0, trashDropProgress - 0.65) * 2.8)})`}>
              <ellipse cx="-27" cy="0" rx="30" ry="7" fill="#C4C9CE" stroke={COLORS.ink} strokeWidth="2.6" />
              <rect x="-34" y="-9" width="14" height="5" rx="2" fill="#9FA6AE" stroke={COLORS.ink} strokeWidth="2" />
            </g>
            {/* Bin Body */}
            <polygon
              points="18,26 76,26 68,98 26,98"
              fill="#B9BFC5"
              stroke={COLORS.ink}
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <ellipse cx="47" cy="26" rx="29" ry="7" fill="#2E3033" stroke={COLORS.ink} strokeWidth="2.6" />
            <line x1="32" y1="36" x2="35" y2="90" stroke="#858C94" strokeWidth="3" strokeLinecap="round" />
            <line x1="47" y1="36" x2="47" y2="90" stroke="#858C94" strokeWidth="3" strokeLinecap="round" />
            <line x1="62" y1="36" x2="59" y2="90" stroke="#858C94" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {/* Playhead Needle */}
        <div
          style={{
            position: 'absolute',
            left: playheadX,
            top: -12,
            bottom: 8,
            width: 2.5,
            background: COLORS.redPlayhead,
            zIndex: 35,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -8,
              top: -6,
              width: 18,
              height: 18,
              background: COLORS.redPlayhead,
              border: `2px solid ${COLORS.ink}`,
              borderRadius: '4px 4px 8px 8px',
            }}
          />
        </div>

        {/* Dead-air callout bubble ("这段在发呆 zzz") */}
        {deadAirState === 'highlighted' && (
          <div
            style={{
              position: 'absolute',
              left: 318,
              top: -6,
              background: '#FFFFFF',
              border: `2.2px solid ${COLORS.ink}`,
              borderRadius: 10,
              padding: '5px 14px',
              fontSize: 14,
              fontWeight: 800,
              color: COLORS.ink,
              zIndex: 38,
              boxShadow: `2px 3px 0 rgba(0,0,0,0.12)`,
            }}
          >
            这段在发呆 zzz
          </div>
        )}
      </div>

      {/* Bottom footer info */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 6,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: COLORS.inkMuted,
        }}
      >
        <span>— ○ — +</span>
        <span>片段 {clipsVisible} · 总时长 {clipsVisible >= 4 ? '0:10.5' : '0:00'}</span>
      </div>
    </div>
  );
};
