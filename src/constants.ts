import { Easing, interpolate } from 'remotion';

export const WIDTH = 1280;
export const HEIGHT = 720;
export const FPS = 30;
export const TOTAL_FRAMES = 900; // 30 seconds

export const COLORS = {
  bgPaper: '#F5F2E9',
  panelBg: '#FDFBF5',
  ink: '#231F1D',
  inkMuted: '#6D665E',
  terracotta: '#D96A50',
  terracottaDark: '#BE533B',
  terracottaLight: '#EA866E',
  yellow: '#F5C94C',
  yellowSoft: '#FEF3D1',
  teal: '#6DC0B3',
  greenDone: '#79D488',
  greenStamp: '#4E9E63',
  redPlayhead: '#E24B5B',
  redAlert: '#E62E2D',
  pinkComic: '#FF4B8B',
  purpleTrack: '#DFDAFA',
  purpleWave: '#8A7FD1',
  borderGray: '#D8D2C5',
};

export const FONT_FAMILY =
  "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', system-ui, -apple-system, sans-serif";

export const MONO_FONT =
  "'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, monospace";

/**
 * 9-Act choreography timeline (in frames @ 30fps)
 */
export const ACTS = {
  // Act 1: Terminal typing -> UI hand-drawn reveal
  TERM_START: 0,
  TERM_MORPH: 26,
  UI_READY: 54,

  // Act 2: Mascot jumps in ("开工!"), drags 4 clips + BGM
  MASCOT_IN: 56,
  DRAG_CLIP1: 66,
  DRAG_CLIP2: 86,
  DRAG_CLIP3: 106,
  DRAG_CLIP4: 126,
  BGM_IN: 140,

  // Act 3: Zoom left-bottom, spot dead-air ("这段在发呆 zzz"), knife cut ("唰！唰！"), trash can
  CUT_ZOOM_IN: 162,
  DEAD_AIR_SPOT: 174,
  KNIFE_SLASH_1: 196,
  KNIFE_SLASH_2: 210,
  TRASH_DROP: 222,
  RIPPLE_CLOSE: 242,

  // Act 4: Switch to Transitions tab, basketball arc throw ("空心入网！")
  TRANS_TAB: 262,
  THROW_T1: 274,
  THROW_T2: 298,
  THROW_T3: 320,

  // Act 5: Switch to Text tab, drag "前方高能", Undo (Ctrl+Z), fix to "前方高能预警" + "已修正" stamp
  TEXT_TAB: 348,
  TEXT_DRAG: 362,
  TEXT_TYPO_WAIT: 388,
  UNDO_PRESS: 404,
  TEXT_FIXED: 432,
  STAMP_HIT: 444,

  // Act 6: Pan right to Adjust panel, drag Flash 70%, Saturation 爆表!! -> dizzy -> dial back 110%, Zoom Punch 60%
  ADJUST_PAN: 468,
  SLIDE_FLASH: 482,
  SLIDE_SAT_MAX: 506,
  SAT_DIZZY_HOLD: 534,
  SLIDE_SAT_BACK: 554,
  SLIDE_ZOOM: 572,

  // Act 7: Zoom out to full view, beat sync ("卡点！") + sunglasses disco bounce
  BEAT_ZOOM_OUT: 602,
  BEAT_CLICK: 624,
  BEAT_PARTY_END: 710,

  // Act 8: Zoom top-right, stretch arm to Export -> 99.9% suspense -> Done + Confetti + BONK!
  EXPORT_ZOOM: 714,
  EXPORT_CLICK: 730,
  EXPORT_99: 752,
  EXPORT_DONE: 778,

  // Act 9: Finale poster — dimmed editor, centered phone with Douyin UI ("拿捏了！"), sticky note ("30 秒剪完，Opus 5.5 — 小克")
  FINALE_START: 808,
  FINALE_END: 900,
};

export interface CameraState {
  scale: number;
  tx: number; // translateX in px before/after center
  ty: number;
}

const smooth = (frame: number, start: number, end: number, from: number, to: number) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/**
 * Virtual Camera Rig — keeps a single editor canvas feeling cinematic and alive
 * by pushing in on each micro-action and pulling back for wide rhythm beats.
 */
export function getCameraState(frame: number): CameraState {
  // Keyframe waypoints: [frame, scale, tx, ty]
  // tx/ty shift the stage relative to center (640, 360)
  const waypoints: Array<[number, number, number, number]> = [
    [0, 1.0, 0, 0],
    [156, 1.0, 0, 0],
    // Act 3: Focus bottom-left (timeline + ramen preview)
    [176, 1.2, 85, -46],
    [252, 1.2, 85, -46],
    // Act 4: Slight pan up-left to see Transitions tab + timeline
    [270, 1.2, 96, -24],
    [340, 1.2, 96, -24],
    // Act 5: Center on Text tab + Phone + Timeline middle
    [360, 1.24, 18, -28],
    [462, 1.24, 18, -28],
    // Act 6: Pan right to Phone + Adjust sliders
    [484, 1.22, -96, 10],
    [594, 1.22, -96, 10],
    // Act 7: Pull back to full editor for Beat Sync party
    [618, 1.0, 0, 0],
    [708, 1.0, 0, 0],
    // Act 8: Push to top-right Export button + Phone + Mascot
    [730, 1.2, -98, 38],
    [800, 1.2, -98, 38],
    // Act 9: Pull back to 1.0x for Finale Poster
    [822, 1.0, 0, 0],
    [900, 1.0, 0, 0],
  ];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const [f0, s0, x0, y0] = waypoints[i];
    const [f1, s1, x1, y1] = waypoints[i + 1];
    if (frame >= f0 && frame <= f1) {
      if (f0 === f1) return { scale: s1, tx: x1, ty: y1 };
      return {
        scale: smooth(frame, f0, f1, s0, s1),
        tx: smooth(frame, f0, f1, x0, x1),
        ty: smooth(frame, f0, f1, y0, y1),
      };
    }
  }
  return { scale: 1, tx: 0, ty: 0 };
}

export function formatTimecode(frame: number): string {
  const sec = Math.floor(frame / FPS);
  const f = frame % FPS;
  const ss = String(sec).padStart(2, '0');
  const ff = String(f).padStart(2, '0');
  return `00:00:${ss}:${ff}`;
}
