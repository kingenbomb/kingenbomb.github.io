/**
 * Shared matching primitives for the pro search (kept tiny on purpose: the catalogue page
 * imports this directly, while the full index in search.js is lazy-loaded by the dialog).
 */
import zhKeywords from './data/search-zh.json';

export const CJK = /[\u3400-\u9fff\uf900-\ufaff]/;

export function normalize(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[\u3000]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function compact(value) {
  return normalize(value).replace(/[\s\-_/]/g, '');
}

/**
 * Chinese scoring. `t` are the Chinese names of the words in the entry's own title (a strong
 * signal), `w` says every title word translated, `k` are the Chinese names of its group, tags
 * and pattern (a weaker signal).
 */
function zhScore(entry, term) {
  const { t = [], k = [], w = false } = entry.zh || {};
  if (t.includes(term)) return w ? 96 : 92;
  if (t.some(item => item.includes(term))) return 74;
  const at = k.indexOf(term);
  if (at === 0) return 68;
  if (at > 0) return at <= 2 ? 64 : 58;
  if (k.some(item => item.includes(term))) return 44;

  // Fuzzy fallback for morphology the keyword table does not spell out itself:
  // 环形 → 环, 光效 → 光, 卡片式 → 卡片. One retry, discounted.
  const slim = term.replace(/(型|形|式|效|效果|动画|风格|图案|元素|样式)$/, '');
  if (slim && slim !== term && slim.length >= 1) {
    const inner = zhScore(entry, slim);
    if (inner) return Math.round(inner * 0.7);
  }
  return 0;
}

/** Score one entry against one already-normalised term. */
export function scoreTerm(entry, term) {
  if (!term) return 0;
  const title = normalize(entry.title);
  let score = 0;

  if (title === term) score = 100;
  else if (title.startsWith(term)) score = 82;
  else if (title.split(/[^a-z0-9\u3400-\u9fff]+/).some(word => word.startsWith(term))) score = 68;
  else if (title.includes(term)) score = 54;
  else if (entry.compact && compact(term).length > 2 && entry.compact.includes(compact(term))) score = 44;

  if (!score) score = zhScore(entry, term);

  if (!score && entry.desc && normalize(entry.desc).includes(term)) score = 24;
  if (!score && entry.meta && normalize(entry.meta).includes(term)) score = 16;
  if (!score && entry.slug && normalize(entry.slug).includes(term)) score = 30;

  return score;
}

/** Filter helper for the components catalogue page (keeps chips/sort working). */
export function matchesComponent(card, query) {
  const q = normalize(query);
  if (!q) return true;
  const entry = {
    title: card.name,
    desc: card.description,
    meta: card.group,
    slug: card.slug,
    zh: zhKeywords[card.slug] || { t: [], k: [], w: false },
    compact: compact(`${card.name} ${card.slug}`),
  };
  return q.split(' ').every(term => scoreTerm(entry, term) > 0);
}

export function zhFor(key) {
  return zhKeywords[key] || { t: [], k: [], w: false };
}
