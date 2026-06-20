import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { gradients, palette, fonts, typeScale } from "../theme";

/**
 * Scene 5 — AI Coach features (40–50s)
 *
 * Voiceover text suggests the AI coach speaking. Three feature
 * pills reveal one after another.
 *
 * Motion beats:
 *   0–3s   : "Hi, I'm your coach." line writes in
 *   3–9s   : three feature pills stagger in
 *   9–10s  : hold
 */
const features = [
  {
    icon: "📊",
    title: "מעקב חי",
    desc: "כמה שתית, מתי, וקצב יומי.",
  },
  {
    icon: "🧠",
    title: "AI מתאים אישית",
    desc: "המלצות מבוססות מזג אוויר, פעילות, ושינה.",
  },
  {
    icon: "🔔",
    title: "תזכורות חכמות",
    desc: "רק כשבאמת צריך. לא כשאתה בפגישה.",
  },
];

export const Scene5Features: React.FC = () => {
  const frame = useCurrentFrame();

  // Typewriter-ish: reveal the headline over 60 frames
  const fullText = "היי, אני המאמן האישי שלך.";
  const charsShown = Math.min(
    fullText.length,
    Math.floor(interpolate(frame, [10, 90], [0, fullText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
  );
  const headlineText = fullText.slice(0, charsShown);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(140deg, ${gradients.featureStart}, ${gradients.featureEnd})`,
        fontFamily: fonts.display,
        color: palette.white,
        padding: 80,
      }}
    >
      {/* Coach avatar circle */}
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 90,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${palette.aqua}, ${palette.mint})`,
          border: `4px solid ${palette.foam}`,
          boxShadow: `0 0 40px ${palette.aqua}88`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        🤖
      </div>

      {/* Headline (typewriter) */}
      <div
        style={{
          marginTop: 280,
          fontSize: typeScale.title,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          maxWidth: 1500,
          minHeight: typeScale.title * 1.5,
        }}
      >
        {headlineText}
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: typeScale.title * 0.9,
            marginLeft: 6,
            background: palette.aqua,
            verticalAlign: "middle",
            opacity: charsShown < fullText.length ? 1 : 0,
          }}
        />
      </div>

      <div
        style={{
          fontSize: typeScale.subtitle,
          fontWeight: 300,
          opacity: interpolate(frame, [90, 130], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          marginTop: 8,
          color: palette.lightAqua,
        }}
      >
        ואני לא סתם מתזכר — אני מבין.
      </div>

      {/* Feature pills */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 80,
          display: "flex",
          gap: 28,
        }}
      >
        {features.map((f, i) => {
          const delay = 150 + i * 30;
          const opacity = interpolate(frame, [delay, delay + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(frame, [delay, delay + 30], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={f.title}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.07)",
                border: `1px solid rgba(255,255,255,0.18)`,
                borderRadius: 28,
                padding: 28,
                opacity,
                transform: `translateY(${y}px)`,
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 12 }}>{f.icon}</div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: typeScale.caption,
                  opacity: 0.75,
                  lineHeight: 1.4,
                }}
              >
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
