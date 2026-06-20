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
 * Scene 3 — Product intro (20–30s)
 *
 * Split-screen: bottle floats in on the left, phone mockup with
 * the Aura app slides in from the right and they "pair".
 *
 * Motion beats:
 *   0–3s   : bottle swings in from left
 *   2–6s   : phone slides in from right
 *   6–9s   : bluetooth "ping" waves appear between them
 *   9–10s  : both center, "Paired." text appears
 */
export const Scene3Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bottleX = interpolate(
    frame,
    [0, 60],
    [-400, 0],
    { extrapolateRight: "clamp" },
  );
  const bottleOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const phoneX = interpolate(
    frame,
    [60, 140],
    [600, 0],
    { extrapolateRight: "clamp" },
  );
  const phoneOpacity = interpolate(frame, [60, 110], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bluetooth pulses between the two
  const pulsePhase = (frame - 150) / 30;
  const pulse = Math.max(0, Math.min(1, pulsePhase));
  const pulseScale = interpolate(pulse, [0, 1], [0, 1.6], {
    extrapolateRight: "clamp",
  });
  const pulseOpacity = interpolate(pulse, [0, 0.4, 1], [0.9, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  const pairSpring = spring({
    frame: frame - 220,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const pairOpacity = interpolate(pairSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(140deg, ${gradients.introStart}, ${gradients.introEnd})`,
        fontFamily: fonts.display,
        color: palette.white,
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ fontSize: typeScale.caption, opacity: 0.7 }}>
          Aura
        </div>
        <div
          style={{
            fontSize: typeScale.title,
            fontWeight: 800,
            marginTop: 4,
            letterSpacing: "-0.01em",
          }}
        >
          פשוט לחבר. קל לאהוב.
        </div>
      </div>

      {/* Bluetooth pulse rings (between bottle and phone) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: `4px solid ${palette.foam}`,
          opacity: pulseOpacity,
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: `2px solid ${palette.foam}`,
          opacity: pulseOpacity * 0.5,
          transform: `translate(-50%, -50%) scale(${pulseScale * 0.7})`,
        }}
      />

      {/* Bottle (left) */}
      <div
        style={{
          position: "absolute",
          left: "26%",
          top: "50%",
          transform: `translate(-50%, -50%) translateX(${bottleX}px)`,
          opacity: bottleOpacity,
        }}
      >
        <BottleArt />
      </div>

      {/* Phone (right) */}
      <div
        style={{
          position: "absolute",
          right: "20%",
          top: "50%",
          transform: `translate(50%, -50%) translateX(${phoneX}px)`,
          opacity: phoneOpacity,
        }}
      >
        <PhoneArt />
      </div>

      {/* "Paired." overlay */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 110,
          textAlign: "center",
          opacity: pairOpacity,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: palette.foam,
            color: palette.deepOcean,
            padding: "16px 40px",
            borderRadius: 999,
            fontSize: typeScale.subtitle,
            fontWeight: 700,
            boxShadow: `0 12px 36px ${palette.deepOcean}66`,
          }}
        >
          ✓ Paired · מחובר
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BottleArt: React.FC = () => (
  <div style={{ position: "relative" }}>
    {/* Cap */}
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: -40,
        transform: "translateX(-50%)",
        width: 110,
        height: 60,
        borderRadius: "16px 16px 10px 10px",
        background: `linear-gradient(180deg, ${palette.mint}, ${palette.deepOcean})`,
        boxShadow: `0 0 24px ${palette.mint}AA`,
      }}
    />
    {/* Body */}
    <div
      style={{
        width: 240,
        height: 480,
        borderRadius: "60px 60px 80px 80px / 60px 60px 200px 200px",
        background: `linear-gradient(180deg, ${palette.foam}, ${palette.aqua} 60%, ${palette.midOcean})`,
        boxShadow: `0 30px 60px ${palette.deepOcean}55, inset 0 0 60px ${palette.lightAqua}`,
        border: `3px solid ${palette.foam}`,
      }}
    >
      {/* Brand mark on the bottle */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "45%",
          textAlign: "center",
          fontFamily: "system-ui",
          fontSize: 56,
          fontWeight: 800,
          color: palette.deepOcean,
          letterSpacing: "-0.02em",
        }}
      >
        AURA
      </div>
    </div>
  </div>
);

const PhoneArt: React.FC = () => (
  <div
    style={{
      width: 260,
      height: 520,
      borderRadius: 38,
      background: palette.ink,
      padding: 14,
      boxShadow: `0 30px 60px ${palette.deepOcean}66`,
      border: `3px solid ${palette.charcoal}`,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 26,
        background: `linear-gradient(180deg, ${palette.foam}, ${palette.lightAqua})`,
        padding: 24,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 8,
          transform: "translateX(-50%)",
          width: 90,
          height: 22,
          borderRadius: 12,
          background: palette.ink,
        }}
      />
      <div style={{ marginTop: 50, color: palette.deepOcean }}>
        <div style={{ fontSize: 16, fontWeight: 600, opacity: 0.6 }}>
          היי, שיר
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            marginTop: 6,
            letterSpacing: "-0.02em",
          }}
        >
          1.8 ליטר
        </div>
        <div style={{ fontSize: 14, opacity: 0.6 }}>מתוך 2.5 היום</div>
        {/* Progress ring */}
        <div
          style={{
            marginTop: 24,
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: `14px solid ${palette.aqua}33`,
            borderTopColor: palette.aqua,
            transform: "rotate(-45deg)",
          }}
        />
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            fontWeight: 600,
            color: palette.deepOcean,
          }}
        >
          תזכורת הבאה
        </div>
        <div style={{ fontSize: 16, color: palette.midOcean, marginTop: 4 }}>
          עוד 23 דקות
        </div>
      </div>
    </div>
  </div>
);
