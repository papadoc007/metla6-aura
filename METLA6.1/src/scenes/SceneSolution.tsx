import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { palette, fonts } from "../theme";
import { ActionCard, Cta, FlowBackground } from "../components/SceneCard";
import { AnimatedTitle } from "../components/AnimatedTitle";

/**
 * Solution scene — three priorities + CTA (40–60 s, 600 frames).
 *
 * Cards enter in a staggered "fan" (one above the other, slight rotation),
 * then settle into a vertical stack before sliding out as a group.
 * The tagline + CTA fade in at the end.
 */
export const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${palette.background} 0%, #1E2A4A 100%)`,
        fontFamily: fonts.hebrew,
        direction: "rtl",
        overflow: "hidden",
      }}
    >
      <FlowBackground hue="cyan" />

      {/* Stacked cards: each card occupies a vertical band, but the eye
          reads them as a single three-item list. */}
      <StaggeredCards />

      <AnimatedTitle
        text="3 פעולות. אפס רעש."
        size="medium"
        delayFrames={420}
      />
      <Cta
        url="www.teampulse.io"
        label="הצטרפו להרשמה מוקדמת"
        delayFrames={510}
      />

      <SectionBadge number="03" label="הפתרון" />
    </AbsoluteFill>
  );
};

const CARDS = [
  { title: "תקציב רבעון", due: "יום שישי", highlight: false, delay: 0 },
  { title: "אסקלציה לקוח", due: "עכשיו", highlight: true, delay: 30 },
  { title: "לולאת גיוס", due: "פתוח", highlight: false, delay: 60 },
];

/**
 * Three cards stacked vertically with slight Y-stagger so they
 * enter as a "fan" and exit together. Each card slides in from
 * the right and bobs in place.
 */
const StaggeredCards: React.FC = () => {
  return (
    <>
      {CARDS.map((c, i) => {
        // Vertical offset: card 0 is upper, card 1 is centered, card 2 is lower.
        const yOffset = (i - 1) * 140;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              transform: `translateY(calc(-50% + ${yOffset}px))`,
              pointerEvents: "none",
            }}
          >
            <ActionCard
              title={c.title}
              due={c.due}
              delayFrames={30 + c.delay}
              highlight={c.highlight}
              exitFrames={400}
            />
          </div>
        );
      })}
    </>
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
