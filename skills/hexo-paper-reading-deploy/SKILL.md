---
name: hexo-paper-reading-deploy
description: Runs the full Gojay Hexo blog paper-reading pipeline—submodule sync, incremental bridge-md generation, hexo generate, verify, commit, and hexo deploy. Use when the user invokes this skill, asks to deploy the blog, sync paper-reading, 精读部署, 增量更新精读, 发布博客, or run npx hexo d -g after submodule HTML changes.
---

# Hexo Paper-Reading Deploy

Canonical path: `skills/hexo-paper-reading-deploy/` (agent-agnostic).  
Cursor loads via symlink: `.cursor/skills` → `../skills`.

Invoke this skill → **run the deploy script immediately** (do not only describe steps).

## Auto-run (default)

From repo root:

```bash
chmod +x skills/hexo-paper-reading-deploy/scripts/deploy.sh
skills/hexo-paper-reading-deploy/scripts/deploy.sh --pull-submodule
```

| Flag | When |
|------|------|
| `--pull-submodule` | Submodule already pushed; pull latest into blog repo |
| `--local-only` | User wants `hexo g` + verify only, no commit/deploy |
| `--no-commit` | Deploy without auto-commit staged changes |
| `--push-hexo` | Push `hexo` after sync commit (default when `CI=true`) |

**Default full flow:** submodule init → **Overview sync** → (optional remote pull) → `hexo clean && hexo g` → verify → commit submodule + `source/_posts/paper-reading/` + Overview if changed → (`git push origin hexo` in CI) → `hexo d -g`.

Overview sync: [skills/sync-overview-from-list/SKILL.md](../sync-overview-from-list/SKILL.md) (runs automatically in `deploy.sh`; normalizes TOC anchors to Hexo ids like `#Diffusion-Model`).

**Script path:** always invoke via `skills/hexo-paper-reading-deploy/scripts/deploy.sh` (repo root resolved with `git rev-parse --show-toplevel`, works from `skills/` and `.cursor/skills/`).

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/hexo-deploy.yml`  
Notify (submodule): `paper-with-code-skills/.github/workflows/notify-blog.yml` (template: `docs/superpowers/templates/notify-blog.yml`)

| Trigger | deploy.sh |
|---------|-----------|
| `paper-with-code-skills` push → `repository_dispatch` | `--pull-submodule` |
| push to `hexo` (no `[skip ci]`) | pinned submodule |
| manual `workflow_dispatch` | optional `--pull-submodule` |

**Secrets — blog repo (`Gojay001.github.io`):**

| Secret | Where to put | Notes |
|--------|--------------|-------|
| `HEXO_DEPLOY_KEY` | Actions Secrets | **Private** key; pairs with Deploy keys (public key, **Allow write access**) |
| `SUBMODULE_PAT` | Actions Secrets | Only if submodule repo is private |

**Secrets — submodule repo (`paper-with-code-skills`):**

| Secret | Notes |
|--------|-------|
| `BLOG_REPO_PAT` | Fine-grained PAT: target blog repo, **Actions: Read and write** |

**Submodule default branch:** `master` (not `main`).

Bot sync commits use subject `... [skip ci]` to avoid redeploy loops. CI sets `git config --global user.*` (required by `hexo-deployer-git` in `.deploy_git`) and `PUSH_HEXO=true`.

**CI early-exit:** on `--pull-submodule`, compares `git -C submodule rev-parse HEAD` before/after `--remote`; skips build only when submodule HEAD unchanged.

## Prerequisites

- Branch: **hexo** (source); deploy pushes static site to **master**
- Submodule: `submodule/paper-with-code-skills/paper-reading/*.html`
- Bridge posts: `source/_posts/paper-reading/*.md` + `.sync-state.json` (git-tracked)
- Config: `_config.yml` → `paper_reading.*`

## What the build does

1. **`hexo.on('ready')`** — incremental md sync (`scripts/paper-reading.js`)
   - Submodule commit unchanged → skip (no HTML scan)
   - Commit changed → `git diff --name-status` on `paper-reading/` → only update changed slugs
2. **`hexo g`** — normal site + `/paper-reading/` index
3. **`generateAfter`** — copy HTML + `assets/` → `public/paper-reading/`

## New paper workflow (before calling this skill)

1. In `paper-with-code-skills` repo: generate `{slug}.html` + `assets/{slug}/` — see [submodule `skills/paper-logic-reading/SKILL.md`](../../submodule/paper-with-code-skills/skills/paper-logic-reading/SKILL.md) (figure extraction, lightbox)
2. Commit & push submodule
3. **Then invoke this skill** (with `--pull-submodule`)

## Verify after generate

```bash
ls source/_posts/paper-reading/
ls public/paper-reading/
rg "paper-reading" /tmp/hexo-paper-reading-build.log
```

Expect logs like:
- `paper-reading: submodule unchanged (...), skip post sync` OR
- `paper-reading: incremental sync ...` OR
- `paper-reading: full sync ...`
- `paper-reading: deployed N page(s) to /paper-reading/`

## Commit rules (when script commits)

Stage only:
- `submodule/paper-with-code-skills`
- `source/_posts/paper-reading/`

Message: `chore: sync paper-reading submodule and bridge posts` (CI adds `[skip ci]` to subject)

**Do not commit** unless user asked or this skill's full deploy path runs.

## Local preview (no deploy)

```bash
skills/hexo-paper-reading-deploy/scripts/deploy.sh --local-only
npx hexo s
# http://localhost:4000/
# http://localhost:4000/paper-reading/{slug}.html
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `skip post sync, source not found` | `git submodule update --init` |
| No new md after submodule update | Check `.sync-state.json` commit; ensure HTML under `paper-reading/` changed |
| Thumbnail cropped | `thumbnail_fit: contain` on `paper_reading` posts (auto-set by sync) |
| Deploy auth fails (local) | GitHub SSH/key for `hexo-deployer-git` |
| CI: `ssh-private-key argument is empty` | Add **Actions Secret** `HEXO_DEPLOY_KEY` (private key); Deploy keys page only holds public key |
| CI: `fatal: not in a git directory` | Invoke script via `skills/.../deploy.sh`, not `.cursor/skills/...` with wrong `ROOT` (fixed: `git rev-parse --show-toplevel`) |
| CI: `Author identity unknown` / exit 2 on `hexo d -g` | CI must set `git config --global user.name/email` (`.deploy_git` is a separate repo) |
| CI: dispatch succeeded but site unchanged | Early-exit must compare submodule **HEAD** (`git -C submodule rev-parse HEAD`), not parent gitlink |
| CI: `git push origin hexo` rejected (fetch first) | Concurrent hexo pushes; deploy.sh rebases before push (`git pull --rebase origin hexo`) |
| CI: `rg: command not found` | Harmless if build continues; deploy.sh uses `grep` on CI runners |

## Bridge post taxonomy (`source/_posts/paper-reading/`)

Each `{slug}.md` is **auto-generated** by `scripts/paper-reading.js`. Taxonomy follows **`submodule/paper-with-code-skills/paper-with-code-list.md`** (same tree as the Paper-with-Code list). Re-run sync after HTML `.meta` or list structure changes — do not hand-edit front matter unless overriding a one-off case.

### Inputs

| Source | Field | Example (ddpm) |
|--------|-------|----------------|
| HTML `<div class="meta">` | Subcategory hint (2nd ` · ` segment) | `Diffusion Model` |
| HTML `<title>` | Paper title / acronym | `DDPM — Denoising Diffusion Probabilistic Models` |
| `paper-with-code-list.md` | Top domain + section + paper table | `AIGC` → `## Diffusion Model` → row `DDPM` |

Meta line format (segment 1 is boilerplate, segment 3+ is venue — ignored for taxonomy):

```html
<div class="meta">DeepLearning-Paper-with-Code · Diffusion Model · arXiv(2020) / NeurIPS(2020)</div>
```

### Categories (2 levels)

| Level | Rule | ddpm |
|-------|------|------|
| 1 — top domain | Lookup subcategory in `paper-with-code-list.md` TOC (`**AIGC**`, `**CV**`, `**LLM / VLM**`, …) | `AIGC` |
| 2 — subcategory | HTML meta segment 2, matched to `##` / `###` heading in the list | `Diffusion Model` |

**Lookup order**

1. Meta segment 2 → list section name (case-insensitive)
2. Else title acronym / slug → first column of list table (e.g. `DDPM`)
3. Fallback: `[Paper, {meta segment 2}]` or `[Paper Reading, {ACRONYM}]`

**Top domains** (from list TOC): `AIGC`, `LLM / VLM`, `CV`

**ddpm example:** `[AIGC, Diffusion Model]`

### Tags (3 tokens)

Always derived from resolved categories — **not** copied verbatim from meta venues:

| Tag | Rule | ddpm |
|-----|------|------|
| `DL` | Fixed (Paper-with-Code domain) | `DL` |
| `{topDomain}` | Same as categories[0] | `AIGC` |
| `{abbr}` | Subcategory abbreviation | `DM` |

**Subcategory abbreviations** (explicit map first, else word initials):

| Subcategory | Abbr |
|-------------|------|
| Diffusion Model | `DM` |
| Generative Adversarial Network | `GAN` |
| Variational Auto-Encoder | `VAE` |
| Vision Transformer | `ViT` |
| Few-Shot Segmentation | `FSS` |
| Few-Shot Learning | `FSL` |
| Multiple Object Tracking | `MOT` |
| Visual Object Tracking | `VOT` |
| Object Detection | `OD` |
| Object Segmentation | `OS` |
| Object Tracking | `OT` |
| … | initials fallback |

**ddpm example:** `[DL, AIGC, DM]`

### Other front matter (auto)

| Field | Source |
|-------|--------|
| `link` | `/paper-reading/{slug}.html` |
| `paper_reading` | `true` |
| `excerpt` | First `<p>` in `#feynman` section (≤300 chars) |
| `thumbnail` | First image under `assets/{slug}/` |
| `thumbnail_fit` | `contain` |
| `date` | HTML file mtime |

### Re-sync after rule or list change

```bash
rm source/_posts/paper-reading/.sync-state.json
npx hexo g
```

Incremental sync only rewrites md when submodule commit changes **and** that slug's HTML changed.

For **Overview** ↔ `paper-with-code-list.md` sync, use [skills/sync-overview-from-list/SKILL.md](../sync-overview-from-list/SKILL.md).

## Reference

- Paper reading design: [docs/superpowers/specs/2026-06-17-paper-reading-deploy-design.md](../../docs/superpowers/specs/2026-06-17-paper-reading-deploy-design.md)
- CI/CD design: [docs/superpowers/specs/2026-06-17-hexo-ci-deploy-design.md](../../docs/superpowers/specs/2026-06-17-hexo-ci-deploy-design.md)
- Sync script: [scripts/paper-reading.js](../../scripts/paper-reading.js)
