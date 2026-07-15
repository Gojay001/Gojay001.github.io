/* global hexo */
'use strict';

const fs = require('fs');
const path = require('path');

/** Top-level wiki HTML pages to publish under /research/. */
const DEFAULT_PAGES = [
  {
    file: 'ECOMMERCE_VIDEO.html',
    title: '电商视频生成：任务版图、技术路线与研究空白',
  },
];

function getResearchConfig(hexo) {
  const cfg = hexo.config.research_wiki || {};
  return {
    sourceDir: cfg.source_dir || 'submodule/paper-with-code-skills/research/wiki',
    urlPath: cfg.url_path || 'research',
    indexTitle: cfg.index_title || 'Research',
    indexSubtitle: cfg.index_subtitle || 'ARIS research wiki · literature maps & gap analysis',
    pages: Array.isArray(cfg.pages) && cfg.pages.length ? cfg.pages : DEFAULT_PAGES,
  };
}

function resolveSourceDir(hexo) {
  return path.join(hexo.base_dir, getResearchConfig(hexo).sourceDir);
}

function listPublishedPages(hexo) {
  const cfg = getResearchConfig(hexo);
  const sourceDir = resolveSourceDir(hexo);
  const pages = [];

  for (const page of cfg.pages) {
    const file = typeof page === 'string' ? page : page.file;
    const htmlPath = path.join(sourceDir, file);
    if (!fs.existsSync(htmlPath)) {
      hexo.log.warn(`research-wiki: missing ${file}`);
      continue;
    }

    let title = typeof page === 'object' && page.title ? page.title : '';
    if (!title) {
      const html = fs.readFileSync(htmlPath, 'utf8');
      const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      title = match ? match[1].trim() : file.replace(/\.html$/i, '');
    }

    const stat = fs.statSync(htmlPath);
    pages.push({
      file,
      title,
      path: `${cfg.urlPath}/${file}`,
      mtime: stat.mtime.toISOString().slice(0, 10),
    });
  }

  return pages;
}

function copyStaticFiles(hexo) {
  const cfg = getResearchConfig(hexo);
  const sourceDir = resolveSourceDir(hexo);
  const destDir = path.join(hexo.public_dir, cfg.urlPath);

  if (!fs.existsSync(sourceDir)) {
    hexo.log.warn(`research-wiki: skip copy, source not found: ${sourceDir}`);
    return 0;
  }

  fs.mkdirSync(destDir, { recursive: true });

  let htmlCount = 0;
  for (const page of cfg.pages) {
    const file = typeof page === 'string' ? page : page.file;
    const src = path.join(sourceDir, file);
    if (!fs.existsSync(src)) {
      continue;
    }
    fs.copyFileSync(src, path.join(destDir, file));
    htmlCount += 1;
  }

  return htmlCount;
}

hexo.extend.generator.register('research-wiki-index', function researchWikiIndexGenerator() {
  const cfg = getResearchConfig(this);
  const sourceDir = resolveSourceDir(this);

  if (!fs.existsSync(sourceDir)) {
    this.log.warn(`research-wiki: skip index, source not found: ${sourceDir}`);
    return [];
  }

  const pages = listPublishedPages(this);

  return {
    path: `${cfg.urlPath}/index.html`,
    layout: ['research-index', 'layout'],
    data: {
      title: cfg.indexTitle,
      subtitle: cfg.indexSubtitle,
      pages,
      layout: 'research-index',
    },
  };
});

hexo.on('generateAfter', () => {
  const htmlCount = copyStaticFiles(hexo);
  if (htmlCount > 0) {
    const { urlPath } = getResearchConfig(hexo);
    hexo.log.info(`research-wiki: deployed ${htmlCount} page(s) to /${urlPath}/`);
  }
});
