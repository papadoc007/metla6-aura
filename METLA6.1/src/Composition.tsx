import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import videoSpec from "../script/video-spec.json";
import { SCENE_LENGTH_FRAMES } from "./theme";

import { SceneOpening } from "./scenes/SceneOpening";
import { SceneProblem } from "./scenes/SceneProblem";
import { SceneSolution } from "./scenes/SceneSolution";

/**
 * Composition layout: 3 scenes × 20 s each (600 frames @ 30 fps).
 *   Scene 1 (0–20s)    : Opening — TeamPulse brand reveal
 *   Scene 2 (20–40s)   : Problem — 47 / 3 / 0 stats + pain line
 *   Scene 3 (40–60s)   : Solution — 3 action cards + tagline + CTA
 *
 * Total: 3 × 600 = 1800 frames = 60 seconds at 30 fps.
 *
 * The scene ordering is read from `script/video-spec.json` so the JSON
 * brief stays the binding contract between intent and execution
 * (per Presentation slides 3, 13, 14).
 */

const sceneComponents: Record<string, React.FC> = {
  opening: SceneOpening,
  problem: SceneProblem,
  solution: SceneSolution,
};

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E1A2B" }}>
      {videoSpec.scenes.map((scene, idx) => {
        const Component = sceneComponents[scene.id];
        if (!Component) {
          throw new Error(`No component mapped for scene id: ${scene.id}`);
        }
        return (
          <Sequence
            key={scene.id}
            from={idx * SCENE_LENGTH_FRAMES}
            durationInFrames={SCENE_LENGTH_FRAMES}
            name={`Scene-${idx + 1}-${scene.id}`}
          >
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
