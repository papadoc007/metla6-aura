"""Generate per-scene assets via Seedance 2.0 (optional).

This script is a fallback that produces one MP4 per scene using the
Seedance video-generation API, then stitches them with ffmpeg.

Per METLA6.1 — we have 3 scenes, each 20 seconds.

Usage:
    python generate_assets.py

Environment:
    SEEDANCE_API_KEY   — required
"""

from __future__ import annotations

import os
from pathlib import Path

from seedance_client import SeedanceClient, SeedanceError


PROMPTS = [
    {
        "id": "opening",
        "prompt": (
            "Cinematic intro shot: a soft blue-purple gradient background, "
            "the wordmark 'TeamPulse' slides in from the right, an ECG-style "
            "pulse line appears top-right. Hebrew subtitle 'רק מה שחשוב' "
            "below the wordmark. Modern corporate aesthetic, 16:9, 20s."
        ),
    },
    {
        "id": "problem",
        "prompt": (
            "Manager at desk surrounded by glowing notification badges. "
            "Three huge numbers appear one after another: 47, 3, 0. "
            "Each number is large red on dark blue background. "
            "Hebrew labels: 'התראות פתוחות', 'דדליינים דחופים', 'דקות של ריכוז'. "
            "Then a single muted line: 'למנהל אין זמן. יש לו המון עדכונים.' "
            "Dramatic, focused, 16:9, 20s."
        ),
    },
    {
        "id": "solution",
        "prompt": (
            "Three action cards rise into frame one at a time: "
            "'תקציב רבעון — יום שישי', 'אסקלציה לקוח — עכשיו', "
            "'לולאת גיוס — פתוח'. Each card has a soft purple glow. "
            "Then the wordmark 'TeamPulse' fades in with a CTA button "
            "and the URL www.teampulse.io. Hopeful, clean, 16:9, 20s."
        ),
    },
]


def main() -> None:
    out_dir = Path(__file__).resolve().parent.parent / "out" / "clips"
    out_dir.mkdir(parents=True, exist_ok=True)

    client = SeedanceClient()
    for scene in PROMPTS:
        clip_path = out_dir / f"{scene['id']}.mp4"
        if clip_path.exists() and clip_path.stat().st_size > 0:
            print(f"[skip] {clip_path} already exists")
            continue
        print(f"[gen ] {scene['id']} ...")
        job = client.create_job(scene["prompt"], duration_seconds=20)
        client.wait_for_job(job["task_id"])
        client.download_clip(job["task_id"], str(clip_path))
        print(f"[done] {clip_path}")


if __name__ == "__main__":
    try:
        main()
    except SeedanceError as exc:
        print(f"Seedance error: {exc}")
        raise SystemExit(1)
