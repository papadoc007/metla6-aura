"""Seedance 2.0 client — HTTP wrapper for the Seedance video generation API.

This module is a fallback pipeline per booklet section 7.2.1. It is not used
by the Remotion render path. Use only if Remotion is unavailable.

Usage:
    from seedance_client import SeedanceClient
    client = SeedanceClient(api_key=os.environ["SEEDANCE_API_KEY"])
    job = client.create_job(
        prompt="A dashboard with three priority cards, blue-purple palette",
        duration_seconds=20,
        aspect_ratio="16:9",
    )
    client.wait_for_job(job["task_id"])
    client.download_clip(job["task_id"], "out/scene_01.mp4")
"""

from __future__ import annotations

import os
import time
from pathlib import Path

import requests


class SeedanceError(RuntimeError):
    """Raised when the Seedance API returns an error or times out."""


class SeedanceClient:
    BASE_URL = "https://api.seedance2.ai/v1"

    def __init__(self, api_key: str | None = None, timeout_seconds: int = 600):
        self.api_key = api_key or os.environ.get("SEEDANCE_API_KEY", "")
        if not self.api_key:
            raise SeedanceError("SEEDANCE_API_KEY is not set")
        self.timeout_seconds = timeout_seconds
        self.session = requests.Session()
        self.session.headers.update(
            {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        )

    def create_job(self, prompt: str, duration_seconds: int = 5, aspect_ratio: str = "16:9") -> dict:
        """Submit a generation job and return the initial response (with task_id)."""
        resp = self.session.post(
            f"{self.BASE_URL}/videos/generate",
            json={
                "prompt": prompt,
                "duration": duration_seconds,
                "aspect_ratio": aspect_ratio,
            },
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()

    def wait_for_job(self, task_id: str, poll_seconds: int = 10) -> dict:
        """Poll until the job completes or times out."""
        deadline = time.monotonic() + self.timeout_seconds
        while time.monotonic() < deadline:
            resp = self.session.get(f"{self.BASE_URL}/videos/{task_id}", timeout=30)
            resp.raise_for_status()
            data = resp.json()
            status = data.get("status")
            if status == "SUCCESS":
                return data
            if status == "FAILED":
                raise SeedanceError(f"Job {task_id} failed: {data.get('error')}")
            time.sleep(poll_seconds)
        raise SeedanceError(f"Job {task_id} timed out after {self.timeout_seconds}s")

    def download_clip(self, task_id: str, output_path: str) -> Path:
        """Download the finished clip to output_path and return the path."""
        resp = self.session.get(f"{self.BASE_URL}/videos/{task_id}/download", timeout=120)
        resp.raise_for_status()
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(resp.content)
        return out
