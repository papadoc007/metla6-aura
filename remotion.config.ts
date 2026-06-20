import { Config } from "@remotion/cli/config";

/**
 * Remotion configuration for the Aura 60-second product video.
 *
 * Run `npx remotion studio` to preview in the browser,
 * or `npx remotion render src/Composition.tsx out/aura-60s.mp4` to render.
 */
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer("angle");
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(20);
Config.setEntryPoint("src/Composition.tsx");
