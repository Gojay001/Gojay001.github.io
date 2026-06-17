/* global hexo */
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function getPaperReadingConfig(hexo) {
  const cfg = hexo.config.paper_reading || {};
  return {
    sourceDir: cfg.source_dir || 'submodule/paper-with-code-skills/paper-reading',
    urlPath: cfg.url_path || 'paper-reading',
    postsDir: cfg.posts_dir || 'source/_posts/paper-reading',
    titleSuffix: cfg.title_suffix || ' · 逻辑精读',
    indexTitle: cfg.index_title || 'Paper Reading',
    indexSubtitle: cfg.index_subtitle || '',
    syncPosts: cfg.sync_posts !== false,
  };
}

function resolveSourceDir(hexo) {
  return path.join(hexo.base_dir, getPaperReadingConfig(hexo).sourceDir);
}

function resolvePostsDir(hexo) {
  return path.join(hexo.base_dir, getPaperReadingConfig(hexo).postsDir);
}

function parseTitleFromHtmlContent(html, titleSuffix) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!match) {
    return '';
  }

  let title = match[1].trim();
  if (titleSuffix && title.endsWith(titleSuffix)) {
    title = title.slice(0, -titleSuffix.length).trim();
  }
  return title;
}

function extractAcronym(title, slug) {
  const emDash = title.match(/^([A-Za-z0-9][A-Za-z0-9+.-]*)\s*[—–-]/);
  if (emDash) {
    return emDash[1];
  }

  const firstWord = title.split(/\s+/)[0];
  if (firstWord) {
    return firstWord;
  }

  return slug.toUpperCase();
}

function parseCategories(metaLine, title, slug) {
  const acronym = extractAcronym(title, slug);
  const categories = [];

  if (metaLine) {
    const firstSegment = metaLine.split('·')[0].trim();
    const domain = firstSegment.split('-')[0].trim();
    if (domain) {
      categories.push(domain);
    }
  }

  categories.push('Paper Reading');

  if (acronym) {
    categories.push(acronym);
  }

  if (categories.length === 1) {
    categories.push(slug.toUpperCase());
  }

  return categories;
}

function parseTags(metaLine) {
  const tags = new Set(['Paper Reading']);

  if (!metaLine) {
    return [...tags];
  }

  if (/deeplearning/i.test(metaLine)) {
    tags.add('DL');
  }

  for (const part of metaLine.split('·').map((segment) => segment.trim()).filter(Boolean)) {
    if (/^arxiv\(/i.test(part)) {
      continue;
    }
    if (/neurips|iccv|cvpr|iclr|icml|eccv/i.test(part) && /\(\d{4}\)/.test(part)) {
      continue;
    }
    if (part === 'DeepLearning-Paper-with-Code') {
      continue;
    }
    tags.add(part);
  }

  return [...tags];
}

function parseFeynmanExcerpt(html) {
  const section = html.match(/<section[^>]*class="feynman"[^>]*id="feynman"[^>]*>([\s\S]*?)<\/section>/i);
  if (!section) {
    return '';
  }

  const paragraph = section[1].match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!paragraph) {
    return '';
  }

  let text = paragraph[1]
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > 300) {
    text = `${text.slice(0, 300)}…`;
  }

  return text;
}

function findThumbnail(hexo, slug, urlPath) {
  const assetsDir = path.join(resolveSourceDir(hexo), 'assets', slug);
  if (!fs.existsSync(assetsDir)) {
    return null;
  }

  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  for (const name of fs.readdirSync(assetsDir).sort()) {
    const lower = name.toLowerCase();
    if (imageExtensions.some((ext) => lower.endsWith(ext))) {
      return `/${urlPath}/assets/${slug}/${name}`;
    }
  }

  return null;
}

function formatHexoDate(mtime) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    `${mtime.getFullYear()}-${pad(mtime.getMonth() + 1)}-${pad(mtime.getDate())}`,
    `${pad(mtime.getHours())}:${pad(mtime.getMinutes())}:${pad(mtime.getSeconds())}`,
  ].join(' ');
}

function listHtmlPapers(hexo) {
  const sourceDir = resolveSourceDir(hexo);
  if (!fs.existsSync(sourceDir)) {
    return [];
  }

  const papers = [];
  for (const ent of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (!ent.isFile() || !ent.name.endsWith('.html') || ent.name === 'index.html') {
      continue;
    }

    const slug = path.basename(ent.name, '.html');
    papers.push({
      slug,
      filePath: path.join(sourceDir, ent.name),
    });
  }

  return papers;
}

function parsePaperMetadata(hexo, filePath, slug) {
  const html = fs.readFileSync(filePath, 'utf8');
  const cfg = getPaperReadingConfig(hexo);
  const stat = fs.statSync(filePath);
  const title = parseTitleFromHtmlContent(html, cfg.titleSuffix) || slug;
  const metaMatch = html.match(/<div class="meta">([^<]*)<\/div>/i);
  const metaLine = metaMatch ? metaMatch[1].trim() : '';

  return {
    slug,
    title,
    date: formatHexoDate(stat.mtime),
    categories: parseCategories(metaLine, title, slug),
    tags: parseTags(metaLine),
    link: `/${cfg.urlPath}/${slug}.html`,
    excerpt: parseFeynmanExcerpt(html),
    thumbnail: findThumbnail(hexo, slug, cfg.urlPath),
    mtime: stat.mtime.toISOString().slice(0, 10),
    path: `${cfg.urlPath}/${slug}.html`,
  };
}

function scanPapers(hexo) {
  return listHtmlPapers(hexo)
    .map(({ slug, filePath }) => parsePaperMetadata(hexo, filePath, slug))
    .sort((a, b) => b.mtime.localeCompare(a.mtime));
}

function renderPostMarkdown(paper) {
  const frontMatter = {
    title: paper.title,
    date: paper.date,
    categories: paper.categories,
    tags: paper.tags,
    link: paper.link,
    paper_reading: true,
    excerpt: paper.excerpt || `Paper reading notes for ${paper.title}.`,
  };

  if (paper.thumbnail) {
    frontMatter.thumbnail = paper.thumbnail;
    frontMatter.thumbnail_fit = 'contain';
  }

  const yamlBody = yaml.dump(frontMatter, { lineWidth: -1, noRefs: true }).trimEnd();
  const body = [
    '---',
    yamlBody,
    '---',
    '',
    `[阅读完整精读页面 →](${paper.link})`,
    '',
  ].join('\n');

  return body;
}

function syncPostsToMd(hexo) {
  const cfg = getPaperReadingConfig(hexo);
  if (!cfg.syncPosts) {
    return 0;
  }

  const sourceDir = resolveSourceDir(hexo);
  const postsDir = resolvePostsDir(hexo);

  if (!fs.existsSync(sourceDir)) {
    hexo.log.warn(`paper-reading: skip post sync, source not found: ${sourceDir}`);
    return 0;
  }

  fs.mkdirSync(postsDir, { recursive: true });

  const papers = scanPapers(hexo);
  const activeSlugs = new Set(papers.map((paper) => paper.slug));
  let changedCount = 0;

  for (const paper of papers) {
    const outPath = path.join(postsDir, `${paper.slug}.md`);
    const content = renderPostMarkdown(paper);

    if (fs.existsSync(outPath)) {
      const existing = fs.readFileSync(outPath, 'utf8');
      if (existing === content) {
        continue;
      }
    }

    fs.writeFileSync(outPath, content, 'utf8');
    changedCount += 1;
  }

  for (const name of fs.readdirSync(postsDir)) {
    if (!name.endsWith('.md')) {
      continue;
    }

    const slug = name.slice(0, -3);
    if (!activeSlugs.has(slug)) {
      fs.unlinkSync(path.join(postsDir, name));
      changedCount += 1;
    }
  }

  if (changedCount > 0) {
    hexo.log.info(
      `paper-reading: synced ${papers.length} post(s) to ${path.relative(hexo.base_dir, postsDir)}/ (${changedCount} file(s) updated)`
    );
  }

  return changedCount;
}

function copyStaticFiles(hexo) {
  const { urlPath } = getPaperReadingConfig(hexo);
  const sourceDir = resolveSourceDir(hexo);
  const destDir = path.join(hexo.public_dir, urlPath);

  if (!fs.existsSync(sourceDir)) {
    hexo.log.warn(`paper-reading: skip copy, source not found: ${sourceDir}`);
    return 0;
  }

  fs.mkdirSync(destDir, { recursive: true });

  let htmlCount = 0;
  for (const ent of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (ent.name === 'index.html') {
      continue;
    }

    const src = path.join(sourceDir, ent.name);
    const dest = path.join(destDir, ent.name);

    if (ent.isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
      if (ent.name.endsWith('.html')) {
        htmlCount += 1;
      }
    }
  }

  return htmlCount;
}

hexo.extend.generator.register('paper-reading-index', function paperReadingIndexGenerator() {
  const cfg = getPaperReadingConfig(this);
  const sourceDir = resolveSourceDir(this);

  if (!fs.existsSync(sourceDir)) {
    this.log.warn(`paper-reading: skip index, source not found: ${sourceDir}`);
    return [];
  }

  const papers = scanPapers(this);

  return {
    path: `${cfg.urlPath}/index.html`,
    layout: ['paper-reading-index', 'layout'],
    data: {
      title: cfg.indexTitle,
      subtitle: cfg.indexSubtitle,
      papers,
      layout: 'paper-reading-index',
    },
  };
});

hexo.on('ready', () => {
  syncPostsToMd(hexo);
});

hexo.on('generateAfter', () => {
  const htmlCount = copyStaticFiles(hexo);
  if (htmlCount > 0) {
    const { urlPath } = getPaperReadingConfig(hexo);
    hexo.log.info(`paper-reading: deployed ${htmlCount} page(s) to /${urlPath}/`);
  }
});
