import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  ACTS,
  COLORS,
  FONT_FAMILY,
  formatTimecode,
  getCameraState,
} from './constants';
import { ClaudeMascotLayer, ComicPopText, MascotMood } from './components/ClaudeMascot';
import {
  ClipKey,
  LeftPanel,
  LeftTab,
  PhonePreview,
  RightPanel,
  TimelinePanel,
  TopBar,
} from './components/EditorPanels';
import {
  ConfettiLayer,
  FinaleStickyNote,
  TerminalIntro,
  UndoAndStampOverlay,
} from './components/Overlays';
import { DiscoClaudeArt, NightCityArt, RamenArt, ShibaArt } from './components/SceneArtwork';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const ClaudeEditorMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cam = getCameraState(frame);

  // =========================================================================
  // 1. ACT 1: UI Reveal & Right Panel Pencil Draw
  // =========================================================================
  const editorOpacity = interpolate(frame, [26, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightDrawProgress = interpolate(frame, [30, 54], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // =========================================================================
  // 2. LEFT PANEL TAB & CLIPS ON TIMELINE
  // =========================================================================
  let activeTab: LeftTab = 'media';
  if (frame >= ACTS.TEXT_TAB) activeTab = 'text';
  else if (frame >= ACTS.TRANS_TAB) activeTab = 'transition';

  let clipsVisible = 0;
  if (frame >= ACTS.DRAG_CLIP1 + 14) clipsVisible = 1;
  if (frame >= ACTS.DRAG_CLIP2 + 14) clipsVisible = 2;
  if (frame >= ACTS.DRAG_CLIP3 + 14) clipsVisible = 3;
  if (frame >= ACTS.DRAG_CLIP4 + 14) clipsVisible = 4;

  const bgmProgress = interpolate(frame, [ACTS.BGM_IN, ACTS.BGM_IN + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // =========================================================================
  // 3. ACT 3: DEAD-AIR CUT & TRASH CAN & RIPPLE DELETE
  // =========================================================================
  let deadAirState: 'intact' | 'highlighted' | 'dropping' | 'gone' = 'intact';
  if (frame >= ACTS.RIPPLE_CLOSE + 12) deadAirState = 'gone';
  else if (frame >= ACTS.TRASH_DROP) deadAirState = 'dropping';
  else if (frame >= ACTS.DEAD_AIR_SPOT) deadAirState = 'highlighted';

  const trashDropProgress = interpolate(frame, [ACTS.TRASH_DROP, ACTS.TRASH_DROP + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const rippleProgress = interpolate(frame, [ACTS.RIPPLE_CLOSE, ACTS.RIPPLE_CLOSE + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.3)),
  });

  // =========================================================================
  // 4. ACT 4: TRANSITIONS THROWN IN PARABOLIC ARCS
  // =========================================================================
  let transitionsPlaced = 0;
  if (frame >= ACTS.THROW_T1 + 18) transitionsPlaced = 1;
  if (frame >= ACTS.THROW_T2 + 18) transitionsPlaced = 2;
  if (frame >= ACTS.THROW_T3 + 18) transitionsPlaced = 3;

  // =========================================================================
  // 5. ACT 5: SUBTITLE + CTRL+Z UNDO + STAMP
  // =========================================================================
  let textClipText: string | null = null;
  if (frame >= ACTS.TEXT_FIXED) textClipText = '前方高能预警';
  else if (frame >= ACTS.TEXT_DRAG + 16 && frame < ACTS.UNDO_PRESS + 14) textClipText = '前方高能';

  const showUndo = frame >= ACTS.UNDO_PRESS && frame < ACTS.STAMP_HIT + 22;
  const undoPressed =
    frame >= ACTS.UNDO_PRESS + 6 && frame <= ACTS.UNDO_PRESS + 18
      ? Math.sin(((frame - (ACTS.UNDO_PRESS + 6)) / 12) * Math.PI)
      : 0;
  const showStamp = frame >= ACTS.STAMP_HIT && frame < ACTS.ADJUST_PAN + 6;
  const stampScale = spring({
    frame: Math.max(0, frame - ACTS.STAMP_HIT),
    fps,
    config: { damping: 10, stiffness: 260 },
  });

  // =========================================================================
  // 6. ACT 6: ADJUST SLIDERS (Flash, Saturation Overflow -> Dial Back, Zoom Punch)
  // =========================================================================
  const flashVal = interpolate(frame, [ACTS.SLIDE_FLASH, ACTS.SLIDE_FLASH + 18], [0, 70], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  let satVal = 100;
  if (frame >= ACTS.SLIDE_SAT_MAX && frame < ACTS.SLIDE_SAT_BACK) {
    satVal = interpolate(frame, [ACTS.SLIDE_SAT_MAX, ACTS.SLIDE_SAT_MAX + 18], [100, 210], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  } else if (frame >= ACTS.SLIDE_SAT_BACK) {
    satVal = interpolate(frame, [ACTS.SLIDE_SAT_BACK, ACTS.SLIDE_SAT_BACK + 16], [210, 110], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  }

  const zoomVal = interpolate(frame, [ACTS.SLIDE_ZOOM, ACTS.SLIDE_ZOOM + 18], [0, 60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const satFilter = satVal > 175 ? 1 + ((satVal - 100) / 100) * 2.2 : satVal / 100;
  const flashOverlay =
    satVal > 180 ? 0.85 : flashVal > 50 && frame > ACTS.BEAT_CLICK ? Math.max(0, Math.sin(frame * 0.55) * 0.35) : 0;

  // =========================================================================
  // 7. ACT 7: BEAT SYNC & PLAYHEAD SCRUBBING
  // =========================================================================
  const showBeatButton = frame >= ACTS.BEAT_ZOOM_OUT + 10;
  const beatMarkersCount =
    frame < ACTS.BEAT_CLICK
      ? 0
      : Math.min(
          28,
          Math.floor(interpolate(frame, [ACTS.BEAT_CLICK, ACTS.BEAT_CLICK + 26], [0, 28], { extrapolateRight: 'clamp' }))
        );
  const beatPulse =
    frame >= ACTS.BEAT_CLICK && frame < ACTS.FINALE_START
      ? Math.pow(Math.max(0, Math.sin((frame - ACTS.BEAT_CLICK) * 0.52)), 4)
      : 0;

  // Playhead position across timeline
  let playheadX = 12;
  if (frame >= ACTS.DRAG_CLIP1 && frame < ACTS.DEAD_AIR_SPOT) {
    playheadX = interpolate(frame, [ACTS.DRAG_CLIP1, ACTS.DEAD_AIR_SPOT], [12, 345], { extrapolateRight: 'clamp' });
  } else if (frame >= ACTS.DEAD_AIR_SPOT && frame < ACTS.TRANS_TAB) {
    playheadX = 345;
  } else if (frame >= ACTS.TRANS_TAB && frame < ACTS.TEXT_TAB) {
    playheadX = interpolate(frame, [ACTS.TRANS_TAB, ACTS.TEXT_TAB], [220, 440], { extrapolateRight: 'clamp' });
  } else if (frame >= ACTS.TEXT_TAB && frame < ACTS.ADJUST_PAN) {
    playheadX = 505;
  } else if (frame >= ACTS.ADJUST_PAN && frame < ACTS.BEAT_ZOOM_OUT) {
    playheadX = 680;
  } else if (frame >= ACTS.BEAT_ZOOM_OUT && frame < ACTS.EXPORT_ZOOM) {
    playheadX = interpolate(frame, [ACTS.BEAT_ZOOM_OUT, ACTS.EXPORT_ZOOM], [180, 740], { extrapolateRight: 'clamp' });
  } else if (frame >= ACTS.EXPORT_ZOOM) {
    playheadX = 760;
  }

  // Active clip in Phone Preview
  let activeClip: ClipKey | 'blank' = 'blank';
  if (clipsVisible >= 1) {
    if (frame < ACTS.DRAG_CLIP2 + 16) activeClip = 'night';
    else if (frame < ACTS.THROW_T2 + 12) activeClip = 'ramen';
    else if (frame < ACTS.ADJUST_PAN - 4) activeClip = 'shiba';
    else if (frame < ACTS.BEAT_CLICK + 20) activeClip = 'disco';
    else if (frame < ACTS.BEAT_CLICK + 48) activeClip = 'shiba';
    else activeClip = 'disco';
  }
  const ramenBlurred = activeClip === 'ramen' && frame >= ACTS.DEAD_AIR_SPOT && frame < ACTS.TRASH_DROP + 8;
  const showRamenBanner = activeClip === 'ramen' && frame >= ACTS.RIPPLE_CLOSE && frame < ACTS.THROW_T2 + 12;

  // =========================================================================
  // 8. ACT 8 & 9: EXPORT PROGRESS & FINALE POSTER
  // =========================================================================
  let exportState: 'idle' | 'progress' | 'done' = 'idle';
  let exportProgress = 0;
  if (frame >= ACTS.EXPORT_DONE) {
    exportState = 'done';
    exportProgress = 100;
  } else if (frame >= ACTS.EXPORT_CLICK) {
    exportState = 'progress';
    exportProgress =
      frame < ACTS.EXPORT_99
        ? interpolate(frame, [ACTS.EXPORT_CLICK, ACTS.EXPORT_99], [8, 99.9], {
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.quad),
          })
        : 99.9;
  }

  const finaleProgress = interpolate(frame, [ACTS.FINALE_START, ACTS.FINALE_START + 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const stickyProgress = interpolate(frame, [ACTS.FINALE_START + 12, ACTS.FINALE_END - 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // =========================================================================
  // 9. MASCOT CHOREOGRAPHY (Position, Mood, Stretchy Arms, Props, Speech)
  // =========================================================================
  const mascotVisible = frame >= ACTS.MASCOT_IN;
  let mx = 200;
  let my = 438;
  let mood: MascotMood = 'normal';
  let sunglasses: 'none' | 'on' | 'forehead' = 'none';
  let leftArmTarget: { x: number; y: number } | null = null;
  let rightArmTarget: { x: number; y: number } | null = null;
  let knifeAngle: number | null = null;
  let speechBubble: string | null = null;
  let dustPuff = 0;
  let armsUp = false;
  let winkWave = false;
  let walkCycle = 0;

  if (frame >= ACTS.MASCOT_IN && frame < ACTS.CUT_ZOOM_IN) {
    // Jump in with dust puff + drag 4 clips
    const jumpSpring = spring({ frame: frame - ACTS.MASCOT_IN, fps, config: { damping: 12, stiffness: 180 } });
    my = interpolate(jumpSpring, [0, 1], [340, 444]);
    dustPuff = frame < ACTS.MASCOT_IN + 14 ? 1 - (frame - ACTS.MASCOT_IN) / 14 : 0;
    mood = frame < ACTS.DRAG_CLIP2 ? 'star' : 'normal';
    if (frame < ACTS.DRAG_CLIP1 + 14) speechBubble = '开工!';

    // Rubber-hose drag choreography for 4 clips
    const drags = [
      { start: ACTS.DRAG_CLIP1, sx: 90, sy: 145, tx: 170, ty: 510 },
      { start: ACTS.DRAG_CLIP2, sx: 210, sy: 145, tx: 350, ty: 510 },
      { start: ACTS.DRAG_CLIP3, sx: 90, sy: 235, tx: 540, ty: 510 },
      { start: ACTS.DRAG_CLIP4, sx: 210, sy: 235, tx: 720, ty: 510 },
    ];
    for (const d of drags) {
      if (frame >= d.start && frame < d.start + 16) {
        const p = (frame - d.start) / 16;
        if (p < 0.45) {
          leftArmTarget = { x: d.sx, y: d.sy };
        } else {
          const t = (p - 0.45) / 0.55;
          leftArmTarget = {
            x: interpolate(t, [0, 1], [d.sx, d.tx]),
            y: interpolate(t, [0, 1], [d.sy, d.ty]),
          };
        }
      }
    }
  } else if (frame >= ACTS.CUT_ZOOM_IN && frame < ACTS.TRANS_TAB) {
    // Act 3: Spot dead-air, draw utility knife, slash twice, clean!
    mx = 225;
    my = 442;
    mood = frame < ACTS.TRASH_DROP ? 'squint' : 'happy';
    if (frame >= ACTS.DEAD_AIR_SPOT + 8 && frame < ACTS.TRASH_DROP) {
      const slash1 = frame >= ACTS.KNIFE_SLASH_1 && frame < ACTS.KNIFE_SLASH_1 + 12;
      const slash2 = frame >= ACTS.KNIFE_SLASH_2 && frame < ACTS.KNIFE_SLASH_2 + 12;
      const targetX = slash2 ? 495 : slash1 ? 390 : 355;
      const targetY = slash1 || slash2 ? 495 : 408;
      rightArmTarget = { x: targetX, y: targetY };
      knifeAngle = slash1 || slash2 ? 25 : -42;
    }
    if (frame >= ACTS.RIPPLE_CLOSE && frame < ACTS.TRANS_TAB - 6) {
      speechBubble = '清爽!';
    }
  } else if (frame >= ACTS.TRANS_TAB && frame < ACTS.TEXT_TAB) {
    // Act 4: Basketball throw transitions!
    mx = 248;
    my = 446;
    mood = 'normal';
    const throws = [ACTS.THROW_T1, ACTS.THROW_T2, ACTS.THROW_T3];
    for (const ts of throws) {
      if (frame >= ts && frame < ts + 14) {
        rightArmTarget = { x: 278, y: 315 };
      }
    }
  } else if (frame >= ACTS.TEXT_TAB && frame < ACTS.ADJUST_PAN) {
    // Act 5: Drag text, look annoyed at typo, hit Ctrl+Z
    mx = interpolate(frame, [ACTS.TEXT_TAB, ACTS.TEXT_TAB + 16], [248, 345], { extrapolateRight: 'clamp' });
    my = 444;
    if (frame >= ACTS.TEXT_DRAG && frame < ACTS.TEXT_DRAG + 16) {
      leftArmTarget = {
        x: interpolate(frame, [ACTS.TEXT_DRAG, ACTS.TEXT_DRAG + 16], [150, 505]),
        y: interpolate(frame, [ACTS.TEXT_DRAG, ACTS.TEXT_DRAG + 16], [150, 456]),
      };
    }
    mood = frame >= ACTS.TEXT_TYPO_WAIT && frame < ACTS.TEXT_FIXED ? 'squint' : 'normal';
    if (frame >= ACTS.STAMP_HIT) mood = 'happy';
  } else if (frame >= ACTS.ADJUST_PAN && frame < ACTS.BEAT_ZOOM_OUT) {
    // Act 6: Stretch across screen to pull sliders!
    mx = interpolate(frame, [ACTS.ADJUST_PAN, ACTS.ADJUST_PAN + 16], [345, 360], { extrapolateRight: 'clamp' });
    my = 456;
    // Right panel slider coordinates in stage space (right panel is x=1002..1260)
    const sliderX = (pct: number) => 1018 + pct * 226;
    if (frame >= ACTS.SLIDE_FLASH && frame < ACTS.SLIDE_SAT_MAX) {
      rightArmTarget = { x: sliderX(flashVal / 100), y: 151 };
    } else if (frame >= ACTS.SLIDE_SAT_MAX && frame < ACTS.SLIDE_ZOOM) {
      rightArmTarget = { x: sliderX(Math.min(1, satVal / 200)), y: 205 };
    } else if (frame >= ACTS.SLIDE_ZOOM && frame < ACTS.BEAT_ZOOM_OUT - 4) {
      rightArmTarget = { x: sliderX(zoomVal / 100), y: 259 };
    }

    if (satVal > 180) {
      mood = 'dizzy';
      if (frame >= ACTS.SAT_DIZZY_HOLD) speechBubble = '……太亮了';
    } else {
      mood = 'normal';
    }
  } else if (frame >= ACTS.BEAT_ZOOM_OUT && frame < ACTS.EXPORT_ZOOM) {
    // Act 7: Sunglasses on, hop along timeline to Beat Sync!
    mx = interpolate(frame, [ACTS.BEAT_ZOOM_OUT, ACTS.BEAT_CLICK], [360, 620], {
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    });
    my = 528 - beatPulse * 14;
    sunglasses = 'on';
    mood = 'happy';
    walkCycle = frame * 0.45;
  } else if (frame >= ACTS.EXPORT_ZOOM && frame < ACTS.FINALE_START) {
    // Act 8: Stretch super-long arm to Export button, wait at 99.9%, BONK jump on Done!
    mx = interpolate(frame, [ACTS.EXPORT_ZOOM, ACTS.EXPORT_CLICK], [620, 880], { extrapolateRight: 'clamp' });
    sunglasses = 'forehead';
    if (frame >= ACTS.EXPORT_CLICK - 8 && frame < ACTS.EXPORT_99 + 4) {
      rightArmTarget = { x: 1170, y: 32 };
    }
    if (frame >= ACTS.EXPORT_99 && frame < ACTS.EXPORT_DONE) {
      mood = 'sweat';
      speechBubble = '…';
      my = 524;
    } else if (frame >= ACTS.EXPORT_DONE) {
      const bonkJump = Math.abs(Math.sin((frame - ACTS.EXPORT_DONE) * 0.32)) * 34;
      my = 524 - bonkJump;
      mood = 'happy';
      armsUp = true;
      dustPuff = frame < ACTS.EXPORT_DONE + 14 ? 1 - (frame - ACTS.EXPORT_DONE) / 14 : 0;
    } else {
      my = 524;
    }
  } else if (frame >= ACTS.FINALE_START) {
    // Act 9: Finale pose bottom-right, sunglasses on forehead, winking & waving
    mx = interpolate(frame, [ACTS.FINALE_START, ACTS.FINALE_START + 20], [880, 1020], { extrapolateRight: 'clamp' });
    my = 536;
    sunglasses = 'forehead';
    mood = 'wink';
    winkWave = true;
  }

  // Highlighted clip during Act 2 drags
  let highlightClip: ClipKey | null = null;
  if (frame >= ACTS.DRAG_CLIP1 && frame < ACTS.DRAG_CLIP1 + 16) highlightClip = 'night';
  else if (frame >= ACTS.DRAG_CLIP2 && frame < ACTS.DRAG_CLIP2 + 16) highlightClip = 'ramen';
  else if (frame >= ACTS.DRAG_CLIP3 && frame < ACTS.DRAG_CLIP3 + 16) highlightClip = 'shiba';
  else if (frame >= ACTS.DRAG_CLIP4 && frame < ACTS.DRAG_CLIP4 + 16) highlightClip = 'disco';

  // Floating dragged thumbnail during Act 2
  const renderDraggedClip = () => {
    const drags: Array<{ start: number; sx: number; sy: number; tx: number; ty: number; art: React.ReactNode }> = [
      { start: ACTS.DRAG_CLIP1, sx: 90, sy: 145, tx: 170, ty: 510, art: <NightCityArt frame={frame} /> },
      { start: ACTS.DRAG_CLIP2, sx: 210, sy: 145, tx: 350, ty: 510, art: <RamenArt frame={frame} /> },
      { start: ACTS.DRAG_CLIP3, sx: 90, sy: 235, tx: 540, ty: 510, art: <ShibaArt frame={frame} /> },
      { start: ACTS.DRAG_CLIP4, sx: 210, sy: 235, tx: 720, ty: 510, art: <DiscoClaudeArt frame={frame} /> },
    ];
    for (const d of drags) {
      if (frame >= d.start + 6 && frame < d.start + 15) {
        const t = (frame - (d.start + 6)) / 9;
        const x = interpolate(t, [0, 1], [d.sx, d.tx]);
        const y = interpolate(t, [0, 1], [d.sy, d.ty]) - Math.sin(t * Math.PI) * 35;
        return (
          <div
            style={{
              position: 'absolute',
              left: x - 52,
              top: y - 32,
              width: 104,
              height: 64,
              borderRadius: 8,
              border: `2.4px solid ${COLORS.ink}`,
              overflow: 'hidden',
              transform: `rotate(${(t - 0.5) * 14}deg)`,
              zIndex: 48,
              boxShadow: '0 8px 18px rgba(0,0,0,0.2)',
            }}
          >
            {d.art}
          </div>
        );
      }
    }
    return null;
  };

  // Parabolic flying transition badges during Act 4
  const renderFlyingTransition = () => {
    const throws = [
      { start: ACTS.THROW_T1, tx: 256, icon: '🌀' },
      { start: ACTS.THROW_T2, tx: 468, icon: '📄' },
      { start: ACTS.THROW_T3, tx: 664, icon: '⚡' },
    ];
    for (const th of throws) {
      if (frame >= th.start + 4 && frame < th.start + 18) {
        const t = (frame - (th.start + 4)) / 14;
        const x = interpolate(t, [0, 1], [278, th.tx]);
        const y = interpolate(t, [0, 1], [315, 514]) - Math.sin(t * Math.PI) * 140;
        return (
          <div
            style={{
              position: 'absolute',
              left: x - 16,
              top: y - 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: `2.4px solid ${COLORS.ink}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              transform: `rotate(${t * 540}deg)`,
              zIndex: 55,
            }}
          >
            {th.icon}
          </div>
        );
      }
    }
    return null;
  };

  const editorDimmed = finaleProgress > 0.2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPaper,
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Subtle warm paper dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(120,110,95,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      {/* Act 1: Terminal Typing Window */}
      <TerminalIntro frame={frame} />

      {/* Virtual Camera Rig Stage */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: editorOpacity,
          transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.scale})`,
          transformOrigin: 'center center',
        }}
      >
        <TopBar
          timecode={formatTimecode(frame)}
          exportState={exportState}
          exportProgress={exportProgress}
          dimmed={editorDimmed}
        />

        <LeftPanel
          activeTab={activeTab}
          frame={frame}
          highlightClip={highlightClip}
          dimmed={editorDimmed}
        />

        <RightPanel
          flashVal={flashVal}
          satVal={satVal}
          zoomVal={zoomVal}
          speedVal={1.0}
          drawProgress={rightDrawProgress}
          dimmed={editorDimmed}
        />

        <TimelinePanel
          frame={frame}
          clipsVisible={clipsVisible}
          bgmProgress={bgmProgress}
          playheadX={playheadX}
          deadAirState={deadAirState}
          trashDropProgress={trashDropProgress}
          rippleProgress={rippleProgress}
          transitionsPlaced={transitionsPlaced}
          textClipText={textClipText}
          beatMarkersCount={beatMarkersCount}
          showBeatButton={showBeatButton}
          dimmed={editorDimmed}
        />

        <PhonePreview
          frame={frame}
          activeClip={activeClip}
          ramenBlurred={ramenBlurred}
          showRamenBanner={showRamenBanner}
          subtitleText={activeClip === 'shiba' ? textClipText : null}
          satFilter={satFilter}
          flashOverlay={flashOverlay}
          beatPulse={beatPulse}
          finaleProgress={finaleProgress}
          isPlaying={frame >= ACTS.TRANS_TAB && frame < ACTS.EXPORT_DONE}
        />

        {/* Dragged thumbnail & flying transition badges */}
        {renderDraggedClip()}
        {renderFlyingTransition()}

        {/* Undo Keycap + Green Stamp */}
        <UndoAndStampOverlay
          showUndo={showUndo}
          undoPressed={undoPressed}
          showStamp={showStamp}
          stampScale={clamp(stampScale, 0, 1.15)}
        />

        {/* Mascot Layer (with rubber-hose arms reaching across panels!) */}
        {mascotVisible && (
          <ClaudeMascotLayer
            x={mx}
            y={my}
            frame={frame}
            mood={mood}
            sunglasses={sunglasses}
            leftArmTarget={leftArmTarget}
            rightArmTarget={rightArmTarget}
            knifeAngle={knifeAngle}
            speechBubble={speechBubble}
            dustPuff={dustPuff}
            walkCycle={walkCycle}
            armsUp={armsUp}
            winkWave={winkWave}
          />
        )}

        {/* Comic Onomatopoeia Pops */}
        {frame >= ACTS.KNIFE_SLASH_1 && frame < ACTS.TRASH_DROP + 14 && (
          <ComicPopText text="唰!" x={410} y={400} color="#E68A8A" fontSize={44} rotate={-8} />
        )}
        {frame >= ACTS.KNIFE_SLASH_2 && frame < ACTS.TRASH_DROP + 14 && (
          <ComicPopText text="唰!" x={528} y={405} color="#E68A8A" fontSize={44} rotate={7} />
        )}
        {frame >= ACTS.THROW_T1 + 14 && frame < ACTS.THROW_T3 + 22 && (
          <ComicPopText text="空心入网!" x={392} y={322} color="#6FD4A8" fontSize={36} rotate={-5} />
        )}
        {frame >= ACTS.UNDO_PRESS - 4 && frame < ACTS.UNDO_PRESS + 26 && (
          <ComicPopText text="撤销!" x={320} y={460} color="#8CC7E8" fontSize={34} rotate={-6} />
        )}
        {frame >= ACTS.SLIDE_SAT_MAX + 12 && frame < ACTS.SLIDE_SAT_BACK + 4 && (
          <ComicPopText
            text="饱和度:拉满"
            x={710}
            y={128}
            color={COLORS.pinkComic}
            fontSize={44}
            rotate={-3}
            scale={1 + Math.sin(frame * 0.6) * 0.04}
          />
        )}
        {frame >= ACTS.BEAT_CLICK && frame < ACTS.BEAT_CLICK + 40 && (
          <ComicPopText text="卡点!" x={252} y={414} color="#69CBB6" fontSize={42} rotate={-8} />
        )}
        {frame >= ACTS.EXPORT_DONE && frame < ACTS.FINALE_START && (
          <>
            <ComicPopText text="叮!" x={928} y={145} color="#7CE096" fontSize={52} rotate={-5} />
            <ComicPopText text="BONK!" x={896} y={385} color="#F7C948" fontSize={50} rotate={-6} />
          </>
        )}
      </div>

      {/* Screen-space Overlays (Finale Sticky Note & Confetti) */}
      <FinaleStickyNote progress={stickyProgress} frame={frame} />
      <ConfettiLayer frame={frame} startFrame={ACTS.EXPORT_DONE} />
    </AbsoluteFill>
  );
};
