"""Generate the TeamPulse soundtrack via Suno V5.

Per Presentation slide 9 (Emotion Engineering in Sound), the spec is:
- Mood: focused, calm, professional, late-night, corporate-ambient
- Instruments: analog synth pad, brushed drums, upright bass, piano
- 96 bpm in D minor, instrumental with optional spoken word
- 60-second target

Usage:
    python generate_soundtrack.py
"""

from __future__ import annotations

import os
from pathlib import Path

import requests


SUNO_API_BASE = os.environ.get("SUNO_API_BASE", "https://api.sunoapi.org/api/v1")


def generate_soundtrack(api_key: str, prompt: str, title: str, instrumental: bool = True) -> str:
    """Submit a Suno generation job and return the audio URL when ready."""
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    submit = requests.post(
        f"{SUNO_API_BASE}/generate",
        headers=headers,
        json={
            "customMode": True,
            "instrumental": instrumental,
            "model": "V5",
            "style": prompt,
            "title": title,
            "prompt": "",
            "callBackUrl": "https://example.com/suno-callback",
        },
        timeout=30,
    )
    submit.raise_for_status()
    task_id = submit.json()["data"]["taskId"]

    while True:
        poll = requests.get(
            f"{SUNO_API_BASE}/generate/record-info",
            headers=headers,
            params={"taskId": task_id},
            timeout=30,
        )
        poll.raise_for_status()
        body = poll.json()
        if body["data"]["status"] == "SUCCESS":
            return body["data"]["response"]["sunoData"][0]["audioUrl"]
        if body["data"]["status"] == "FAILED":
            raise RuntimeError(f"Suno generation failed: {body}")
        import time
        time.sleep(15)


def main() -> None:
    api_key = os.environ.get("SUNO_API_KEY")
    if not api_key:
        raise SystemExit("SUNO_API_KEY is not set")

    style_prompt = (
        "lo-fi corporate ambient, spoken word over warm analog synth pad, "
        "soft brushed drums at 96 bpm in D minor, upright bass, "
        "subtle piano arpeggio, vinyl crackle texture, calm and focused, "
        "professional late-night office mood, instrumental, cinematic "
        "advertisement, clean mix"
    )

    audio_url = generate_soundtrack(
        api_key=api_key,
        prompt=style_prompt,
        title="TeamPulse Theme",
        instrumental=True,
    )

    out_dir = Path(__file__).resolve().parent.parent / "music" / "output"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "teampulse-soundtrack-original.mp3"
    audio = requests.get(audio_url, timeout=120)
    audio.raise_for_status()
    out_path.write_bytes(audio.content)
    print(f"Wrote {out_path} ({out_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
