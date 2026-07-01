---
name: sync-overview-from-list
description: Keeps paper-with-code-list.md and Overview.md in sync—TOC, categories, paper tables, and gojay.top title links. Enriches list Title cells for paper-reading HTML or bridge md, then regenerates Overview. Use when paper-with-code-list changes, Overview is stale, sync overview, 同步 Overview, or after new paper-reading HTML/md.
---

# Sync Overview from List

Canonical path: `skills/sync-overview-from-list/`  
Cursor loads via symlink: `.cursor/skills` → `../skills`.

**Single source of truth:** `submodule/paper-with-code-skills/paper-with-code-list.md`  
**Blog mirror:** `source/_posts/Overview.md` (Hexo front matter preserved)

**Row order:** within each list section table, rows with an arXiv link in the Paper column must be sorted by **arxiv_id ascending** (`YYYY.NNNNN`). Rows without arXiv stay after arxiv-linked rows. When editing the list, insert at the correct slot — do not append unless it is the newest arxiv_id in that section.

Invoke this skill → **run the sync script immediately**.

## Auto-run

From repo root:

```bash
python3 skills/sync-overview-from-list/scripts/sync-overview-from-list.py
```

| Flag | When |
|------|------|
| `--force` | Regenerate even if list hash unchanged |
| `--no-enrich-links` | Copy list → Overview only; do not add Title links |
| `--check` | Exit 1 if sync would write (CI dry-run) |

## What the script does

1. **Enrich links** in `paper-with-code-list.md` Title column (unless `--no-enrich-links`):
   - Keep existing `[Title](url)` cells
   - Else reuse links already in Overview or list
   - Else match `paper-reading/{slug}.html` by Title ↔ slug (e.g. `DDPM` → `ddpm`)
   - Else match `paper-reading/slug-aliases.json` when list Title ≠ HTML slug (e.g. `SD 1.x` → `sd`)
   - Else if bridge md exists → same URL pattern
2. **Incremental gate:** `.overview-sync-state.json` stores list content hash; skip if unchanged (unless `--force`)
3. **Normalize TOC anchors** in `paper-with-code-list.md` to Hexo heading ids (Title-Case, e.g. `#Diffusion-Model`, not `#diffusion-model`)
4. **Regenerate Overview:** keep front matter + `<!-- more -->`; rebuild `# Contents` with the same Hexo anchors + all `##` sections from list

Example Title link (paper-reading):

```markdown
| [DDPM](https://gojay.top/paper-reading/ddpm.html) | [Denoising Diffusion ...](https://arxiv.org/...) | arXiv(2020) / NIPS(2020) | [PyTorch](...) |
```

## When to run

| Event | Action |
|-------|--------|
| Edit `paper-with-code-list.md` (TOC, rows, conf, code) | Run sync → commit list in **submodule** + Overview on **hexo** |
| New `paper-reading/{slug}.html` + bridge md | If list Title ≠ slug, add `paper-reading/slug-aliases.json` → run sync |
| New Hexo blog post for a list paper | Add `[Title](https://gojay.top/...)` in list Title cell → run sync |
| CI / deploy skill | `deploy.sh` runs sync after submodule init (before `hexo g`) |

## Commit rules

| File | Repository |
|------|------------|
| `paper-with-code-list.md` | `paper-with-code-skills` |
| `paper-reading/slug-aliases.json` | `paper-with-code-skills` (when Title ≠ slug) |
| `source/_posts/Overview.md` | `Gojay001.github.io` (hexo) |
| `source/_posts/.overview-sync-state.json` | hexo (optional, track for incremental) |

If enrich modifies the list inside submodule, **commit & push submodule first**, then update gitlink on hexo.

## Verify

```bash
python3 skills/sync-overview-from-list/scripts/sync-overview-from-list.py
npx hexo g
# Spot-check: /categories/Overview/ and in-page TOC anchors
diff submodule/paper-with-code-skills/paper-with-code-list.md source/_posts/Overview.md  # body should match aside from front matter/TOC anchors
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Title not linked after new HTML | Slug must match Title (e.g. `DDPM` → `ddpm.html`), or add `paper-reading/slug-aliases.json` (e.g. `"SD 1.x": "sd"`); re-run without `--no-enrich-links` |
| Overview TOC anchor 404 | Run sync (or `--force`); TOC must use Hexo ids (`#Diffusion-Model`). Script upgrades legacy lowercase anchors in list + Overview |
| Submodule list changed but hexo not updated | Commit list in submodule, bump pointer, run sync on hexo |
| Script skips | Delete `source/_posts/.overview-sync-state.json` or use `--force` |

## Reference

- Deploy pipeline: [skills/hexo-paper-reading-deploy/SKILL.md](../hexo-paper-reading-deploy/SKILL.md)
- Paper-reading taxonomy: same list file (see deploy skill)
