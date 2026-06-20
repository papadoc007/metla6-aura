import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENE_LENGTH_FRAMES } from "./theme";

import { Scene1Hero } from "./scenes/Scene1Hero";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Intro } from "./scenes/Scene3Intro";
import { Scene4Lifestyle } from "./scenes/Scene4Lifestyle";
import { Scene5Features } from "./scenes/Scene5Features";
import { Scene6Cta } from "./scenes/Scene6Cta";

/**
 * The 60-second product video for Aura, the AI-powered hydration bottle.
 *
 * Composition layout: 6 scenes × 10 s each (300 frames @ 30 fps).
 *   Scene 1 (0–10s)    : Hero shot, brand reveal
 *   Scene 2 (10–20s)   : Problem — dehydration, fatigue, no tracking
 *   Scene 3 (20–30s)   : Product intro, app pairing
 *   Scene 4 (30–40s)   : Lifestyle demo (gym, work, study)
 *   Scene 5 (40–50s)   : AI coach features
 *   Scene 6 (50–60s)   : CTA + logo + website
 *
 * Total: 6 × 300 = 1800 frames = 60 seconds at 30 fps.
 */
export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B3A5B" }}>
      <Sequence
        from={0 * SCENE_LENGTH_FRAMES}
        durationInFrames={SCENE_LENGTH_FRAMES}
        name="Scene1-Hero"
      >
        <Scene1Hero />
      </Sequence>

      <Sequence
        from={1 * SCENE_LENGTH_FRAMES}
        durationInFrames={SCENE_LENGTH_FRAMES}
        name="Scene2-Problem"
      >
        <Scene2Problem />
      </Sequence>

      <Sequence
        from={2 * SCENE_LENGTH_FRAMES}
        durationInFrames={SCENE_LENGTH_FRAMES}
        name="Scene3-Intro"
      >
        <Scene3Intro />
      </Sequence>

      <Sequence
        from={3 * SCENE_LENGTH_FRAMES}
        durationInFrames={SCENE_LENGTH_FRAMES}
        name="Scene4-Lifestyle"
      >
        <Scene4Lifestyle />
      </Sequence>

      <Sequence
        from={4 * SCENE_LENGTH_FRAMES}
        durationInFrames={SCENE_LENGTH_FRAMES}
        name="Scene5-Features"
      >
        <Scene5Features />
      </Sequence>

      <Sequence
        from={5 * SCENE_LENGTH_FRAMES}
        durationInFrames={SCENE_LENGTH_FRAMES}
        name="Scene6-Cta"
      >
        <Scene6Cta />
      </Sequence>
    </AbsoluteFill>
  );
};
