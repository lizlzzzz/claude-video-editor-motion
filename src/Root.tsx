import React from 'react';
import { Composition } from 'remotion';
import { ClaudeEditorMotion } from './ClaudeEditorMotion';
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ClaudeEditorMotion"
      component={ClaudeEditorMotion}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
