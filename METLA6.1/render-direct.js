// render-direct.js — Render METLA6.1 using @remotion/renderer API directly.
//
// Why not the CLI?
//   The Remotion 4 CLI flags we need (`--comp <id>`) conflict with the
//   positional `out` argument and throw "Could not find composition with ID
//   out/teampulse-60s.mp4". Calling renderMedia() directly avoids this and
//   also gives a stable entry point on Windows + non-ASCII paths.
//
// Usage:
//   node render-direct.js
//
// Requires `npm install` to have completed in this directory.

const path = require("path");
const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");

const ENTRY = path.join(__dirname, "src", "Root.tsx");
const OUT = path.join(__dirname, "out", "teampulse-60s.mp4");
const COMPOSITION_ID = "TeamPulse60s";

(async () => {
  console.log(`[render-direct] Bundling ${ENTRY} ...`);
  const bundleLocation = await bundle({ entryPoint: ENTRY });

  console.log("[render-direct] Selecting composition ...");
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: COMPOSITION_ID,
  });

  console.log(
    `[render-direct] Rendering ${composition.width}x${composition.height} ` +
      `@ ${composition.fps}fps, ${composition.durationInFrames} frames ...`
  );
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: OUT,
    crf: 20,
  });

  console.log(`[render-direct] Done. Wrote ${OUT}`);
})().catch((err) => {
  console.error("[render-direct] FAILED:", err && err.stack ? err.stack : err);
  process.exit(1);
});
