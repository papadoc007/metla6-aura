"""Suno API client for api.sunoapi.org.

Schema (from https://docs.sunoapi.org/suno-api/generate-music):
- POST /api/v1/generate
- For custom instrumental: customMode=true, instrumental=true,
  style=required, title=required, prompt="" (empty), model="V5"
- Task ID returned in data.taskId
- Poll /api/v1/generate/record-info?taskId=... until status="SUCCESS"
- Audio URLs in data.response.sunoData[].audioUrl
"""

import sys
import time
from pathlib import Path

import requests

API_KEY = "702882f1bd52d52bbe82220837200f17"
BASE = "https://api.sunoapi.org/api/v1"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

OUT_DIR = Path(r"C:\metla6-render\suno")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def _request(method: str, url: str, **kwargs) -> dict:
    r = requests.request(method, url, headers=HEADERS, timeout=60, **kwargs)
    try:
        data = r.json()
    except ValueError:
        raise RuntimeError(f"non-JSON from {url}: HTTP {r.status_code} {r.text[:200]}")
    if r.status_code >= 400 or (isinstance(data, dict) and data.get("code", 0) >= 400):
        raise RuntimeError(f"API error from {url}: {data}")
    return data


def submit(prompt: str, style: str, title: str, *, instrumental: bool, model: str = "V5") -> str:
    url = f"{BASE}/generate"
    payload = {
        "customMode": True,
        "instrumental": bool(instrumental),
        "model": model,
        "title": title[:100],
        "style": style[:1000],
        "prompt": prompt,
        "callBackUrl": "https://example.com/suno-callback-dummy",
    }
    if not instrumental:
        # For vocal tracks, the prompt IS the lyrics
        if not prompt:
            raise RuntimeError("prompt is required for vocal tracks")
    data = _request("POST", url, json=payload)
    task_id = data.get("data", {}).get("taskId")
    if not task_id:
        raise RuntimeError(f"no taskId in: {data}")
    print(f"  taskId={task_id}")
    return task_id


def poll(task_id: str, max_wait_s: int = 480) -> dict:
    url = f"{BASE}/generate/record-info"
    deadline = time.time() + max_wait_s
    while time.time() < deadline:
        data = _request("GET", url, params={"taskId": task_id})
        info = data.get("data", data)
        status = info.get("status", "")
        if status == "SUCCESS":
            return info
        if status in ("CREATE_TASK_FAILED", "GENERATE_AUDIO_FAILED",
                       "CALLBACK_EXCEPTION", "SENSITIVE_WORD_ERROR"):
            raise RuntimeError(f"task {task_id} failed: {info.get('errorMessage') or info}")
        print(f"  status={status} ...")
        time.sleep(8)
    raise RuntimeError(f"task {task_id} timed out after {max_wait_s}s")


def download_first_audio(info: dict, dest: Path) -> Path:
    suno_data = info.get("response", {}).get("sunoData") or []
    if not suno_data:
        raise RuntimeError(f"no sunoData in: {info}")
    audio_url = suno_data[0].get("audioUrl")
    if not audio_url:
        raise RuntimeError(f"no audioUrl in first item: {suno_data[0]}")
    print(f"  audioUrl: {audio_url}")
    r = requests.get(audio_url, stream=True, timeout=120)
    r.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in r.iter_content(8192):
            if chunk:
                f.write(chunk)
    return dest


# 1) Instrumental soundtrack (~60s, mood from music/song-spec.json)
INSTRUMENTAL_STYLE = (
    "indie electronic, hopeful, mid-tempo, 95 bpm, A minor, warm analog synth pad, "
    "soft piano arpeggios, brushed drums, muted trumpet, cinematic advertisement, "
    "uplifting, intimate, wellness lifestyle, clean mix, no vocals"
)
INSTRUMENTAL_TITLE = "Aura Hydration Theme"


def main() -> int:
    print("\n=== Generating instrumental track ===")
    print(f"  title: {INSTRUMENTAL_TITLE}")
    print(f"  style: {INSTRUMENTAL_STYLE[:80]}...")
    tid = submit(
        prompt="",  # empty for instrumental
        style=INSTRUMENTAL_STYLE,
        title=INSTRUMENTAL_TITLE,
        instrumental=True,
    )
    print("  waiting for Suno...")
    info = poll(tid)
    out = OUT_DIR / "aura-soundtrack.mp3"
    download_first_audio(info, out)
    size = out.stat().st_size
    suno_data = info.get("response", {}).get("sunoData") or [{}]
    duration = suno_data[0].get("duration", "?")
    print(f"\nOK: {out}  ({size:,} bytes, ~{duration}s)")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"\nERROR: {e}", file=sys.stderr)
        sys.exit(1)
