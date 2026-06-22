/* global hexo */
'use strict';

const pagination = require('hexo-pagination');

function getTopValue(post) {
  if (post == null || post.top == null) return 0;
  const parsed = Number(post.top);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getTimestamp(value) {
  if (value == null) return 0;
  if (typeof value.valueOf === 'function') return value.valueOf();
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function comparePostsByRecency(a, b) {
  const topDiff = getTopValue(b) - getTopValue(a);
  if (topDiff !== 0) return topDiff;

  const dateDiff = getTimestamp(b.date) - getTimestamp(a.date);
  if (dateDiff !== 0) return dateDiff;

  const updatedDiff = getTimestamp(b.updated) - getTimestamp(a.updated);
  if (updatedDiff !== 0) return updatedDiff;

  const aKey = a.source || a.path || a.slug || '';
  const bKey = b.source || b.path || b.slug || '';
  return bKey.localeCompare(aKey);
}

function sortPosts(posts) {
  if (posts == null || !posts.length) return posts;
  posts.data = posts.toArray().sort(comparePostsByRecency);
  return posts;
}

hexo.extend.filter.register('before_generate', function sortPostsBeforeGenerate() {
  sortPosts(this.locals.get('posts'));
});

hexo.extend.generator.register('index', function indexGenerator(locals) {
  const config = this.config;
  const paginationDir = config.pagination_dir || 'page';
  const perPage = config.index_generator?.per_page ?? config.per_page ?? 10;
  const posts = sortPosts(locals.posts);

  return pagination('', posts, {
    perPage,
    layout: ['index', 'archive'],
    format: `${paginationDir}/%d/`,
    data: {
      __index: true
    }
  });
});
