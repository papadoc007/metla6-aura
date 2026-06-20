// Direct render script that runs from inside the project.
const path = require("path");
const { bundle } = require("@remotion/bundler");
const { renderMedia } = require("@remotion/renderer");

async function main() {
  const entryPoint = path.join(__dirname, "src", "Root.tsx");
  const outDir = path.join(__dirname, "build");
  const outputLocation = "C:\\metla6-render\\aura-60s.mp4";

  console.log("Step 1: Bundling from:", entryPoint);
  const bundleResult = await bundle({ entryPoint, outDir });
  console.log("Bundled to:", bundleResult);

  console.log("Step 2: Rendering to:", outputLocation);
  await renderMedia({
    composition: {
      id: "Aura60s",
      width: 1920,
      height: 1080,
      fps: 30,
      durationInFrames: 30 * 60,
    },
    serveUrl: bundleResult,
    codec: "h264",
    outputLocation,
    onProgress: (p) => {
      console.log(
        `stage=${p.stitchStage} rendered=${p.renderedFrames}/${30 * 60} encoded=${p.encodedFrames}`,
      );
    },
  });

  console.log("DONE - video at:", outputLocation);
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
