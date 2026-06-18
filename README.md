# Gojay001.github.io

基于 [Hexo](https://hexo.io/) 搭建的个人博客源码仓库，支持两种内容来源：

- **本地 Markdown 博文**：在 `source/_posts/` 手写 `.md`，由 Hexo 渲染为常规文章页。
- **Submodule 精读 HTML**：在 [paper-with-code-skills](https://github.com/Gojay001/paper-with-code-skills) 子模块中生成三栏批注 HTML，构建时同步为桥接博文并部署到 `/paper-reading/`。

站点地址：[https://gojay.top](https://gojay.top)

## 1. 仓库作用

- **博客生成**：本地编写 Markdown、配置主题与插件，通过 `hexo generate` 渲染静态站点。
- **精读页部署**：子模块 `paper-reading/*.html` 原样复制到 `public/paper-reading/`，并自动生成 `source/_posts/paper-reading/*.md` 桥接博文（出现在首页、分类、标签，点击跳转精读 HTML）。
- **访问方式**
  - **GitHub Pages 默认域名**：`https://<你的 GitHub 用户名>.github.io`（本仓库：`https://Gojay001.github.io`）
  - **自定义域名**：`source/CNAME` 当前为 `gojay.top`，需在域名服务商配置 CNAME 到 `<用户名>.github.io`。

## 2. 分支管理


| 分支           | 用途                                                                                      |
| ------------ | --------------------------------------------------------------------------------------- |
| **hexo**（默认） | Hexo **源码**：文章、`source/`、主题、`_config.yml`、`package.json`、子模块指针、`skills/` 等。日常写作与构建在此分支。 |
| **master**   | **发布分支**：`hexo deploy`（`hexo d -g`）将 `public/` 推送到此分支，供 GitHub Pages 展示。                |


`_config.yml` 中 `deploy.branch` 已设为 `master`。

## 3. 目录结构

以下为当前主要结构（`node_modules/`、`public/`、`db.json`、`.deploy_git/` 等见 `.gitignore`，通常不提交）。

```
.
├── _config.yml                    # Hexo 全局配置（含 paper_reading 块）
├── package.json
├── package-lock.json
├── README.md
├── scaffolds/                     # 新建文章模板
├── scripts/
│   ├── index-generator-top.js     # 首页置顶排序
│   └── paper-reading.js           # 精读 HTML → 桥接 md + 静态复制
├── skills/                        # Agent 通用 skill（任意工具可读）
│   └── hexo-paper-reading-deploy/
│       ├── SKILL.md
│       └── scripts/deploy.sh      # 一键同步 + 构建 + 部署
├── .cursor/
│   └── skills -> ../skills        # Cursor 软链接
├── docs/
│   └── superpowers/specs/
│       └── 2026-06-17-paper-reading-deploy-design.md
├── submodule/
│   └── paper-with-code-skills/    # Git 子模块（精读 HTML 来源）
│       └── paper-reading/
│           ├── ddpm.html
│           ├── {slug}.html
│           └── assets/{slug}/...
├── source/
│   ├── CNAME
│   ├── Staticfile
│   ├── _posts/
│   │   ├── *.md                   # 手写的常规博文
│   │   └── paper-reading/           # 由构建脚本从 HTML 同步的桥接博文
│   │       ├── .sync-state.json     # 上次同步的 submodule commit
│   │       └── {slug}.md
│   ├── about/
│   └── gallery/
├── themes/
│   ├── icarus/                    # 当前主题
│   ├── landscape/
│   └── yilia/
└── blog_images/
```

克隆后需执行：

```bash
git clone --recurse-submodules git@github.com:Gojay001/Gojay001.github.io.git
cd Gojay001.github.io
git checkout hexo
npm install
```

若已克隆但未拉取子模块：

```bash
git submodule update --init
```

## 4. 内容方式：Markdown 与精读 HTML

### 4.1 本地 Markdown 博文

适用于常规技术笔记、论文导读（Hexo 正文）、剑指 Offer 等。

**写作**

```bash
npx hexo new "My Post Title"
# 编辑 source/_posts/My-Post-Title.md
```

**Front matter 示例**

```yaml
---
title: DeepSORT
date: 2020-06-20 10:35:15
categories:
  - DeepLearning
  - Object Tracking
tags: [DL, Tracking]
thumbnail: /gallery/thumbnails/DeepSORT.png
---
```

**行为**：Hexo 渲染为 `/YYYY/MM/DD/title/` 文章页，出现在首页、Archives、Categories、Tags。

---

### 4.2 Submodule 精读 HTML

适用于 [paper-logic-reading](https://github.com/Gojay001/paper-with-code-skills) 生成的三栏批注精读页（原文 | 翻译 | 解析）。

**内容来源**：`submodule/paper-with-code-skills/paper-reading/{slug}.html` + `assets/{slug}/`

**构建时自动完成**


| 步骤      | 说明                                                                                 |
| ------- | ---------------------------------------------------------------------------------- |
| 增量同步 md | 对比 submodule commit 差异，仅更新有变动的 HTML 对应桥接 md                                        |
| 桥接博文    | 写入 `source/_posts/paper-reading/{slug}.md`（含 `link`、`excerpt`、`categories`、`tags`） |
| 静态部署    | 复制 HTML + assets → `public/paper-reading/`                                         |
| 专题索引    | 生成 `/paper-reading/` 列表页                                                           |


**访问路径**

- 首页卡片 → 点击跳转 `/paper-reading/{slug}.html`（原始精读页）
- 专题列表 → `/paper-reading/`

**新增一篇精读（内容侧）**

1. 在 `paper-with-code-skills` 仓库用 skill 生成 `{slug}.html` 及 `assets/{slug}/`
2. 在子模块仓库 commit & push
3. 回到本仓库更新子模块指针（或由部署 skill 的 `--pull-submodule` 拉取）

更完整设计见 [docs/superpowers/specs/2026-06-17-paper-reading-deploy-design.md](docs/superpowers/specs/2026-06-17-paper-reading-deploy-design.md)。

## 5. 部署方式

### 5.1 手动部署

#### 仅 Markdown 变更

```bash
# 在 hexo 分支
npx hexo clean && npx hexo g          # 本地生成
npx hexo s                            # 可选：本地预览 http://localhost:4000

git add source/_posts/ ...            # 提交改动的 md
git commit -m "feat: add post about ..."
npx hexo d -g                         # 生成并推送到 master
```

#### 含精读 HTML（子模块）变更

```bash
git submodule update --init
git submodule update --remote submodule/paper-with-code-skills   # 拉取子模块最新

npx hexo clean && npx hexo g
# 日志期望：
#   paper-reading: incremental sync ...  或  skip post sync（无变化）
#   paper-reading: deployed N page(s) to /paper-reading/

# 提交子模块指针 + 桥接 md + sync state
git add submodule/paper-with-code-skills source/_posts/paper-reading/
git commit -m "chore: sync paper-reading submodule and bridge posts"

npx hexo d -g
```

#### 本地仅验证（不部署）

```bash
git submodule update --init
npx hexo clean && npx hexo g
npx hexo s
```

验证精读页：`http://localhost:4000/paper-reading/ddpm.html`  
验证首页卡片：列表中应出现对应标题，链接指向 `/paper-reading/{slug}.html`。

---

### 5.2 通过 Skill 一键部署

Skill 路径：`skills/hexo-paper-reading-deploy/`（Cursor 通过 `.cursor/skills` 软链接加载）。

在 Cursor 中调用该 skill，或手动执行：

```bash
chmod +x skills/hexo-paper-reading-deploy/scripts/deploy.sh

# 全流程：拉取子模块 → hexo g → 有变更则 commit → hexo d -g
skills/hexo-paper-reading-deploy/scripts/deploy.sh --pull-submodule

# 仅本地生成与验证（不 commit、不 deploy）
skills/hexo-paper-reading-deploy/scripts/deploy.sh --local-only

# 部署但不自动 commit
skills/hexo-paper-reading-deploy/scripts/deploy.sh --pull-submodule --no-commit
```


| 参数                 | 作用                                      |
| ------------------ | --------------------------------------- |
| `--pull-submodule` | 拉取 `paper-with-code-skills` 远程最新 commit |
| `--local-only`     | 只执行 `hexo g` 与输出校验                      |
| `--no-commit`      | 跳过自动 commit，仍执行 `hexo d -g`             |


典型场景：子模块已 push 新 HTML → 调用 skill → 自动增量同步 md、提交、部署。

## 6. 常用命令速查


| 命令                                  | 说明                |
| ----------------------------------- | ----------------- |
| `npx hexo s`                        | 本地预览（可先 `hexo g`） |
| `npx hexo g`                        | 生成静态站到 `public/`  |
| `npx hexo d -g`                     | 生成并部署到 `master`   |
| `npx hexo new <title>`              | 新建 Markdown 博文    |
| `git submodule update --init`       | 初始化子模块            |
| `skills/.../deploy.sh --local-only` | 精读相关本地构建验证        |

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

更详细的 Hexo 安装、主题与域名说明见站内文章：[source/_posts/Hexo-Blog-Pages.md](source/_posts/Hexo-Blog-Pages.md)。  
更多命令与排错以 [Hexo 官方文档](https://hexo.io/docs/) 为准。