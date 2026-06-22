import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { palette, fonts } from "../theme";

interface LogoMarkProps {
  style?: "pulse" | "static";
  delayFrames?: number;
}

/**
 * ECG-style pulse line + wordmark. The line draws itself left-to-right
 * via stroke-dasharray animation, then loops.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({
  style = "pulse",
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.8 },
  });
  const opacity = interpolate(intro, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // ECG line draws over 1.2 s, then loops via dashoffset
  const lineLen = 200;
  const drawLocal = Math.max(0, frame - delayFrames);
  const draw = interpolate(drawLocal % 36, [0, 24], [lineLen, 0], {
    extrapolateRight: "clamp",
  });
  const dotPulse = 0.5 + 0.5 * Math.sin(drawLocal / 6);

  // Wordmark drifts slightly
  const drift = Math.sin((frame - delayFrames) / 30) * 2;

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        position: "absolute",
        top: 64,
        right: 80,
        opacity,
        fontFamily: fonts.hebrew,
        unicodeBidi: "embed",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transform: `translateY(${drift}px)`,
      }}
    >
      <svg width="84" height="40" viewBox="0 0 84 40">
        <polyline
          fill="none"
          stroke={palette.accent}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          points="0,20 16,20 22,8 28,32 36,20 52,20 60,12 68,28 76,20 84,20"
          strokeDasharray={lineLen}
          strokeDashoffset={draw}
        />
        <circle
          cx={78}
          cy={20}
          r={4 + dotPulse * 2}
          fill={palette.primary}
          opacity={0.8 + dotPulse * 0.2}
        />
      </svg>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: palette.text,
          letterSpacing: "0.06em",
        }}
      >
        TeamPulse
      </div>
    </div>
  );
};
