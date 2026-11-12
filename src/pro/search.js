/**
 * Bilingual search over the whole pro surface (components, every block/app-ui variant,
 * templates, agent kit, docs and marketing pages).
 *
 * The catalogue is English-only, so Chinese recall comes from a keyword layer
 * (data/search-zh.json, built by RECON/pro/build_search_zh.py): each entry carries the
 * Chinese names of its group, its tags and the pattern it renders with.
 *
 * This module is imported lazily by SearchDialog; the catalogue page uses search-core.js.
 */
import catalog from './data/pro-catalog.json';
import detail from './data/pro-detail.json';
import zhKeywords from './data/search-zh.json';
import docsContent from './data/docs-content.json';
import { compact, normalize, scoreTerm } from './search-core.js';

const TYPE_LABEL = {
  component: 'Component',
  block: 'Block category',
  blockVariant: 'Block',
  appUi: 'App UI category',
  appUiVariant: 'App UI',
  template: 'Template',
  agentKit: 'Agent kit',
  doc: 'Docs',
  page: 'Page',
};

const TYPE_ORDER = {
  component: 0,
  blockVariant: 1,
  appUiVariant: 2,
  block: 3,
  appUi: 4,
  template: 5,
  agentKit: 6,
  doc: 7,
  page: 8,
};

const entries = [];
const push = entry => {
  const zh = zhKeywords[entry.key] || { t: [], k: [], w: false };
  entries.push({
    ...entry,
    zh,
    zhKeywords: [...new Set([...zh.t, ...zh.k])],
    compact: compact(`${entry.title} ${entry.slug || ''}`),
  });
};

for (const card of catalog.sections.components.cards) {
  push({
    key: card.slug,
    id: `component:${card.slug}`,
    type: 'component',
    title: card.name,
    desc: card.description,
    meta: card.group,
    slug: card.slug,
    to: `/pro/docs/components/${card.slug}`,
  });
}

for (const card of catalog.sections.blocks.cards) {
  push({
    key: `blocks:${card.slug}`,
    id: `block:${card.slug}`,
    type: 'block',
    title: card.name,
    desc: card.description,
    meta: `${card.count} variants`,
    slug: card.slug,
    to: `/pro/docs/blocks/${card.slug}`,
  });
}

for (const cat of detail.blocks) {
  for (const variant of cat.variants) {
    push({
      key: variant.slug,
      id: `blockVariant:${variant.slug}`,
      type: 'blockVariant',
      title: variant.name,
      desc: variant.description,
      meta: cat.name,
      slug: variant.slug,
      to: `/pro/docs/blocks/${cat.slug}/${variant.slug}`,
    });
  }
}

for (const card of catalog.sections['app-ui'].cards) {
  push({
    key: `appUi:${card.slug}`,
    id: `appUi:${card.slug}`,
    type: 'appUi',
    title: card.name,
    desc: card.description,
    meta: card.category || 'App UI',
    slug: card.slug,
    to: `/pro/docs/app-ui/${card.slug}`,
  });
}

for (const cat of detail.appUi) {
  for (const variant of cat.variants) {
    push({
      key: variant.slug,
      id: `appUiVariant:${variant.slug}`,
      type: 'appUiVariant',
      title: variant.name,
      desc: variant.description,
      meta: cat.name,
      slug: variant.slug,
      to: `/pro/docs/app-ui/${cat.slug}/${variant.slug}`,
    });
  }
}

for (const card of catalog.sections.templates.cards) {
  push({
    key: `template:${card.slug}`,
    id: `template:${card.slug}`,
    type: 'template',
    title: card.name,
    desc: card.description,
    meta: card.isFree ? 'Free template' : 'Template',
    slug: card.slug,
    to: `/pro/docs/templates/${card.slug}`,
  });
}

const KIND_PATH = { setup: 'setup', skill: 'skills', prompt: 'prompts', recipe: 'recipes' };
for (const card of catalog.sections['agent-kit'].cards) {
  push({
    key: `agent-kit:${card.slug}`,
    id: `agentKit:${card.slug}`,
    type: 'agentKit',
    title: card.name,
    desc: card.summary || card.category || '',
    meta: card.kind ? `Agent kit · ${card.kind}` : 'Agent kit',
    slug: card.slug,
    to: `/pro/docs/agent-kit/${KIND_PATH[card.kind] || 'setup'}/${card.slug}`,
  });
}

const DOC_PAGES = [
  ['introduction', 'Introduction', 'What React Bits Pro is and how the catalogue is organised.'],
  ['installation', 'Installation', 'CLI, shadcn registry and manual install paths.'],
  ['mcp', 'MCP registry', 'Point your agent at the component registry over MCP.'],
];
for (const [slug, title, desc] of DOC_PAGES) {
  push({
    key: `page:${slug}`,
    id: `doc:${slug}`,
    type: 'doc',
    title: docsContent[slug]?.title || title,
    desc: docsContent[slug]?.desc || desc,
    meta: 'Docs',
    slug,
    to: `/pro/docs/${slug}`,
  });
}

const SITE_PAGES = [
  ['pricing', 'Pricing', 'Lifetime, annual and team plans.', '/pro/pricing'],
  ['saved', 'Saved', 'Components and blocks you bookmarked in this browser.', '/pro/docs/saved'],
  ['about', 'About', 'What the library contains and who it is for.', '/pro/about'],
  ['license', 'License agreement', 'The terms that come with a licence.', '/pro/license'],
  ['privacy', 'Privacy policy', 'What the site collects and how it is handled.', '/pro/privacy'],
  ['roadmap', 'Roadmap', 'What is coming next, month by month.', '/pro/roadmap'],
  ['changelog', 'Changelog', 'Everything that shipped, newest first.', '/pro/changelog'],
  ['affiliate', 'Affiliates', 'Earn on every referral.', '/pro/affiliate'],
  ['components', 'All components', 'Browse the full catalogue of 230 components.', '/pro/docs/components'],
  ['blocks', 'All blocks', 'Page sections for marketing sites.', '/pro/docs/blocks'],
  ['app-ui', 'Application UI', 'Screens and surfaces for product UIs.', '/pro/docs/app-ui'],
  ['templates', 'Templates', 'Full landing pages, ready to customise.', '/pro/docs/templates'],
  ['agent-kit', 'Agent kit', 'Skills, prompts and recipes for coding agents.', '/pro/docs/agent-kit'],
];
for (const [slug, title, desc, to] of SITE_PAGES) {
  push({ key: `page:${slug}`, id: `page:${slug}`, type: 'page', title, desc, meta: 'Page', slug, to });
}

/**
 * Search everything. Multi-word queries are AND-ed: every term has to hit the same entry
 * somewhere, and the entry's score is the sum of each term's best hit.
 */
export function searchAll(rawQuery, limit = 30) {
  const query = normalize(rawQuery);
  if (!query) return [];
  const terms = query.split(' ').filter(Boolean);

  const hits = [];
  for (const entry of entries) {
    let total = 0;
    let matchedAll = true;
    for (const term of terms) {
      const score = scoreTerm(entry, term);
      if (!score) {
        matchedAll = false;
        break;
      }
      total += score;
    }
    if (!matchedAll) continue;
    hits.push({ entry, score: total });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const typeDiff = (TYPE_ORDER[a.entry.type] ?? 9) - (TYPE_ORDER[b.entry.type] ?? 9);
    if (typeDiff !== 0) return typeDiff;
    return a.entry.title.localeCompare(b.entry.title);
  });

  return hits.slice(0, limit).map(({ entry, score }) => ({
    id: entry.id,
    type: entry.type,
    typeLabel: TYPE_LABEL[entry.type] || entry.type,
    title: entry.title,
    desc: entry.desc,
    meta: entry.meta,
    to: entry.to,
    zh: entry.zhKeywords,
    score,
  }));
}

export const SEARCH_SUGGESTIONS = [
  { label: '光标', hint: 'cursor effects' },
  { label: '渐变', hint: 'gradient' },
  { label: '粒子', hint: 'particles' },
  { label: '文字', hint: 'text' },
  { label: '3D', hint: 'shaders' },
  { label: '定价', hint: 'pricing' },
  { label: 'hero', hint: '首屏' },
  { label: '模板', hint: 'templates' },
];

export const SEARCH_ENTRY_COUNT = entries.length;
