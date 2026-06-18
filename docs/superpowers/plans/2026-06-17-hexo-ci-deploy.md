# Hexo CI/CD 自动部署 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 子模块 push 或 hexo push 时，GitHub Actions 自动运行 `deploy.sh`，回写 hexo 并 deploy master。

**Architecture:** 子模块 `notify-blog.yml` 发 `repository_dispatch`；博客 `.github/workflows/hexo-deploy.yml` 统一触发 `deploy.sh`（dispatch 带 `--pull-submodule`，hexo push 不带）；`deploy.sh` 在 CI 下 push hexo、`[skip ci]`、early-exit。

**Tech Stack:** GitHub Actions, bash, Hexo 8, hexo-deployer-git, webfactory/ssh-agent

**Spec:** [docs/superpowers/specs/2026-06-17-hexo-ci-deploy-design.md](../specs/2026-06-17-hexo-ci-deploy-design.md)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `skills/hexo-paper-reading-deploy/scripts/deploy.sh` | Modify | CI push hexo, `[skip ci]`, early-exit, verify exit code |
| `.github/workflows/hexo-deploy.yml` | Create | dispatch / push / manual triggers |
| `docs/superpowers/templates/notify-blog.yml` | Create | 子模块仓库 workflow 模板（复制到 paper-with-code-skills） |
| `skills/hexo-paper-reading-deploy/SKILL.md` | Modify | CI 触发说明、Secrets 清单 |
| `README.md` | Modify | § CI/CD 章节 |
| `docs/superpowers/specs/2026-06-17-hexo-ci-deploy-design.md` | Modify | 状态改为「已实现」 |

---

### Task 1: deploy.sh CI 适配

**Files:**
- Modify: `skills/hexo-paper-reading-deploy/scripts/deploy.sh`
- Mirror: `.cursor/skills/hexo-paper-reading-deploy/scripts/deploy.sh`（若为独立文件则同步；当前为 symlink 则只改一处）

- [ ] **Step 1: 新增 flag 与 CI 变量**

在 `SKIP_COMMIT=false` 后增加：

```bash
PUSH_HEXO=false

# CI 默认 push hexo；本地默认不 push
if [[ "${CI:-}" == "true" ]]; then
  PUSH_HEXO=true
fi
```

在 `usage()` 的 Options 块增加：

```
  --push-hexo        Push hexo branch after commit (default when CI=true)
```

在 `while` case 增加：

```bash
    --push-hexo) PUSH_HEXO=true; shift ;;
```

- [ ] **Step 2: CI git 身份 + early-exit**

在 `cd "$ROOT"` 之后、`echo "==> Submodule init"` 之前插入：

```bash
if [[ "${CI:-}" == "true" ]]; then
  git config user.name "github-actions[bot]"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
fi
```

将现有 submodule pull 块替换为：

```bash
echo "==> Submodule init"
git submodule update --init "$SUBMODULE_PATH"

if [[ "$PULL_SUBMODULE" == true ]]; then
  OLD_SHA="$(git rev-parse "$SUBMODULE_PATH")"
  echo "==> Submodule update --remote"
  git submodule update --remote "$SUBMODULE_PATH"
  NEW_SHA="$(git rev-parse "$SUBMODULE_PATH")"

  if [[ "${CI:-}" == "true" && "$OLD_SHA" == "$NEW_SHA" ]]; then
    echo "==> Submodule unchanged ($OLD_SHA), skip build (CI early-exit)"
    exit 0
  fi
fi
```

- [ ] **Step 3: commit message 加 [skip ci] + push hexo**

将 commit 块替换为：

```bash
if [[ "$SKIP_COMMIT" == false ]]; then
  echo "==> Stage paper-reading changes"
  git add "$SUBMODULE_PATH" "$POSTS_DIR" 2>/dev/null || true
  if git diff --staged --quiet; then
    echo "    No staged changes to commit"
  else
    echo "==> Commit"
    git commit -m "$(cat <<'EOF'
chore: sync paper-reading submodule and bridge posts [skip ci]

Update submodule pointer and/or generated _posts/paper-reading bridge md
after incremental HTML sync.
EOF
)"
    if [[ "$PUSH_HEXO" == true ]]; then
      echo "==> Push hexo branch"
      git push origin hexo
    fi
  fi
fi
```

- [ ] **Step 4: verify 失败在 deploy 路径 exit 1**

将末尾改为：

```bash
echo "==> hexo deploy (generate + push to master)"
npx hexo d -g

echo "==> Deploy complete"
if [[ "$fail" -ne 0 ]]; then
  echo "FAIL: verification warnings treated as errors" >&2
  exit 1
fi
exit 0
```

- [ ] **Step 5: 本地验证**

Run:

```bash
cd /Users/bigo10295/Downloads/Gojay001.github.io
bash -n skills/hexo-paper-reading-deploy/scripts/deploy.sh
skills/hexo-paper-reading-deploy/scripts/deploy.sh --local-only
```

Expected: `bash -n` 无输出；local-only 生成 public/paper-reading，exit 0。

Run early-exit dry check (不 deploy):

```bash
CI=true PULL_SUBMODULE=true bash -c '
  source skills/hexo-paper-reading-deploy/scripts/deploy.sh 2>/dev/null || true
'
# 或直接两次 rev-parse 相同则 early-exit — 在 CI 环境实测
```

- [ ] **Step 6: Commit**

```bash
git add skills/hexo-paper-reading-deploy/scripts/deploy.sh
git commit -m "feat: add CI push-hexo, skip-ci, and submodule early-exit to deploy.sh"
```

---

### Task 2: 博客 GitHub Actions workflow

**Files:**
- Create: `.github/workflows/hexo-deploy.yml`

- [ ] **Step 1: 创建 workflow 文件**

```yaml
name: Hexo deploy

on:
  repository_dispatch:
    types: [paper-reading-updated]
  push:
    branches: [hexo]
  workflow_dispatch:
    inputs:
      pull_submodule:
        description: Pull latest paper-with-code-skills remote
        type: boolean
        default: false

concurrency:
  group: hexo-deploy
  cancel-in-progress: false

jobs:
  deploy:
    if: >-
      github.event_name != 'push' ||
      !contains(github.event.head_commit.message, '[skip ci]')
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout hexo branch with submodules
        uses: actions/checkout@v4
        with:
          ref: hexo
          submodules: recursive
          token: ${{ secrets.SUBMODULE_PAT || github.token }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - name: Setup SSH for hexo deploy
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.HEXO_DEPLOY_KEY }}

      - name: Trust GitHub SSH host
        run: ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts

      - name: Run deploy script
        env:
          CI: true
        run: |
          EXTRA=""
          if [[ "${{ github.event_name }}" == "repository_dispatch" ]]; then
            EXTRA="--pull-submodule"
          elif [[ "${{ github.event_name }}" == "workflow_dispatch" && "${{ inputs.pull_submodule }}" == "true" ]]; then
            EXTRA="--pull-submodule"
          fi
          chmod +x skills/hexo-paper-reading-deploy/scripts/deploy.sh
          skills/hexo-paper-reading-deploy/scripts/deploy.sh ${EXTRA}
```

- [ ] **Step 2: YAML 语法检查**

Run:

```bash
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/hexo-deploy.yml'))"
```

Expected: 无异常（若 PyYAML 不可用，用 `actionlint` 或 push 后 Actions UI 验证）。

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/hexo-deploy.yml
git commit -m "feat: add GitHub Actions workflow for hexo auto-deploy"
```

---

### Task 3: 子模块 notify workflow 模板

**Files:**
- Create: `docs/superpowers/templates/notify-blog.yml`

- [ ] **Step 1: 创建模板（供 paper-with-code-skills 仓库复制）**

```yaml
# Copy to: paper-with-code-skills/.github/workflows/notify-blog.yml
# Secret required in submodule repo: BLOG_REPO_PAT

name: Notify blog deploy

on:
  push:
    branches: [main]
    paths:
      - "paper-reading/**"
      - "paper-with-code-list.md"

jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger blog repository_dispatch
        env:
          PAT: ${{ secrets.BLOG_REPO_PAT }}
        run: |
          curl -sf -X POST \
            -H "Authorization: token ${PAT}" \
            -H "Accept: application/vnd.github+json" \
            https://api.github.com/repos/Gojay001/Gojay001.github.io/dispatches \
            -d '{"event_type":"paper-reading-updated","client_payload":{"source_sha":"'"${{ github.sha }}"'"}}'
```

> 若子模块默认分支不是 `main`，改 `branches` 数组。

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/templates/notify-blog.yml
git commit -m "docs: add submodule notify-blog workflow template for CI"
```

---

### Task 4: 更新 SKILL.md 与 README

**Files:**
- Modify: `skills/hexo-paper-reading-deploy/SKILL.md`
- Modify: `README.md`

- [ ] **Step 1: SKILL.md 增加 CI 节**

在 `## Auto-run (default)` 之后插入：

```markdown
## CI/CD (GitHub Actions)

Workflow: `.github/workflows/hexo-deploy.yml`

| Trigger | deploy.sh |
|---------|-----------|
| `paper-with-code-skills` push → `repository_dispatch` | `--pull-submodule` |
| push to `hexo` (no `[skip ci]`) | pinned submodule |
| manual `workflow_dispatch` | optional `--pull-submodule` |

**Secrets (blog repo):** `HEXO_DEPLOY_KEY` (SSH deploy key, write); optional `SUBMODULE_PAT` if submodule private.

**Secrets (submodule repo):** `BLOG_REPO_PAT` → copy workflow from `docs/superpowers/templates/notify-blog.yml`.

Bot sync commits include `[skip ci]` to avoid redeploy loops.
```

- [ ] **Step 2: README 增加 §7 CI/CD**

在文末「常用命令速查」之后追加：

```markdown
## 7. CI/CD 自动部署

推送 `hexo` 或子模块 `paper-reading/**` 更新后，GitHub Actions 自动构建并部署到 `master`。

### 博客仓库 Secrets

| Secret | 说明 |
|--------|------|
| `HEXO_DEPLOY_KEY` | SSH 私钥；Deploy key 勾选 Allow write access |
| `SUBMODULE_PAT` | 仅子模块私有时需要 |

### 子模块仓库

1. 设置 Secret `BLOG_REPO_PAT`（对博客仓库 Contents + Actions write）
2. 复制 `docs/superpowers/templates/notify-blog.yml` → `paper-with-code-skills/.github/workflows/notify-blog.yml`

### 手动触发

GitHub → Actions → Hexo deploy → Run workflow（可选 Pull submodule）。

设计文档：`docs/superpowers/specs/2026-06-17-hexo-ci-deploy-design.md`
```

- [ ] **Step 3: Commit**

```bash
git add skills/hexo-paper-reading-deploy/SKILL.md README.md
git commit -m "docs: document hexo CI/CD triggers and secrets setup"
```

---

### Task 5: 更新 spec 状态 + 上线清单

**Files:**
- Modify: `docs/superpowers/specs/2026-06-17-hexo-ci-deploy-design.md`

- [ ] **Step 1: 将 spec 状态改为已实现**

将第 5 行 `**状态：** 待实现` 改为 `**状态：** 已实现（博客仓库）；子模块 notify workflow 需单独 PR`

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-06-17-hexo-ci-deploy-design.md
git commit -m "docs: mark hexo CI deploy spec as implemented"
```

---

### Task 6: 上线验证（需 GitHub 手动操作）

**无代码变更；在 GitHub Settings 完成。**

- [ ] **Step 1: 博客仓库配置 `HEXO_DEPLOY_KEY`**

```bash
ssh-keygen -t ed25519 -C "hexo-deploy" -f /tmp/hexo-deploy -N ""
# 公钥 /tmp/hexo-deploy.pub → GitHub repo Deploy keys (Allow write)
# 私钥内容 → Secret HEXO_DEPLOY_KEY
```

- [ ] **Step 2: push hexo 分支含 workflow**

```bash
git push origin hexo
```

- [ ] **Step 3: Actions → Hexo deploy → Run workflow**

Expected: job 成功，`master` 有新 commit，`gojay.top` 可访问。

- [ ] **Step 4: 子模块仓库**

- 设 `BLOG_REPO_PAT`
- 复制 `notify-blog.yml` 并 push
- push 测试 HTML → 博客 Actions 自动触发

---

## Spec Coverage Checklist

| Spec 要求 | Task |
|-----------|------|
| repository_dispatch 触发 | Task 2, 3 |
| hexo push 触发 | Task 2 |
| workflow_dispatch | Task 2 |
| deploy.sh CI push hexo | Task 1 |
| [skip ci] 防循环 | Task 1, 2 |
| early-exit | Task 1 |
| Secrets 文档 | Task 4, 6 |
| SKILL 与 README | Task 4 |
| 子模块 workflow | Task 3, 6 |

## Plan Self-Review

- 无 TBD / 占位符
- deploy.sh 与 workflow 代码完整
- 子模块仓库变更通过 template + 手动 PR，符合 spec「单独 PR」
- verify `fail` 在 deploy 路径 exit 1 已覆盖
