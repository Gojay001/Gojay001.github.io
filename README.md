# Gojay001.github.io

基于 [Hexo](https://hexo.io/) 搭建的个人博客源码仓库。

## 1. 仓库作用

- **博客生成**：在本地使用 Hexo 编写 Markdown、配置主题与插件，通过 `hexo generate` 将站点渲染为静态文件。
- **访问方式**
  - **GitHub Pages 默认域名**：`https://<你的 GitHub 用户名>.github.io`  
    例如本仓库对应：`https://Gojay001.github.io`
  - **自定义域名**：在 `source/CNAME` 中写入你的域名（本仓库当前为 `gojay.top`）。需要自行购买域名，并在域名服务商处配置 DNS（通常将裸域或 `www` **CNAME** 到 `<用户名>.github.io`，具体以 GitHub Pages 文档为准）。部署后 GitHub Pages 会读取站点根目录下的 `CNAME` 完成绑定。

## 2. 分支管理

| 分支 | 用途 |
|------|------|
| **hexo**（默认） | 保存 Hexo **源码**：文章、`source/`、主题、`_config.yml`、`package.json` 等。日常写作、`hexo s`、`hexo g`、安装依赖等都在此分支进行。 |
| **master** | **发布用分支**：`hexo deploy`（常用组合 `hexo d -g`：先 `generate` 再 `deploy`）会把渲染结果推送到该分支，供 GitHub Pages 展示。 |

`_config.yml` 里 `deploy` 已配置 `branch: master`，与上述流程一致。若你改用其他发布分支，需同步修改配置。

## 3. 目录结构说明

以下为当前项目主要结构（不含本地生成目录与依赖；`node_modules/`、`public/`、`db.json`、`.deploy_git/` 等见根目录 `.gitignore`）。

```
.
├── _config.yml              # Hexo 站点全局配置（站点信息、主题、部署、插件参数等）
├── package.json             # Node 依赖与脚本入口
├── package-lock.json        # 锁定依赖树版本，便于可复现安装
├── README.md                # 本说明
├── scaffolds/               # 新建文章/页面时的模板（如 post、page、draft）
├── source/                  # 源内容目录，会参与生成
│   ├── CNAME                # 自定义域名（仅一行域名；部署后出现在站点根目录）
│   ├── Staticfile           # 部分静态托管标识文件（可按需保留）
│   ├── _posts/              # 博文（Markdown）
│   ├── about/               # 独立页面示例（如关于页）
│   └── gallery/             # 图库等资源（与主题/文章引用路径配合使用）
├── themes/                  # 主题
│   ├── icarus/              # 当前使用的 Icarus 主题（与根目录 _config.yml 中 theme 一致）
│   ├── landscape/           # Hexo 默认主题（备用）
│   └── yilia/               # 其他主题（备用）
└── blog_images/             # 博客相关图片等资源（与文章中路径约定配合使用）
```

说明：实际克隆后需执行 `npm install` 安装依赖；生成结果默认在 `public/`（通常不提交）。

## 4. 使用方式

更详细的安装、主题、域名与日常命令说明，见站内文章：

- [source/_posts/Hexo-Blog-Pages.md](source/_posts/Hexo-Blog-Pages.md)

常用流程摘要：

1. 安装 Node.js 与 Git，克隆本仓库并切换到 **hexo** 分支。
2. 在项目根目录执行 `npm install`。
3. 本地预览：`npx hexo clean && npx hexo s -g`（或 `hexo s -g`，视全局是否安装 `hexo-cli` 而定）。
4. 生成并部署：`npx hexo d -g`（将静态站点推送到 **master** 分支）。

更多命令与排错以 [Hexo 官方文档](https://hexo.io/docs/) 为准。
