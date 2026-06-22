import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { palette, fonts, easings, FPS } from "../theme";

interface AnimatedTitleProps {
  text: string;
  subtitle?: string;
  size?: "hero" | "medium" | "small";
  delayFrames?: number;
  exitFrames?: number;
}

/**
 * Slide-in Hebrew title with letters that animate word-by-word.
 * Exits to the right when exitFrames is reached.
 */
export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  text,
  subtitle,
  size = "hero",
  delayFrames = 0,
  exitFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 12, stiffness: 90, mass: 0.7 },
  });

  const opacity = interpolate(intro, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateX = interpolate(
    intro,
    [0, 1],
    [160, 0],
    { extrapolateRight: "clamp", easing: easings.outExpo }
  );

  const exitProgress = exitFrames
    ? interpolate(frame, [exitFrames, exitFrames + 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      })
    : 0;
  const exitOpacity = 1 - exitProgress;
  const exitX = exitProgress * -200;

  // Subtle hover
  const hover = Math.sin((frame - delayFrames) / 22) * 3;

  const sizeMap = { hero: 184, medium: 104, small: 56 } as const;
  const subtitleSizeMap = { hero: 56, medium: 38, small: 28 } as const;

  // Word-by-word reveal for the headline
  const words = text.split(" ");
  const wordsLocal = Math.max(0, frame - delayFrames - 6);
  const wordProgress = interpolate(wordsLocal, [0, 24], [0, words.length], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8vw",
        fontFamily: fonts.hebrew,
        unicodeBidi: "embed",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: opacity * exitOpacity,
          transform: `translateX(${translateX + exitX}px) translateY(${hover}px)`,
          display: "table",
          textAlign: "center",
          color: palette.text,
        }}
      >
        <div
          style={{
            fontSize: sizeMap[size],
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
            background: `linear-gradient(120deg, ${palette.text} 0%, ${palette.accent} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "flex",
            gap: "0.3em",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {words.map((w, i) => {
            const visible = i < wordProgress;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(30px)",
                  transition: "transform 0.4s ease-out",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: subtitleSizeMap[size],
              fontWeight: 400,
              color: palette.muted,
              marginTop: 28,
              opacity: interpolate(
                Math.max(0, frame - delayFrames - 18),
                [0, 14],
                [0, 1],
                { extrapolateRight: "clamp" }
              ),
              unicodeBidi: "embed",
              letterSpacing: "0.04em",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
