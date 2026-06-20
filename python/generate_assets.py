"""
Generate the lifestyle clips for Scene 4 of the Aura video.

Run from the project root:
    python python/generate_assets.py

Output:
    clips/scene4_gym.mp4
    clips/scene4_office.mp4
    clips/scene4_library.mp4

After generation, move them to public/scene4/ so Remotion can
include them as <Video src={staticFile("scene4/gym.mp4")} />.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Allow `from seedance_client import ...` whether run from project root or this folder.
_HERE = Path(__file__).resolve().parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # python-dotenv is optional but recommended
    pass

from seedance_client import SeedanceClient, SeedanceError

PROJECT_ROOT = _HERE.parent
CLIPS_DIR = PROJECT_ROOT / "clips"
CLIPS_DIR.mkdir(parents=True, exist_ok=True)

# Three lifestyle moments — Scene 4 of the video.
PROMPTS = [
    {
        "name": "scene4_gym",
        "prompt": (
            "Cinematic shot of a runner in a modern gym at dawn, "
            "sweat visible on skin, breathing into a sleek glowing "
            "smart water bottle. Warm backlight, shallow depth of "
            "field, slow motion, 4K, anamorphic lens flare."
        ),
    },
    {
        "name": "scene4_office",
        "prompt": (
            "Cinematic shot of a young professional at a clean desk "
            "in a bright office. A soft blue glow emanates from a "
            "smart water bottle on the desk. Morning light through "
            "floor-to-ceiling windows. Camera slowly pushes in."
        ),
    },
    {
        "name": "scene4_library",
        "prompt": (
            "Cinematic shot of a student in a quiet library, "
            "surrounded by books, taking a sip from a futuristic "
            "smart water bottle. Soft lamp light, dust particles "
            "in the air, peaceful atmosphere, shallow DOF."
        ),
    },
]


def main() -> int:
    try:
        client = SeedanceClient()
    except SeedanceError as e:
        print(f"[error] {e}", file=sys.stderr)
        return 1

    print(f"Using model: {os.getenv('SEEDANCE_MODEL', 'seedance-2-0')}")
    print(f"Output dir:  {CLIPS_DIR}")
    print(f"Will generate {len(PROMPTS)} clips...\n")

    for i, item in enumerate(PROMPTS, start=1):
        out_path = CLIPS_DIR / f"{item['name']}.mp4"
        if out_path.exists() and out_path.stat().st_size > 0:
            print(f"[{i}/{len(PROMPTS)}] skip (exists): {out_path}")
            continue
        print(f"[{i}/{len(PROMPTS)}] generating: {item['name']}")
        try:
            client.generate_and_download(
                prompt=item["prompt"],
                output_path=out_path,
                duration_seconds=5,
                aspect_ratio="16:9",
            )
            print(f"             -> {out_path}")
        except SeedanceError as e:
            print(f"             FAILED: {e}", file=sys.stderr)
            print("             continuing with remaining clips...")

    print("\nDone.")
    print("Next steps:")
    print("  1. Move the MP4s to public/scene4/")
    print("  2. Edit src/scenes/Scene4Lifestyle.tsx to use <Video>")
    print("  3. Re-render: npx remotion render src/Composition.tsx out/aura-60s.mp4")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
