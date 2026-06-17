#!/usr/bin/env bash
# Paper-reading → Hexo bridge posts → generate → (commit) → deploy
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
SUBMODULE_PATH="submodule/paper-with-code-skills"
POSTS_DIR="source/_posts/paper-reading"

PULL_SUBMODULE=false
LOCAL_ONLY=false
SKIP_COMMIT=false

usage() {
  cat <<'EOF'
Usage: deploy.sh [options]

Options:
  --pull-submodule   Fetch and checkout latest submodule remote (default: use pinned gitlink)
  --local-only       Generate and verify only; no commit or hexo deploy
  --no-commit        Deploy without auto-commit (still runs hexo d -g)
  -h, --help         Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pull-submodule) PULL_SUBMODULE=true; shift ;;
    --local-only) LOCAL_ONLY=true; shift ;;
    --no-commit) SKIP_COMMIT=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

cd "$ROOT"

echo "==> Repo: $ROOT"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "hexo" ]]; then
  echo "WARN: current branch is '$BRANCH' (expected 'hexo')" >&2
fi

echo "==> Submodule init"
git submodule update --init "$SUBMODULE_PATH"

if [[ "$PULL_SUBMODULE" == true ]]; then
  echo "==> Submodule update --remote"
  git submodule update --remote "$SUBMODULE_PATH"
fi

if [[ ! -d node_modules ]]; then
  echo "==> npm install"
  npm install
fi

echo "==> hexo clean && hexo generate"
npx hexo clean
npx hexo g 2>&1 | tee /tmp/hexo-paper-reading-build.log | rg "paper-reading|ERROR|error" || true

echo "==> Verify outputs"
fail=0
if [[ ! -d public/paper-reading ]]; then
  echo "FAIL: public/paper-reading/ missing" >&2
  fail=1
fi
html_count="$(find public/paper-reading -maxdepth 1 -name '*.html' ! -name 'index.html' 2>/dev/null | wc -l | tr -d ' ')"
md_count="$(find "$POSTS_DIR" -maxdepth 1 -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
echo "    paper-reading html pages: $html_count"
echo "    bridge md posts: $md_count"
if [[ "$html_count" -lt 1 ]]; then
  echo "WARN: no paper-reading html pages in public/" >&2
fi
if [[ "$md_count" -lt 1 ]]; then
  echo "WARN: no bridge md in $POSTS_DIR" >&2
fi

if [[ "$LOCAL_ONLY" == true ]]; then
  echo "==> Done (local-only). Preview: npx hexo s"
  exit "$fail"
fi

if [[ "$SKIP_COMMIT" == false ]]; then
  echo "==> Stage paper-reading changes"
  git add "$SUBMODULE_PATH" "$POSTS_DIR" 2>/dev/null || true
  if git diff --staged --quiet; then
    echo "    No staged changes to commit"
  else
    echo "==> Commit"
    git commit -m "$(cat <<'EOF'
chore: sync paper-reading submodule and bridge posts

Update submodule pointer and/or generated _posts/paper-reading bridge md
after incremental HTML sync.
EOF
)"
  fi
fi

echo "==> hexo deploy (generate + push to master)"
npx hexo d -g

echo "==> Deploy complete"
exit "$fail"
