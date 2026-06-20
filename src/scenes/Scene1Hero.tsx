import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { gradients, palette, fonts, typeScale } from "../theme";

/**
 * Scene 1 — Hero / Brand reveal (0–10s)
 *
 * Visual: a slow zoom on a stylized bottle silhouette against an
 * aquatic gradient. The brand wordmark fades in from below.
 *
 * Motion beats:
 *   0–2s   : gradient establishes, bottle glows up
 *   2–5s   : wordmark "Aura" slides up + tagline fades in
 *   5–9s   : subtle camera push + sparkle particles drift
 *   9–10s  : hold for cut
 */
export const Scene1Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bottle glow — pulses from 0.85 -> 1.0 over the scene
  const glow = interpolate(
    frame,
    [0, 60, 180, 300],
    [0.6, 1, 0.9, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Wordmark spring entrance
  const wordmarkSpring = spring({
    frame: frame - 60, // start at 2s
    fps,
    config: { damping: 14, stiffness: 90, mass: 1 },
  });
  const wordmarkY = interpolate(wordmarkSpring, [0, 1], [80, 0]);
  const wordmarkOpacity = interpolate(wordmarkSpring, [0, 1], [0, 1]);

  // Tagline fades in after the wordmark
  const taglineOpacity = interpolate(frame, [150, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera push: subtle scale 1 -> 1.04 over the scene
  const camera = interpolate(frame, [0, 300], [1, 1.04], {
    extrapolateRight: "clamp",
  });

  // Sparkle drift — three pseudo-random particles
  const sparkles = [0, 1, 2].map((i) => {
    const seed = i * 137.5;
    const x = ((seed * 9301 + 49297) % 233280) / 233280;
    const y = ((seed * 4517 + 12345) % 233280) / 233280;
    const drift = interpolate(
      frame,
      [0, 300],
      [y * 1080, y * 1080 - 220],
      { extrapolateRight: "clamp" },
    );
    const opacity = interpolate(
      frame,
      [0, 60 + i * 30, 240, 300],
      [0, 0.9, 0.6, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return { left: `${x * 100}%`, top: drift, opacity, size: 6 + i * 4 };
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${gradients.heroStart}, ${gradients.heroEnd})`,
        fontFamily: fonts.display,
        overflow: "hidden",
      }}
    >
      {/* Camera push wrapper */}
      <AbsoluteFill
        style={{
          transform: `scale(${camera})`,
          transformOrigin: "center",
        }}
      >
        {/* Stylized bottle silhouette (CSS art) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "44%",
            transform: "translate(-50%, -50%)",
            width: 260,
            height: 520,
            borderRadius: "60px 60px 80px 80px / 60px 60px 200px 200px",
            background: `linear-gradient(180deg, ${palette.lightAqua}, ${palette.aqua})`,
            boxShadow: `0 0 ${80 * glow}px ${20 * glow}px ${palette.aqua}AA`,
            border: `2px solid ${palette.foam}`,
            opacity: 0.92,
          }}
        />
        {/* Bottle cap */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "44%",
            transform: "translate(-50%, -510px)",
            width: 120,
            height: 70,
            borderRadius: "16px 16px 12px 12px",
            background: `linear-gradient(180deg, ${palette.mint}, ${palette.deepOcean})`,
            boxShadow: `0 0 ${30 * glow}px ${palette.mint}88`,
          }}
        />

        {/* Sparkles */}
        {sparkles.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: palette.foam,
              opacity: s.opacity,
              boxShadow: `0 0 14px ${palette.foam}`,
            }}
          />
        ))}

        {/* Wordmark "Aura" */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 280,
            textAlign: "center",
            color: palette.white,
            transform: `translateY(${wordmarkY}px)`,
            opacity: wordmarkOpacity,
          }}
        >
          <div
            style={{
              fontSize: typeScale.hero,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Aura
          </div>
          <div
            style={{
              fontSize: typeScale.subtitle,
              fontWeight: 300,
              letterSpacing: "0.18em",
              marginTop: 16,
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            Hydration, intelligent.
          </div>
        </div>

        {/* Tagline at the very bottom */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 120,
            textAlign: "center",
            color: palette.lightAqua,
            fontSize: typeScale.body,
            fontWeight: 400,
            opacity: taglineOpacity,
            letterSpacing: "0.04em",
          }}
        >
          הבקבוק החכם שמכיר אותך יותר ממך.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
