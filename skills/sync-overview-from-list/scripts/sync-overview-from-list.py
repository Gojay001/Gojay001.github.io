#!/usr/bin/env python3
"""Sync paper-with-code-list.md → Overview.md with title link enrichment."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LIST_PATH = ROOT / "submodule/paper-with-code-skills/paper-with-code-list.md"
OVERVIEW_PATH = ROOT / "source/_posts/Overview.md"
STATE_PATH = ROOT / "source/_posts/.overview-sync-state.json"
PAPER_READING_DIR = ROOT / "submodule/paper-with-code-skills/paper-reading"
BRIDGE_POSTS_DIR = ROOT / "source/_posts/paper-reading"
ALIASES_PATH = PAPER_READING_DIR / "slug-aliases.json"
SITE_URL = "https://gojay.top"

ANCHOR_MAP = {
    "generative-adversarial-network": "Generative-Adversarial-Network",
    "variational-auto-encoder": "Variational-Auto-Encoder",
    "diffusion-model": "Diffusion-Model",
    "aigc-applications": "AIGC-Applications",
    "face-editing": "Face-Editing",
    "face-swapping": "Face-Swapping",
    "attention-or-transformer": "Attention-or-Transformer",
    "vision-transformer": "Vision-Transformer",
    "pre-trained-language-model": "Pre-trained-Language-Model",
    "large-language-model": "Large-Language-Model",
    "vision-language-model": "Vision-Language-Model",
    "backbone": "Backbone",
    "optimization": "Optimization",
    "object-detection": "Object-Detection",
    "object-segmentation": "Object-Segmentation",
    "object-tracking": "Object-Tracking",
    "multiple-object-tracking": "Multiple-Object-Tracking",
    "visual-object-tracking": "Visual-Object-Tracking",
    "few-shot-segmentation": "Few-Shot-Segmentation",
    "few-shot-learning": "Few-Shot-Learning",
    "3d-face-reconstruction-and-facial-animation": "3D-Face-Reconstruction-and-Facial-Animation",
    "3d-object-detection": "3D-Object-Detection",
    "salient-object-detection": "Salient-Object-Detection",
    "survey": "Survey",
}

TITLE_LINK_RE = re.compile(r"^\[(?P<label>[^\]]+)\]\((?P<url>[^)]+)\)$")
TABLE_ROW_RE = re.compile(r"^\|(.+)\|$")
FRONT_MATTER_END = re.compile(r"(?s)^(---\n.*?\n---\n\n.*?<!-- more -->\n\n)")
TOC_ANCHOR_RE = re.compile(r"\(#([a-zA-Z0-9-]+)\)")
HEXO_ANCHOR_VALUES = frozenset(ANCHOR_MAP.values())


def norm_title(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip()).casefold()


def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def load_state() -> dict:
    if not STATE_PATH.exists():
        return {}
    return json.loads(STATE_PATH.read_text(encoding="utf-8"))


def save_state(list_hash: str) -> None:
    STATE_PATH.write_text(
        json.dumps(
            {
                "list_path": str(LIST_PATH.relative_to(ROOT)),
                "list_hash": list_hash,
                "synced_at": datetime.now(timezone.utc).isoformat(),
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


def parse_title_links(markdown: str) -> dict[str, str]:
    links: dict[str, str] = {}
    for line in markdown.splitlines():
        if not line.startswith("|") or line.startswith("|:") or "---" in line:
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not cells:
            continue
        title = cells[0]
        m = TITLE_LINK_RE.match(title)
        if m:
            links[norm_title(m.group("label"))] = m.group("url")
    return links


def load_title_aliases() -> dict[str, str]:
    """Map list Title labels (normalized) → paper-reading slug."""
    if not ALIASES_PATH.is_file():
        return {}
    data = json.loads(ALIASES_PATH.read_text(encoding="utf-8"))
    return {norm_title(k): str(v).strip() for k, v in data.items()}


def paper_reading_slugs() -> dict[str, str]:
    slugs: dict[str, str] = {}
    html_slugs: set[str] = set()
    if PAPER_READING_DIR.is_dir():
        for html in PAPER_READING_DIR.glob("*.html"):
            if html.name == "index.html":
                continue
            slug = html.stem
            html_slugs.add(slug)
            url = f"{SITE_URL}/paper-reading/{slug}.html"
            slugs[norm_title(slug)] = url
            slugs[norm_title(slug.upper())] = url
    if BRIDGE_POSTS_DIR.is_dir():
        for md in BRIDGE_POSTS_DIR.glob("*.md"):
            slug = md.stem
            html_slugs.add(slug)
            url = f"{SITE_URL}/paper-reading/{slug}.html"
            slugs[norm_title(slug)] = url
            slugs[norm_title(slug.upper())] = url
    for title_key, slug in load_title_aliases().items():
        if slug in html_slugs:
            url = f"{SITE_URL}/paper-reading/{slug}.html"
            slugs[title_key] = url
    return slugs


def title_to_slug_candidates(title: str) -> list[str]:
    plain = TITLE_LINK_RE.match(title)
    label = plain.group("label") if plain else title
    base = label.strip()
    cands = [
        norm_title(base),
        norm_title(base.replace(" ", "")),
        norm_title(base.replace(" ", "-")),
        norm_title(re.sub(r"[^a-zA-Z0-9]+", "", base)),
    ]
    out: list[str] = []
    for c in cands:
        if c and c not in out:
            out.append(c)
    return out


def resolve_title_link(title: str, known: dict[str, str], reading: dict[str, str]) -> str | None:
    if TITLE_LINK_RE.match(title):
        return None
    key = norm_title(title)
    if key in known:
        return known[key]
    for cand in title_to_slug_candidates(title):
        if cand in reading:
            return reading[cand]
    return None


def format_title_link(title: str, url: str) -> str:
    label = TITLE_LINK_RE.match(title).group("label") if TITLE_LINK_RE.match(title) else title.strip()
    return f"[{label}]({url})"


def enrich_list_tables(text: str, known_links: dict[str, str]) -> tuple[str, int]:
    reading = paper_reading_slugs()
    lines = text.splitlines()
    out: list[str] = []
    added = 0
    for line in lines:
        if not TABLE_ROW_RE.match(line) or line.startswith("|:") or set(line.replace("|", "").strip()) <= {"-"}:
            out.append(line)
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 2 or cells[0].lower() == "title":
            out.append(line)
            continue
        url = resolve_title_link(cells[0], known_links, reading)
        if url:
            new_title = format_title_link(cells[0], url)
            if new_title != cells[0]:
                cells[0] = new_title
                added += 1
        out.append("| " + " | ".join(cells) + " |")
    return "\n".join(out), added


def to_hexo_anchor(slug: str) -> str:
    key = slug.lower()
    if key in ANCHOR_MAP:
        return ANCHOR_MAP[key]
    if slug in HEXO_ANCHOR_VALUES:
        return slug
    return slug


def upgrade_toc_anchors(line: str) -> str:
    return TOC_ANCHOR_RE.sub(lambda m: f"(#{to_hexo_anchor(m.group(1))})", line)


def normalize_list_toc_anchors(list_text: str) -> str:
    lines = list_text.splitlines()
    out: list[str] = []
    in_toc = False
    for line in lines:
        if line.startswith("- **AIGC**"):
            in_toc = True
        if in_toc and line.startswith("## "):
            in_toc = False
        if in_toc:
            line = upgrade_toc_anchors(line)
        out.append(line)
    return "\n".join(out)


def extract_toc_lines(list_text: str) -> list[str]:
    toc: list[str] = []
    in_toc = False
    for line in list_text.splitlines():
        if line.startswith("- **AIGC**"):
            in_toc = True
        if in_toc:
            if line.startswith("## "):
                break
            toc.append(line)
    return toc


def toc_to_overview(toc_lines: list[str]) -> str:
    body: list[str] = []
    for line in toc_lines:
        line = upgrade_toc_anchors(line)
        if line.startswith("- **"):
            body.append(line.replace("  ", "    ", 1) if line.startswith("- **") else line)
        elif line.startswith("  - ["):
            body.append("    " + line.strip())
        elif line.startswith("    - ["):
            body.append("        " + line.strip())
        elif line.strip() == "- Others" or line.startswith("  - Others"):
            body.append("    - Others")
        else:
            body.append(line)
    return "# Contents\n---\n" + "\n".join(body) + "\n\n"


def compact_table_line(line: str) -> str:
    if not line.startswith("|") or line.startswith("|:") or set(line.replace("|", "").strip()) <= {"-"}:
        return line
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    return "| " + " | ".join(cells) + " |"


def normalize_tables(body: str) -> str:
    body = re.sub(
        r"\| Title\s+\| Paper\s+\| Conf\s+\| Code\s+\|\n\| [-| ]+\|\n",
        "| Title | Paper | Conf | Code |\n|:--------|:--------:|:--------:|:--------:|\n",
        body,
    )
    body = re.sub(
        r"\| Title\s+\| Paper\s+\| Conf\s+\|\n\| [-| ]+\|\n",
        "| Title | Paper | Conf |\n|:--------|:--------:|:--------:|\n",
        body,
    )
    lines = [compact_table_line(l) for l in body.splitlines()]
    return re.sub(r"\n{3,}", "\n\n", "\n".join(lines))


def build_overview(list_text: str, overview_text: str) -> str:
    m = FRONT_MATTER_END.search(overview_text)
    if not m:
        raise SystemExit(f"Cannot find front matter block in {OVERVIEW_PATH}")
    head = m.group(1)
    head = head.replace(
        "https://github.com/Gojay001/DeepLearning-Paper-with-Code.",
        "https://github.com/Gojay001/paper-with-code-skills.",
    )
    if "paper-with-code-skills" not in head:
        head = re.sub(
            r"(> https://github.com/Gojay001/[^\n]+)",
            "> https://github.com/Gojay001/paper-with-code-skills.",
            head,
            count=1,
        )

    marker = "## Generative Adversarial Network"
    if marker not in list_text:
        raise SystemExit(f"Missing section marker in {LIST_PATH}")
    body = list_text[list_text.index(marker) :]
    body = normalize_tables(body)
    contents = toc_to_overview(extract_toc_lines(list_text))
    return head + contents + body + ("\n" if not body.endswith("\n") else "")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true", help="Sync even if list hash unchanged")
    parser.add_argument("--no-enrich-links", action="store_true", help="Skip auto title links in list")
    parser.add_argument("--check", action="store_true", help="Exit 1 if sync would write files")
    args = parser.parse_args()

    if not LIST_PATH.is_file():
        print(f"overview-sync: skip, list not found: {LIST_PATH}", file=sys.stderr)
        return 0
    if not OVERVIEW_PATH.is_file():
        print(f"overview-sync: skip, overview not found: {OVERVIEW_PATH}", file=sys.stderr)
        return 0

    list_text = normalize_list_toc_anchors(LIST_PATH.read_text(encoding="utf-8"))
    overview_text = OVERVIEW_PATH.read_text(encoding="utf-8")
    known_links = parse_title_links(overview_text)
    known_links.update(parse_title_links(list_text))

    if not args.no_enrich_links:
        enriched, added = enrich_list_tables(list_text, known_links)
        if added:
            print(f"overview-sync: enriched {added} title link(s) in paper-with-code-list.md")
            list_text = enriched

    list_hash = sha256(list_text)
    state = load_state()
    new_overview = build_overview(list_text, overview_text)

    list_changed = list_text != LIST_PATH.read_text(encoding="utf-8")
    overview_changed = new_overview != overview_text
    hash_changed = state.get("list_hash") != list_hash

    if not args.force and not hash_changed and not list_changed and not overview_changed:
        print("overview-sync: list unchanged, skip")
        return 0

    if args.check:
        print("overview-sync: changes pending", file=sys.stderr)
        return 1

    if list_changed:
        LIST_PATH.write_text(list_text, encoding="utf-8")
        print(f"overview-sync: updated {LIST_PATH.relative_to(ROOT)}")
    if overview_changed:
        OVERVIEW_PATH.write_text(new_overview, encoding="utf-8")
        print(f"overview-sync: updated {OVERVIEW_PATH.relative_to(ROOT)}")
    save_state(list_hash)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
