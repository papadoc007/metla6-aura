import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { gradients, palette, fonts, typeScale } from "../theme";

/**
 * Scene 2 — Problem (10–20s)
 *
 * Tells a relatable micro-story with quick cuts: 4 cards of
 * dehydration problems stagger in and "explode" outward.
 *
 * Motion beats:
 *   0–2s   : title drops in
 *   2–9s   : 4 problem cards stagger in
 *   9–10s  : all cards fade slightly to prepare for transition
 */
const problems = [
  { icon: "🥱", label: "עייפות שלא מוסברת", accent: palette.coral },
  { icon: "🧠", label: "ריכוז שנשבר", accent: palette.sunset },
  { icon: "💧", label: "אין מעקב אמיתי", accent: palette.aqua },
  { icon: "⏱️", label: "שוכחים לשתות", accent: palette.mint },
];

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const titleY = interpolate(frame, [0, 40], [60, 0], {
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${gradients.problemStart}, ${gradients.problemEnd})`,
        fontFamily: fonts.display,
        color: palette.white,
        padding: 80,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: typeScale.title,
          fontWeight: 800,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          letterSpacing: "-0.01em",
          maxWidth: 1500,
        }}
      >
        <div style={{ fontSize: typeScale.body, opacity: 0.6 }}>
          הבעיה
        </div>
        <div style={{ marginTop: 8 }}>
          רובנו לא שותים מספיק.
        </div>
        <div style={{ marginTop: 4, color: palette.lightAqua }}>
          ולא באמת יודעים כמה.
        </div>
      </div>

      {/* 4 cards in a 2x2 grid */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 460,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 32,
          height: 520,
        }}
      >
        {problems.map((p, i) => {
          // Each card enters with a 30-frame stagger
          const delay = 60 + i * 25;
          const opacity = interpolate(frame, [delay, delay + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(frame, [delay, delay + 30], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // Subtle "wobble" exit at the end
          const endFade = interpolate(frame, [260, 300], [1, 0.3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={p.label}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `2px solid ${p.accent}55`,
                borderRadius: 24,
                padding: 32,
                display: "flex",
                alignItems: "center",
                gap: 24,
                opacity: opacity * endFade,
                transform: `translateY(${y}px)`,
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  fontSize: 96,
                  lineHeight: 1,
                  filter: `drop-shadow(0 4px 12px ${p.accent}66)`,
                }}
              >
                {p.icon}
              </div>
              <div
                style={{
                  fontSize: typeScale.subtitle,
                  fontWeight: 600,
                  color: palette.paper,
                }}
              >
                {p.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom strip: stats */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 60,
          display: "flex",
          justifyContent: "space-between",
          opacity: interpolate(frame, [220, 270], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Stat number="75%" label="לא שותים מספיק מים ביום" />
        <Stat number="2.5L" label="הכמות המומלצת למבוגר" />
        <Stat number="3x" label="פעמים שכחנו לשתות השבוע" />
      </div>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ number: string; label: string }> = ({
  number,
  label,
}) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 56, fontWeight: 800, color: palette.aqua }}>
      {number}
    </div>
    <div style={{ fontSize: typeScale.caption, opacity: 0.7, marginTop: 4 }}>
      {label}
    </div>
  </div>
);
