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

**Default full flow:** submodule init → (optional remote pull) → `hexo clean && hexo g` → verify → commit submodule + `source/_posts/paper-reading/` if changed → `hexo d -g`.

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

1. In `paper-with-code-skills` repo: generate `{slug}.html` + `assets/{slug}/` (paper-logic-reading skill)
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

Message: `chore: sync paper-reading submodule and bridge posts`

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
| Deploy auth fails | GitHub SSH/key for `hexo-deployer-git` |

## Reference

- Design spec: [docs/superpowers/specs/2026-06-17-paper-reading-deploy-design.md](../../docs/superpowers/specs/2026-06-17-paper-reading-deploy-design.md)
- Sync script: [scripts/paper-reading.js](../../scripts/paper-reading.js)
