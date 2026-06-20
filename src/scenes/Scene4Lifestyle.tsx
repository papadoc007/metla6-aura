import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { gradients, palette, fonts, typeScale } from "../theme";

/**
 * Scene 4 — Lifestyle demo (30–40s)
 *
 * Three "moments" slide across horizontally: gym → work → study.
 * Each card has an icon, location label, and an Aura stat.
 *
 * Motion beats:
 *   0–9s   : three cards carousel one after another
 *   9–10s  : hold last frame
 */
interface Moment {
  location: string;
  emoji: string;
  bg: string;
  fg: string;
  stat: { label: string; value: string };
}

const moments: Moment[] = [
  {
    location: "חדר כושר",
    emoji: "🏋️",
    bg: palette.coral,
    fg: palette.white,
    stat: { label: "איבדת", value: "1.2L באימון" },
  },
  {
    location: "משרד",
    emoji: "💼",
    bg: palette.midOcean,
    fg: palette.white,
    stat: { label: "תזכורות", value: "6 היום" },
  },
  {
    location: "ספרייה",
    emoji: "📚",
    bg: palette.deepOcean,
    fg: palette.lightAqua,
    stat: { label: "ריכוז", value: "+34%" },
  },
];

export const Scene4Lifestyle: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;

  // Each moment gets ~100 frames (3.3s)
  const segment = totalFrames / moments.length;
  const currentIdx = Math.min(
    moments.length - 1,
    Math.floor(frame / segment),
  );
  const localFrame = frame - currentIdx * segment;
  const t = localFrame / segment;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${gradients.lifestyleStart}, ${gradients.lifestyleEnd})`,
        fontFamily: fonts.display,
        color: palette.ink,
        overflow: "hidden",
      }}
    >
      {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontSize: typeScale.caption,
            color: palette.deepOcean,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          בכל מקום
        </div>
        <div
          style={{
            fontSize: typeScale.title,
            fontWeight: 800,
            marginTop: 4,
            color: palette.ink,
            letterSpacing: "-0.02em",
          }}
        >
          איתך, בכל רגע.
        </div>
      </div>

      {/* Card carousel */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          right: 0,
          height: 600,
          perspective: 1200,
        }}
      >
        {moments.map((m, i) => {
          const offsetFromCurrent = i - currentIdx;
          const cardX = interpolate(
            t,
            [0, 1],
            [offsetFromCurrent * 900, (offsetFromCurrent - 1) * 900],
          );
          const cardOpacity =
            Math.abs(offsetFromCurrent) < 0.5
              ? interpolate(t, [0, 0.2, 0.8, 1], [0, 1, 1, 0.4])
              : Math.abs(offsetFromCurrent - 1) < 0.5
                ? interpolate(t, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0])
                : 0.4;
          const cardScale = Math.abs(offsetFromCurrent) < 0.5 ? 1 : 0.85;

          return (
            <div
              key={m.location}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 760,
                height: 540,
                marginLeft: -380,
                marginTop: -270,
                background: m.bg,
                color: m.fg,
                borderRadius: 36,
                padding: 48,
                boxSizing: "border-box",
                transform: `translateX(${cardX}px) scale(${cardScale})`,
                opacity: cardOpacity,
                boxShadow: `0 30px 60px rgba(0,0,0,0.25)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 180,
                  lineHeight: 1,
                  filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.25))`,
                }}
              >
                {m.emoji}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.location}
                </div>
                <div
                  style={{
                    marginTop: 24,
                    fontSize: 28,
                    opacity: 0.7,
                  }}
                >
                  {m.stat.label}
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 800,
                    marginTop: 4,
                  }}
                >
                  {m.stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {moments.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentIdx ? 40 : 12,
              height: 12,
              borderRadius: 999,
              background:
                i === currentIdx ? palette.deepOcean : palette.deepOcean + "44",
              transition: "width 0.3s",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
