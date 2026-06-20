"""
Seedance 2.0 video generation client (minimal).

Adapted from `metla5/src/seedance_client.py` for the Remotion
fallback path. This module is intentionally tiny: one create,
one poll, one download. No CLI surface, no extras.

Usage:
    from seedance_client import SeedanceClient
    client = SeedanceClient(api_key="...")
    path = client.generate_and_download(
        prompt="...",
        output_path="clips/scene4_gym.mp4",
        duration_seconds=5,
        aspect_ratio="16:9",
    )

Environment:
    SEEDANCE_API_KEY  — required if `api_key` is not passed.
    SEEDANCE_MODEL    — default "seedance-2-0".
"""

from __future__ import annotations

import os
import time
from pathlib import Path
from typing import Optional

import requests


API_BASE = "https://api.seedance2.ai/v1"
DEFAULT_MODEL = os.getenv("SEEDANCE_MODEL", "seedance-2-0")
DEFAULT_POLL_INTERVAL = 10
DEFAULT_TIMEOUT_SECONDS = 15 * 60


class SeedanceError(RuntimeError):
    """Raised for any non-recoverable Seedance API failure."""


class SeedanceClient:
    """Thin synchronous wrapper around the Seedance 2.0 REST API.

    The real service exposes async webhooks, but for our purposes
    (3-5 short clips, sub-minute generation) polling is fine.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = API_BASE,
        timeout: int = 60,
    ) -> None:
        key = api_key or os.getenv("SEEDANCE_API_KEY")
        if not key:
            raise SeedanceError(
                "SEEDANCE_API_KEY not provided. "
                "Set it in .env or pass api_key=... to the constructor."
            )
        self.api_key = key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self._session = requests.Session()
        self._session.headers.update(
            {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": "metla6-aura/1.0",
            }
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def create_video_task(
        self,
        prompt: str,
        duration_seconds: int = 5,
        aspect_ratio: str = "16:9",
        model: str = DEFAULT_MODEL,
    ) -> str:
        """Submit a generation request, return the task_id."""
        if not prompt or not prompt.strip():
            raise SeedanceError("prompt must be a non-empty string")

        payload = {
            "model": model,
            "prompt": prompt.strip(),
            "duration": int(duration_seconds),
            "aspect_ratio": aspect_ratio,
        }
        url = f"{self.base_url}/videos/generations"
        resp = self._session.post(url, json=payload, timeout=self.timeout)
        if resp.status_code >= 400:
            raise SeedanceError(
                f"create_video_task failed ({resp.status_code}): {resp.text}"
            )
        data = resp.json()
        task_id = data.get("task_id") or data.get("id") or data.get("taskId")
        if not task_id:
            raise SeedanceError(f"missing task_id in response: {data!r}")
        return task_id

    def wait_for_task(
        self,
        task_id: str,
        poll_interval: int = DEFAULT_POLL_INTERVAL,
        timeout: int = DEFAULT_TIMEOUT_SECONDS,
    ) -> dict:
        """Poll the task until it reaches a terminal state."""
        deadline = time.monotonic() + timeout
        url = f"{self.base_url}/tasks/{task_id}"
        while True:
            resp = self._session.get(url, timeout=self.timeout)
            if resp.status_code >= 400:
                raise SeedanceError(
                    f"wait_for_task poll failed ({resp.status_code}): {resp.text}"
                )
            data = resp.json()
            status = (data.get("status") or "").lower()
            if status in {"succeeded", "success", "completed"}:
                return data
            if status in {"failed", "error", "cancelled"}:
                raise SeedanceError(
                    f"task {task_id} ended in status={status}: {data!r}"
                )
            if time.monotonic() > deadline:
                raise SeedanceError(
                    f"task {task_id} did not finish within {timeout}s"
                )
            time.sleep(poll_interval)

    def download(
        self,
        video_url: str,
        output_path: str | os.PathLike[str],
    ) -> Path:
        """Stream-download the rendered MP4."""
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        with self._session.get(video_url, stream=True, timeout=self.timeout) as r:
            r.raise_for_status()
            with out.open("wb") as f:
                for chunk in r.iter_content(chunk_size=1 << 20):
                    if chunk:
                        f.write(chunk)
        return out

    def generate_and_download(
        self,
        prompt: str,
        output_path: str | os.PathLike[str],
        duration_seconds: int = 5,
        aspect_ratio: str = "16:9",
        model: str = DEFAULT_MODEL,
    ) -> Path:
        """One-shot: create → poll → download."""
        task_id = self.create_video_task(
            prompt=prompt,
            duration_seconds=duration_seconds,
            aspect_ratio=aspect_ratio,
            model=model,
        )
        result = self.wait_for_task(task_id)
        video_url = (
            result.get("video_url")
            or result.get("output_url")
            or (result.get("output") or {}).get("video_url")
        )
        if not video_url:
            raise SeedanceError(f"no video_url in result: {result!r}")
        return self.download(video_url, output_path)


__all__ = ["SeedanceClient", "SeedanceError", "DEFAULT_MODEL"]
