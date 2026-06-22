/* global hexo */
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const SYNC_STATE_FILE = '.sync-state.json';

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

function resolveSubmoduleRoot(hexo) {
  return path.dirname(resolveSourceDir(hexo));
}

function resolvePaperReadingPrefix(hexo) {
  return path.relative(resolveSubmoduleRoot(hexo), resolveSourceDir(hexo)).replace(/\\/g, '/');
}

function resolveSyncStatePath(hexo) {
  return path.join(resolvePostsDir(hexo), SYNC_STATE_FILE);
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

function resolvePaperWithCodeListPath(hexo) {
  return path.join(resolveSubmoduleRoot(hexo), 'paper-with-code-list.md');
}

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function normalizeTaxonomyKey(text) {
  return text.trim().toLowerCase();
}

const SUBCATEGORY_TAG_ABBR = {
  'Diffusion Model': 'DM',
  'Generative Adversarial Network': 'GAN',
  'Variational Auto-Encoder': 'VAE',
  'Vision Transformer': 'ViT',
  'Pre-trained Language Model': 'PLM',
  'Large Language Model': 'LLM',
  'Vision Language Model': 'VLM',
  'Few-Shot Segmentation': 'FSS',
  'Few-Shot Learning': 'FSL',
  'Multiple Object Tracking': 'MOT',
  'Visual Object Tracking': 'VOT',
  'Object Detection': 'OD',
  'Object Segmentation': 'OS',
  'Object Tracking': 'OT',
  '3D Object Detection': '3D-Det',
  'Salient Object Detection': 'SOD',
};

function subCategoryTagAbbr(subCategory) {
  if (SUBCATEGORY_TAG_ABBR[subCategory]) {
    return SUBCATEGORY_TAG_ABBR[subCategory];
  }

  const words = subCategory.split(/[\s-/]+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].toUpperCase();
  }

  return words.map((word) => word[0].toUpperCase()).join('');
}

function buildPaperWithCodeTaxonomy(content) {
  const bySubCategory = new Map();
  const byPaperTitle = new Map();
  const anchorToTopDomain = new Map();

  let currentTopDomain = null;
  let currentSubCategory = null;
  let currentTopDomainForSection = null;

  for (const line of content.split('\n')) {
    const topMatch = line.match(/^\s*-\s+\*\*([^*]+)\*\*/);
    if (topMatch) {
      currentTopDomain = topMatch[1].trim();
      continue;
    }

    const tocLinkMatch = line.match(/^\s+- \[([^\]]+)\]\(#([^)]+)\)/);
    if (tocLinkMatch && currentTopDomain) {
      anchorToTopDomain.set(tocLinkMatch[2].trim().toLowerCase(), currentTopDomain);
    }

    const headingMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      const subCategory = headingMatch[1].trim();
      const anchor = slugifyHeading(subCategory);
      currentSubCategory = subCategory;
      currentTopDomainForSection = anchorToTopDomain.get(anchor) || currentTopDomain;

      if (currentTopDomainForSection) {
        const entry = {
          topDomain: currentTopDomainForSection,
          subCategory,
        };
        bySubCategory.set(normalizeTaxonomyKey(subCategory), entry);
        bySubCategory.set(anchor, entry);
      }
      continue;
    }

    if (!currentSubCategory || !currentTopDomainForSection) {
      continue;
    }

    if (!line.startsWith('|') || line.includes('---')) {
      continue;
    }

    const cells = line.split('|').map((cell) => cell.trim());
    if (cells.length < 3 || /^title$/i.test(cells[1])) {
      continue;
    }

    const rawTitle = cells[1];
    const linked = rawTitle.match(/\[([^\]]+)\]/);
    const plain = rawTitle.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
    const paperTitle = (linked ? linked[1] : plain).trim();

    if (!paperTitle || paperTitle === 'Title') {
      continue;
    }

    byPaperTitle.set(normalizeTaxonomyKey(paperTitle), {
      topDomain: currentTopDomainForSection,
      subCategory: currentSubCategory,
    });
  }

  return { bySubCategory, byPaperTitle };
}

let taxonomyCache = null;
let taxonomyCacheKey = null;

function loadPaperWithCodeTaxonomy(hexo) {
  const listPath = resolvePaperWithCodeListPath(hexo);
  if (!fs.existsSync(listPath)) {
    hexo.log.warn(`paper-reading: taxonomy list not found: ${listPath}`);
    return { bySubCategory: new Map(), byPaperTitle: new Map() };
  }

  const mtime = fs.statSync(listPath).mtimeMs;
  if (taxonomyCache && taxonomyCacheKey === mtime) {
    return taxonomyCache;
  }

  taxonomyCache = buildPaperWithCodeTaxonomy(fs.readFileSync(listPath, 'utf8'));
  taxonomyCacheKey = mtime;
  return taxonomyCache;
}

function parseMetaSubCategory(metaLine) {
  if (!metaLine) {
    return null;
  }

  const parts = metaLine.split('·').map((segment) => segment.trim()).filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  const subCategory = parts[1];
  if (/^arxiv\(/i.test(subCategory)) {
    return null;
  }

  return subCategory;
}

function resolveTaxonomyEntry(taxonomy, metaLine, title, slug) {
  const subCategoryFromMeta = parseMetaSubCategory(metaLine);
  if (subCategoryFromMeta) {
    const fromMeta = taxonomy.bySubCategory.get(normalizeTaxonomyKey(subCategoryFromMeta));
    if (fromMeta) {
      return fromMeta;
    }
  }

  const acronym = extractAcronym(title, slug);
  const fromPaper = taxonomy.byPaperTitle.get(normalizeTaxonomyKey(acronym));
  if (fromPaper) {
    return fromPaper;
  }

  if (subCategoryFromMeta) {
    return {
      topDomain: 'Paper',
      subCategory: subCategoryFromMeta,
    };
  }

  return {
    topDomain: 'Paper Reading',
    subCategory: acronym || slug.toUpperCase(),
  };
}

function parseCategories(metaLine, title, slug, taxonomy) {
  const { topDomain, subCategory } = resolveTaxonomyEntry(taxonomy, metaLine, title, slug);
  return [topDomain, subCategory];
}

function parseTags(categories) {
  const tags = ['DL'];

  if (categories[0]) {
    tags.push(categories[0]);
  }

  if (categories[1]) {
    tags.push(subCategoryTagAbbr(categories[1]));
  }

  return tags;
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
  const taxonomy = loadPaperWithCodeTaxonomy(hexo);
  const categories = parseCategories(metaLine, title, slug, taxonomy);

  return {
    slug,
    title,
    date: formatHexoDate(stat.mtime),
    categories,
    tags: parseTags(categories),
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
  return [
    '---',
    yamlBody,
    '---',
    '',
    `[阅读完整精读页面 →](${paper.link})`,
    '',
  ].join('\n');
}

function readSyncState(hexo) {
  const statePath = resolveSyncStatePath(hexo);
  if (!fs.existsSync(statePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch (error) {
    hexo.log.warn(`paper-reading: invalid sync state, will run full sync (${error.message})`);
    return null;
  }
}

function writeSyncState(hexo, submoduleCommit) {
  const postsDir = resolvePostsDir(hexo);
  fs.mkdirSync(postsDir, { recursive: true });

  const state = {
    submodule_commit: submoduleCommit,
    submodule_path: path.relative(hexo.base_dir, resolveSubmoduleRoot(hexo)),
    paper_reading_dir: resolvePaperReadingPrefix(hexo),
    synced_at: new Date().toISOString(),
  };

  fs.writeFileSync(resolveSyncStatePath(hexo), `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function getSubmoduleCommit(hexo) {
  const submoduleRoot = resolveSubmoduleRoot(hexo);
  if (!fs.existsSync(submoduleRoot)) {
    return null;
  }

  try {
    return execSync(`git -C "${submoduleRoot}" rev-parse HEAD`, { encoding: 'utf8' }).trim();
  } catch (error) {
    hexo.log.warn(`paper-reading: unable to read submodule commit (${error.message})`);
    return null;
  }
}

function slugFromPaperReadingPath(filePath, prefix) {
  const normalized = filePath.replace(/\\/g, '/');
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = normalized.match(new RegExp(`^${escapedPrefix}/([^/]+)\\.html$`));
  return match ? match[1] : null;
}

function getHtmlDiff(hexo, oldCommit, newCommit) {
  const submoduleRoot = resolveSubmoduleRoot(hexo);
  const prefix = resolvePaperReadingPrefix(hexo);

  try {
    const output = execSync(
      `git -C "${submoduleRoot}" diff --name-status ${oldCommit} ${newCommit} -- "${prefix}/"`,
      { encoding: 'utf8' }
    ).trim();

    const addedOrModified = new Set();
    const deleted = new Set();

    if (!output) {
      return { addedOrModified: [], deleted: [] };
    }

    for (const line of output.split('\n').filter(Boolean)) {
      const parts = line.split('\t');
      const status = parts[0];

      if (status.startsWith('R')) {
        const oldSlug = slugFromPaperReadingPath(parts[1], prefix);
        const newSlug = slugFromPaperReadingPath(parts[2], prefix);
        if (oldSlug) {
          deleted.add(oldSlug);
        }
        if (newSlug) {
          addedOrModified.add(newSlug);
        }
        continue;
      }

      const slug = slugFromPaperReadingPath(parts[1], prefix);
      if (!slug) {
        continue;
      }

      if (status === 'D') {
        deleted.add(slug);
      } else if (status === 'A' || status === 'M') {
        addedOrModified.add(slug);
      }
    }

    return {
      addedOrModified: [...addedOrModified],
      deleted: [...deleted],
    };
  } catch (error) {
    hexo.log.warn(`paper-reading: diff failed, falling back to full sync (${error.message})`);
    return null;
  }
}

function writePostMd(hexo, slug) {
  const sourceDir = resolveSourceDir(hexo);
  const postsDir = resolvePostsDir(hexo);
  const htmlPath = path.join(sourceDir, `${slug}.html`);

  if (!fs.existsSync(htmlPath)) {
    hexo.log.warn(`paper-reading: skip missing html for slug "${slug}"`);
    return false;
  }

  const paper = parsePaperMetadata(hexo, htmlPath, slug);
  const content = renderPostMarkdown(paper);
  const outPath = path.join(postsDir, `${slug}.md`);

  if (fs.existsSync(outPath) && fs.readFileSync(outPath, 'utf8') === content) {
    return false;
  }

  fs.writeFileSync(outPath, content, 'utf8');
  return true;
}

function deletePostMd(hexo, slug) {
  const outPath = path.join(resolvePostsDir(hexo), `${slug}.md`);
  if (!fs.existsSync(outPath)) {
    return false;
  }

  fs.unlinkSync(outPath);
  return true;
}

function fullSyncPosts(hexo) {
  const postsDir = resolvePostsDir(hexo);
  fs.mkdirSync(postsDir, { recursive: true });

  const papers = listHtmlPapers(hexo);
  const activeSlugs = new Set(papers.map((paper) => paper.slug));
  let changedCount = 0;

  for (const { slug } of papers) {
    if (writePostMd(hexo, slug)) {
      changedCount += 1;
    }
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

  return { changedCount, totalPosts: papers.length, mode: 'full' };
}

function incrementalSyncPosts(hexo, diff) {
  let changedCount = 0;

  for (const slug of diff.addedOrModified) {
    if (writePostMd(hexo, slug)) {
      changedCount += 1;
    }
  }

  for (const slug of diff.deleted) {
    if (deletePostMd(hexo, slug)) {
      changedCount += 1;
    }
  }

  return {
    changedCount,
    totalPosts: listHtmlPapers(hexo).length,
    mode: 'incremental',
    touched: diff.addedOrModified.length + diff.deleted.length,
  };
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

  const currentCommit = getSubmoduleCommit(hexo);
  if (!currentCommit) {
    hexo.log.warn('paper-reading: skip post sync, submodule commit unavailable');
    return 0;
  }

  const state = readSyncState(hexo);
  let result;

  if (!state || !state.submodule_commit) {
    result = fullSyncPosts(hexo);
    writeSyncState(hexo, currentCommit);
    hexo.log.info(
      `paper-reading: full sync ${result.totalPosts} post(s) -> ${path.relative(hexo.base_dir, postsDir)}/ (${result.changedCount} file(s) updated, commit ${currentCommit.slice(0, 7)})`
    );
    return result.changedCount;
  }

  if (state.submodule_commit === currentCommit) {
    hexo.log.info(`paper-reading: submodule unchanged (${currentCommit.slice(0, 7)}), skip post sync`);
    return 0;
  }

  const diff = getHtmlDiff(hexo, state.submodule_commit, currentCommit);
  if (!diff) {
    result = fullSyncPosts(hexo);
    writeSyncState(hexo, currentCommit);
    hexo.log.info(
      `paper-reading: full sync ${result.totalPosts} post(s) (${result.changedCount} file(s) updated, commit ${currentCommit.slice(0, 7)})`
    );
    return result.changedCount;
  }

  if (diff.addedOrModified.length === 0 && diff.deleted.length === 0) {
    writeSyncState(hexo, currentCommit);
    hexo.log.info(
      `paper-reading: submodule ${state.submodule_commit.slice(0, 7)}..${currentCommit.slice(0, 7)}, no paper-reading html changes`
    );
    return 0;
  }

  result = incrementalSyncPosts(hexo, diff);
  writeSyncState(hexo, currentCommit);
  hexo.log.info(
    `paper-reading: incremental sync ${state.submodule_commit.slice(0, 7)}..${currentCommit.slice(0, 7)}, ${result.touched} html change(s), ${result.changedCount} md file(s) updated`
  );
  return result.changedCount;
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
