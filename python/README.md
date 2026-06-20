# Python Backup Pipeline

> **Why does this folder exist?** The assignment asks for a Remotion project
> (the primary deliverable). However, the previous metla 5 used a Python
> pipeline with Seedance 2.0 + MoviePy. To make the project resilient —
> and to demonstrate "knowing when to switch tools" (per booklet table 4) —
> we keep a Python fallback here.

## When to use which

| If you want... | Use |
|----------------|-----|
| Crisp vector graphics, exact typography, easy Hebrew rendering, hot-reload preview | **Remotion** (main pipeline) |
| AI-generated cinematic video clips with bokeh, natural motion, dramatic shots | **Seedance + MoviePy** (this folder) |
| Quick prototype with stock-looking visuals | **Both**: generate clips with Seedance, then mix in Remotion |

## Files in this folder

- `seedance_client.py` — minimal async client for the Seedance 2.0 API.
  Mirrors the version used in `metla5/` but trimmed to the bare essentials.
- `generate_assets.py` — convenience script that calls Seedance for the
  scenes that benefit from real footage (Scene 4 — gym/work/study),
  and saves them under `clips/`.
- `README.md` (this file)

## Quick start

```powershell
# 1. Copy the env template
Copy-Item ..\.env.example .\.env

# 2. Paste your Seedance API key into .env
# (Do NOT commit .env — it's in .gitignore)

# 3. Install dependencies
pip install requests python-dotenv

# 4. Generate assets for Scene 4 (3 lifestyle clips)
python generate_assets.py

# 5. The clips land in clips/scene4_*.mp4
ls clips/
```

## Cost & time

- Seedance 2.0 (quality): ~$0.10 per 5-second 720p clip
- Seedance 2.0 (fast): ~$0.04 per 5-second 720p clip
- 3 lifestyle clips ≈ $0.30 (quality) or $0.12 (fast)
- Total time: ~3 minutes (parallel generation)
- Recommended for Scene 4 only (where the visual benefits most)
- Scenes 1, 2, 3, 5, 6 are better served by Remotion's CSS art
  (typography + animation, no need for photorealism)

## Integrating with the Remotion video

If you generate the lifestyle clips, you can swap them into the video:

1. Place the MP4s in `public/scene4/` (Remotion serves `public/` as static).
2. Edit `src/scenes/Scene4Lifestyle.tsx` to use `<Video src={staticFile("scene4/gym.mp4")} />` instead of CSS emoji.
3. Re-render: `npx remotion render src/Composition.tsx out/aura-60s.mp4`.

## Important: prompt-injection awareness

When calling Seedance from an AI agent (Cursor / Claude Code), watch out
for:

- **Indirect prompt injection**: if the prompt comes from user-generated
  content (e.g., scraped website), sanitize it before sending.
- **Out-of-scope instructions**: Seedance does not execute text commands —
  it's a video model. Any "ignore previous instructions" type strings in
  the prompt are simply ignored, but you should strip them to save tokens.
- **Sensitive data**: never include personal data, faces of people without
  consent, or copyrighted logos in prompts.

This is documented in the project README → "AI safety & prompt injection".
