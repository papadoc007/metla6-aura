import React from "react";
import { Composition, registerRoot } from "remotion";
import { MyComposition } from "./Composition";
import { layout } from "./theme";

/**
 * Root entry — Remotion v4.
 *
 * `registerRoot()` is required by the CLI; it tells Remotion
 * which React component holds the composition list.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Aura60s"
        component={MyComposition}
        durationInFrames={layout.durationInFrames}
        fps={layout.fps}
        width={layout.width}
        height={layout.height}
      />
    </>
  );
};

registerRoot(RemotionRoot);
