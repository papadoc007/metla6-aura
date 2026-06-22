import React from "react";
import { AbsoluteFill } from "remotion";
import { palette, fonts } from "../theme";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { LogoMark } from "../components/LogoMark";
import { FlowBackground } from "../components/SceneCard";

/**
 * Opening scene — Brand reveal (0–20 s, 600 frames).
 *   0–2s  : logo + wordmark slide in, ECG line starts drawing
 *   2–6s  : "TeamPulse" wordmark settles, gradient drifts
 *   6–14s : subtitle "רק מה שחשוב" fades in
 *   14–20s: whole composition holds, then transitions out for the problem scene
 */
export const SceneOpening: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: palette.background,
        fontFamily: fonts.hebrew,
        direction: "rtl",
        overflow: "hidden",
      }}
    >
      <FlowBackground hue="violet" />
      <LogoMark style="pulse" delayFrames={15} />
      <AnimatedTitle
        text="TeamPulse"
        subtitle="רק מה שחשוב"
        size="hero"
        delayFrames={20}
        exitFrames={560}
      />
      {/* Tagline strip at the bottom that scrolls in */}
      <div
        dir="rtl"
        lang="he"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 80,
          fontFamily: fonts.hebrew,
          unicodeBidi: "embed",
          textAlign: "center",
          color: palette.muted,
          fontSize: 22,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        <span>FOR MANAGERS WHO REFUSE THE NOISE</span>
      </div>
    </AbsoluteFill>
  );
};
