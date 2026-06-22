import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { palette, fonts, easings, FPS } from "../theme";

// ---------- Animated background layers ----------

/**
 * Slow drifting orbs + scanning line + moving grid — sits behind every
 * scene and provides the constant "flow" that makes the video feel
 * alive between the discrete content beats.
 */
export const FlowBackground: React.FC<{ hue?: "blue" | "violet" | "cyan" }> = ({
  hue = "violet",
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const colors =
    hue === "blue"
      ? { a: "#1E3A8A", b: "#22D3EE" }
      : hue === "cyan"
        ? { a: "#155E75", b: "#22D3EE" }
        : { a: "#4C1D95", b: "#6C63FF" };

  const orb1X = interpolate(t, [0, 20], [10, 90], { extrapolateRight: "extend" });
  const orb1Y = 50 + Math.sin(t * 0.4) * 18;
  const orb2X = interpolate(t, [0, 25], [85, 5], { extrapolateRight: "extend" });
  const orb2Y = 55 + Math.cos(t * 0.5) * 22;
  const scanY = (t * 80) % 110 - 5; // px percentage, wraps

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {/* Drifting orb #1 */}
      <div
        style={{
          position: "absolute",
          left: `${orb1X}%`,
          top: `${orb1Y}%`,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.a} 0%, transparent 70%)`,
          opacity: 0.45,
          filter: "blur(60px)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Drifting orb #2 */}
      <div
        style={{
          position: "absolute",
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.b} 0%, transparent 70%)`,
          opacity: 0.35,
          filter: "blur(70px)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Scanning line that sweeps top-to-bottom every cycle */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${scanY}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${colors.b} 50%, transparent 100%)`,
          opacity: 0.5,
          boxShadow: `0 0 24px ${colors.b}`,
        }}
      />
      {/* Faint grid overlay that slides horizontally */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${colors.b}22 1px, transparent 1px), linear-gradient(90deg, ${colors.b}22 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          transform: `translateX(${(-t * 40) % 80}px)`,
          opacity: 0.35,
        }}
      />
    </AbsoluteFill>
  );
};

// Re-export AbsoluteFill from remotion so this file is self-contained.
import { AbsoluteFill } from "remotion";

// ---------- ActionCard ----------

interface ActionCardProps {
  title: string;
  due: string;
  delayFrames?: number;
  highlight?: boolean;
  exitFrames?: number;
}

/**
 * Card with title + due label. Enters from the right, drifts to its
 * resting position, and gently bobs while visible. Slides out the
 * opposite side when exitFrames is reached.
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  due,
  delayFrames = 0,
  highlight = false,
  exitFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const local = Math.max(0, frame - delayFrames);
  const intro = spring({
    frame: local,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  const opacity = interpolate(intro, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateX = interpolate(
    intro,
    [0, 1],
    [260, 0],
    { extrapolateRight: "clamp", easing: easings.outExpo }
  );

  // Exit animation: when global frame crosses exitFrames, slide out left.
  const exitProgress = exitFrames
    ? interpolate(frame, [exitFrames, exitFrames + 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      })
    : 0;
  const exitOpacity = 1 - exitProgress;
  const exitX = exitProgress * -340;

  // Idle bob: small vertical movement to make the card feel "alive".
  const bob = Math.sin((frame - delayFrames) / 18) * 4;

  // Soft pulse on shadow.
  const pulse = 0.5 + 0.5 * Math.sin((frame - delayFrames) / 12);

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6vw",
        fontFamily: fonts.hebrew,
        unicodeBidi: "embed",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: opacity * exitOpacity,
          transform: `translateX(${translateX + exitX}px) translateY(${bob}px)`,
          width: "min(820px, 80%)",
          background: `linear-gradient(160deg, ${palette.surface} 0%, #1F2D49 100%)`,
          border: `1px solid ${highlight ? palette.primary : palette.muted}`,
          borderRadius: 22,
          padding: "40px 56px",
          boxShadow: `0 12px ${40 + pulse * 30}px ${
            highlight ? "rgba(108, 99, 255, 0.55)" : "rgba(34, 211, 238, 0.25)"
          }, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: highlight ? palette.accent : palette.muted,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {due}
        </div>
        <div
          style={{
            fontSize: 68,
            color: palette.text,
            fontWeight: 700,
            marginTop: 10,
            unicodeBidi: "embed",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        {/* Decorative side bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 24,
            bottom: 24,
            width: 5,
            borderRadius: 4,
            background: highlight ? palette.primary : palette.accent,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
};

// ---------- Stat ----------

interface StatProps {
  value: string;
  label: string;
  delayFrames?: number;
  exitFrames?: number;
}

/**
 * Big number with small Hebrew label. Enters with overshoot scale,
 * rotates slightly while drifting, and slides out on exit.
 */
export const Stat: React.FC<StatProps> = ({
  value,
  label,
  delayFrames = 0,
  exitFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 8, stiffness: 110, mass: 0.6 },
  });

  const opacity = interpolate(intro, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(intro, [0, 1], [0.4, 1], { extrapolateRight: "clamp" });

  const exitProgress = exitFrames
    ? interpolate(frame, [exitFrames, exitFrames + 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      })
    : 0;
  const exitOpacity = 1 - exitProgress;
  const exitY = exitProgress * 60;

  // Idle float
  const float = Math.sin((frame - delayFrames) / 14) * 6;

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
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
          transform: `scale(${scale}) translateY(${float + exitY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 360,
            fontWeight: 900,
            lineHeight: 0.9,
            background: `linear-gradient(180deg, ${palette.danger} 0%, #B91C1C 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.05em",
            textShadow: "0 0 60px rgba(248, 113, 113, 0.3)",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 52,
            color: palette.text,
            fontWeight: 500,
            marginTop: 16,
            unicodeBidi: "embed",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

// ---------- PainLine ----------

interface PainLineProps {
  text: string;
  delayFrames?: number;
  exitFrames?: number;
}

export const PainLine: React.FC<PainLineProps> = ({
  text,
  delayFrames = 0,
  exitFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(intro, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(intro, [0, 1], [60, 0], { extrapolateRight: "clamp" });

  const exitProgress = exitFrames
    ? interpolate(frame, [exitFrames, exitFrames + 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
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
          opacity: opacity * (1 - exitProgress),
          transform: `translateY(${y}px)`,
          fontSize: 60,
          color: palette.muted,
          textAlign: "center",
          fontWeight: 500,
          maxWidth: "min(1100px, 80%)",
          unicodeBidi: "embed",
          lineHeight: 1.25,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ---------- Cta ----------

interface CtaProps {
  url: string;
  label: string;
  delayFrames?: number;
}

/**
 * Bottom CTA: pill + URL. Pill has a soft scale entrance and the
 * gradient sweeps continuously to feel "alive".
 */
export const Cta: React.FC<CtaProps> = ({ url, label, delayFrames = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.7 },
  });

  const opacity = interpolate(intro, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(intro, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
  const y = interpolate(intro, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  // URL letters fade in one-by-one.
  const urlLocal = Math.max(0, frame - delayFrames - 18);
  const urlProgress = interpolate(urlLocal, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const urlChars = Math.floor(url.length * urlProgress);

  // Glow pulse
  const pulse = 0.5 + 0.5 * Math.sin((frame - delayFrames) / 10);

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 96,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        fontFamily: fonts.hebrew,
        unicodeBidi: "embed",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${y}px)`,
          padding: "24px 60px",
          borderRadius: 999,
          background: `linear-gradient(${frame * 2}deg, ${palette.primary} 0%, ${palette.accent} 100%)`,
          color: "#0B1020",
          fontWeight: 800,
          fontSize: 38,
          letterSpacing: "0.02em",
          boxShadow: `0 10px ${30 + pulse * 20}px rgba(108, 99, 255, 0.55)`,
        }}
      >
        {label}
      </div>
      <div
        style={{
          opacity: urlProgress,
          fontSize: 44,
          color: palette.text,
          fontWeight: 600,
          letterSpacing: "0.18em",
          fontFamily: "monospace",
        }}
      >
        {url.slice(0, urlChars)}
        {urlProgress < 1 ? (
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 44,
              background: palette.accent,
              marginLeft: 4,
              verticalAlign: "middle",
              opacity: pulse,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
