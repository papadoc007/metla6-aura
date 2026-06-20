"""
verify_structure.py — Sanity-check that every required file is present.

Run from project root:
    python scripts/verify_structure.py

Exit codes:
    0 — all required files exist
    1 — at least one file is missing (list printed)

This script intentionally uses only the Python standard library
(no third-party dependencies) so it can run in any minimal environment.
"""

from __future__ import annotations

import sys
from pathlib import Path


# Resolve project root relative to this file.
HERE = Path(__file__).resolve().parent
PROJECT_ROOT = HERE.parent

# (relative_path, human_description, must_contain_text)
REQUIRED_FILES: list[tuple[str, str, str | None]] = [
    # --- Root deliverables (booklet section 7.2.1) ---
    ("PRD.md", "Product Requirements Document", "# PRD"),
    ("PLAN.md", "Production plan", "# PLAN"),
    ("TODO.md", "Todo list", "# TODO"),
    ("README.md", "Project README", None),
    ("package.json", "Remotion package.json", '"name"'),
    ("tsconfig.json", "TypeScript config", "compilerOptions"),
    ("remotion.config.ts", "Remotion config", "Config"),
    (".gitignore", "Git ignore rules", "node_modules"),
    (".env.example", "Env template", "SEEDANCE_API_KEY"),

    # --- Remotion source ---
    ("src/Root.tsx", "Remotion root", "Composition"),
    ("src/Composition.tsx", "Main composition", "Sequence"),
    ("src/theme.ts", "Design tokens", "palette"),

    # --- Scene components ---
    ("src/scenes/Scene1Hero.tsx", "Scene 1 — Hero", "Aura"),
    ("src/scenes/Scene2Problem.tsx", "Scene 2 — Problem", None),
    ("src/scenes/Scene3Intro.tsx", "Scene 3 — Product intro", "Aura"),
    ("src/scenes/Scene4Lifestyle.tsx", "Scene 4 — Lifestyle", None),
    ("src/scenes/Scene5Features.tsx", "Scene 5 — Features", None),
    ("src/scenes/Scene6Cta.tsx", "Scene 6 — CTA", "www.aura-waters.com"),

    # --- Script (Fountain format) ---
    ("script/script.fountain", "Fountain screenplay", "INT."),

    # --- Music ---
    ("music/song-lyrics.md", "Song lyrics", "Aura"),
    ("music/song-spec.json", "Song JSON spec", '"bpm"'),
    ("music/suno-prompt.txt", "Suno prompt", "Style of Music"),

    # --- Python fallback ---
    ("python/README.md", "Python pipeline README", "Seedance"),
    ("python/seedance_client.py", "Seedance client", "class SeedanceClient"),
    ("python/generate_assets.py", "Asset generator", "PROMPTS"),
    ("python/requirements.txt", "Python dependencies", "requests"),

    # --- Docs / screenshots placeholders ---
    ("docs/screenshots/README.md", "Screenshot index", "01-prompt"),
    ("docs/screenshots/01-prompt.md", "Screenshot 1 placeholder", None),
    ("docs/screenshots/02-render.md", "Screenshot 2 placeholder", None),
    ("docs/screenshots/03-output.md", "Screenshot 3 placeholder", None),
]


def main() -> int:
    print(f"Verifying project structure in: {PROJECT_ROOT}\n")
    missing: list[tuple[str, str]] = []
    empty: list[tuple[str, str]] = []
    bad_content: list[tuple[str, str]] = []

    for rel, desc, must_contain in REQUIRED_FILES:
        path = PROJECT_ROOT / rel
        if not path.exists():
            missing.append((rel, desc))
            print(f"  [MISSING] {rel}  ({desc})")
            continue
        try:
            content = path.read_text(encoding="utf-8")
        except OSError as exc:
            missing.append((rel, f"{desc} — read error: {exc}"))
            print(f"  [ERROR]   {rel}  ({exc})")
            continue
        if not content.strip():
            empty.append((rel, desc))
            print(f"  [EMPTY]   {rel}")
            continue
        if must_contain and must_contain not in content:
            bad_content.append((rel, f"missing substring: {must_contain!r}"))
            print(f"  [BAD]     {rel}  (expected to contain {must_contain!r})")
            continue
        size = path.stat().st_size
        print(f"  [OK]      {rel}  ({size} bytes)")

    print()
    if missing or empty or bad_content:
        print("FAIL — issues detected:")
        for rel, desc in missing:
            print(f"  - MISSING: {rel}  ({desc})")
        for rel, desc in empty:
            print(f"  - EMPTY:   {rel}  ({desc})")
        for rel, desc in bad_content:
            print(f"  - BAD:     {rel}  ({desc})")
        print(f"\nTotal: {len(missing)} missing, {len(empty)} empty, {len(bad_content)} bad content")
        return 1

    print(f"OK — all {len(REQUIRED_FILES)} required files present and well-formed.")
    print()
    print("Next steps:")
    print("  1. npm install")
    print("  2. npx remotion studio       # preview")
    print("  3. npx remotion render src/Composition.tsx out/aura-60s.mp4")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
