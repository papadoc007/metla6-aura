import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { palette, fonts, FPS } from "../theme";
import { Stat, PainLine, FlowBackground } from "../components/SceneCard";

/**
 * Problem scene — noise overload (20–40 s, 600 frames).
 *
 * The three stats overlap each other with crossfades so there's
 * constant motion on screen — never a dead moment.
 *
 * Timeline:
 *   0–180  : 47 + "התראות פתוחות" (zoom in, float)
 *   150–330: 3 + "דדליינים דחופים" (overlap, crossfade)
 *   300–480: 0 + "דקות של ריכוז"
 *   460–600: pain line holds, then fades for the cut to the solution
 */
export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: palette.background,
        fontFamily: fonts.hebrew,
        direction: "rtl",
        overflow: "hidden",
      }}
    >
      <FlowBackground hue="blue" />

      <Stat
        value="47"
        label="התראות פתוחות"
        delayFrames={0}
        exitFrames={170}
      />
      <Stat
        value="3"
        label="דדליינים דחופים"
        delayFrames={150}
        exitFrames={320}
      />
      <Stat
        value="0"
        label="דקות של ריכוז"
        delayFrames={300}
        exitFrames={470}
      />
      <PainLine
        text="למנהל אין זמן. יש לו המון עדכונים."
        delayFrames={460}
      />

      {/* Section index badge bottom-left — always on screen */}
      <SectionBadge number="01" label="הבעיה" />
    </AbsoluteFill>
  );
};

const SectionBadge: React.FC<{ number: string; label: string }> = ({
  number,
  label,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        bottom: 64,
        opacity: opacity * 0.85,
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: fonts.hebrew,
        color: palette.muted,
        direction: "ltr",
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: palette.accent,
          fontFamily: "monospace",
          letterSpacing: "0.04em",
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: 20,
          textTransform: "uppercase",
          letterSpacing: "0.4em",
        }}
      >
        {label}
      </div>
    </div>
  );
};
