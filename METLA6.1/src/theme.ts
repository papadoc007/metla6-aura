// Design tokens for TeamPulse.
// These values mirror the palette block of script/video-spec.json so the
// Composition can stay data-driven. Edit either place consistently.

export const palette = {
  background: "#0E1A2B",
  surface: "#16243A",
  primary: "#6C63FF",
  accent: "#22D3EE",
  text: "#F4F6FB",
  muted: "#8A98AE",
  danger: "#F87171",
};

export const fonts = {
  hebrew: "Heebo, Rubik, 'Segoe UI Hebrew', system-ui, sans-serif",
  mono: "'JetBrains Mono', Consolas, monospace",
};

export const easings = {
  outQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

export const FPS = 30;

// 3 scenes × 20 s = 60 s × 30 fps = 1800 frames.
export const SCENE_LENGTH_FRAMES = 20 * FPS;
export const TOTAL_FRAMES = SCENE_LENGTH_FRAMES * 3;
