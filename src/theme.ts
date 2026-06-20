/**
 * Centralized design tokens for the Aura 60-second video.
 *
 * Every scene imports from here so palette, fonts, easings, and
 * layout constants stay in sync. Change once, propagate everywhere.
 *
 * Brand feel for "Aura" — a wellness-oriented smart water bottle:
 *   - Hydration blues + aquatic gradients (water)
 *   - Soft mint accent (freshness)
 *   - Warm sunset peach (energy / lifestyle)
 *   - Deep ink for typography (legibility on light backgrounds)
 */
export const palette = {
  // Primary brand
  deepOcean: "#0B3A5B",
  midOcean: "#1E6091",
  aqua: "#4FB3D9",
  lightAqua: "#B8E1F0",
  foam: "#EAF6FA",

  // Accents
  mint: "#7DDFC1",
  sunset: "#F5A678",
  coral: "#E8704F",
  lemon: "#F9D976",

  // Neutrals
  ink: "#0E1A24",
  charcoal: "#243240",
  smoke: "#5C6B78",
  silver: "#A8B5BF",
  paper: "#F7FAFC",
  white: "#FFFFFF",
  black: "#000000",
} as const;

/**
 * Gradient presets for backgrounds. Use as
 *   background: `linear-gradient(135deg, ${gradients.heroStart}, ${gradients.heroEnd})`
 */
export const gradients = {
  heroStart: palette.deepOcean,
  heroEnd: palette.aqua,
  problemStart: palette.charcoal,
  problemEnd: palette.smoke,
  introStart: palette.midOcean,
  introEnd: palette.mint,
  lifestyleStart: palette.sunset,
  lifestyleEnd: palette.lemon,
  featureStart: palette.deepOcean,
  featureEnd: palette.mint,
  ctaStart: palette.deepOcean,
  ctaEnd: palette.coral,
} as const;

/**
 * Typography. We embed system-safe stacks; if you self-host fonts,
 * drop them in `public/` and add @font-face in a global stylesheet.
 */
export const fonts = {
  display:
    "'Inter', 'Segoe UI', 'Helvetica Neue', 'Heebo', system-ui, sans-serif",
  body: "'Inter', 'Segoe UI', 'Helvetica Neue', 'Heebo', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
} as const;

export const typeScale = {
  hero: 96,
  title: 72,
  subtitle: 48,
  body: 32,
  caption: 24,
  micro: 18,
} as const;

/**
 * Easing curves used by `interpolate`. Using custom cubic-béziers
 * gives a much more "filmic" feel than the default linear ramps.
 */
export const easings = {
  out: [0.16, 1, 0.3, 1] as const, // expo out — elements snap in and settle
  inOut: [0.65, 0, 0.35, 1] as const, // smooth camera moves
  spring: [0.34, 1.56, 0.64, 1] as const, // playful bounce
} as const;

/**
 * Layout: 1080×1920 (vertical) or 1920×1080 (landscape).
 * The assignment is landscape-friendly so we go with 1920×1080.
 */
export const layout = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 30 * 60, // 60 seconds
} as const;

/**
 * Each scene is exactly 10 seconds (300 frames).
 * Indexed 0..5 for the 6 scenes required by the assignment.
 */
export const SCENE_LENGTH_FRAMES = 300;

export interface SceneTiming {
  readonly index: number;
  readonly start: number;
  readonly end: number;
  readonly length: number;
}

/**
 * Compute the [start, end) frame range for scene `i` (0..5).
 * Pure function — easy to unit-test and reason about.
 */
export function sceneTiming(i: number): SceneTiming {
  const start = i * SCENE_LENGTH_FRAMES;
  return {
    index: i,
    start,
    end: start + SCENE_LENGTH_FRAMES,
    length: SCENE_LENGTH_FRAMES,
  };
}

/**
 * Sub-section of a scene — useful for staggered reveals inside one scene.
 * `phase` is 0..1 across the scene length.
 */
export function phaseOf(sceneIndex: number, frame: number): number {
  const { start, length } = sceneTiming(sceneIndex);
  return Math.max(0, Math.min(1, (frame - start) / length));
}
