/* global hexo */
'use strict';

const pagination = require('hexo-pagination');

function getTopValue(post) {
  if (post == null || post.top == null) return 0;
  const parsed = Number(post.top);
  return Number.isFinite(parsed) ? parsed : 0;
}

hexo.extend.generator.register('index', function indexGenerator(locals) {
  const config = this.config;
  const paginationDir = config.pagination_dir || 'page';
  const perPage = config.index_generator?.per_page ?? config.per_page ?? 10;

  const posts = locals.posts;
  posts.data = posts.toArray().sort((a, b) => {
    const topDiff = getTopValue(b) - getTopValue(a);
    if (topDiff !== 0) return topDiff;
    return b.date - a.date;
  });

  return pagination('', posts, {
    perPage,
    layout: ['index', 'archive'],
    format: `${paginationDir}/%d/`,
    data: {
      __index: true
    }
  });
});
