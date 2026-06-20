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
 * Scene 6 — CTA + Logo + Website (50–60s)
 *
 * Logo pulse, headline, large CTA button, and website URL.
 *
 * Motion beats:
 *   0–2s   : logo reveals with spring
 *   1–4s   : tagline
 *   3–6s   : CTA button pops in
 *   5–10s  : subtle glow pulse on the button + website URL
 */
export const Scene6Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.9 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);

  const ctaSpring = spring({
    frame: frame - 80,
    fps,
    config: { damping: 8, stiffness: 160 },
  });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.7, 1]);
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);

  // Glow pulse on the CTA
  const glow = interpolate(
    frame,
    [120, 180, 240, 300],
    [0.6, 1, 0.85, 1],
    { extrapolateRight: "clamp" },
  );

  const taglineOpacity = interpolate(frame, [30, 80], [0, 1], {
    extrapolateRight: "clamp",
  });
  const urlOpacity = interpolate(frame, [160, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, ${gradients.ctaEnd}33, ${gradients.ctaStart} 70%)`,
        fontFamily: fonts.display,
        color: palette.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background bubbles */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: palette.aqua + "22",
          top: "10%",
          left: "5%",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: palette.coral + "22",
          bottom: "5%",
          right: "5%",
          filter: "blur(60px)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "16px 16px 22px 22px",
              background: `linear-gradient(180deg, ${palette.lightAqua}, ${palette.aqua})`,
              boxShadow: `0 0 30px ${palette.aqua}`,
            }}
          />
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Aura
          </span>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: 270,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: taglineOpacity,
        }}
      >
        <div
          style={{
            fontSize: typeScale.title,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            maxWidth: 1500,
            margin: "0 auto",
          }}
        >
          שתה חכם. הרגש טוב יותר.
        </div>
        <div
          style={{
            fontSize: typeScale.subtitle,
            marginTop: 16,
            color: palette.lightAqua,
            fontWeight: 300,
          }}
        >
          הצטרף לרשימת ההמתנה — משלוח ראשון ביולי 2026.
        </div>
      </div>

      {/* CTA button */}
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: palette.coral,
            color: palette.white,
            fontSize: 56,
            fontWeight: 800,
            padding: "32px 96px",
            borderRadius: 999,
            boxShadow: `0 0 ${60 * glow}px ${palette.coral}AA, 0 20px 40px rgba(0,0,0,0.3)`,
            letterSpacing: "0.02em",
          }}
        >
          להזמנה מוקדמת ←
        </div>
      </div>

      {/* Website */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: urlOpacity,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 300,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: palette.lightAqua,
          }}
        >
          www.aura-waters.com
        </div>
      </div>

      {/* Footer credit */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 18,
          opacity: 0.5,
          letterSpacing: "0.08em",
        }}
      >
        Built with Remotion · Claude Code Skill · Vibe Coding for Managers
      </div>
    </AbsoluteFill>
  );
};
