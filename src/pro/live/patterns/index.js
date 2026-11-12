/** Reimplementation registry: canvas patterns for components, layout blocks for
 *  blocks/app-ui variants. Each file is self-contained so it can be copied verbatim. */
import dotField from './dotField.jsx';
import particleLines from './particleLines.jsx';
import ribbons from './ribbons.jsx';
import rings from './rings.jsx';
import perspectiveGrid from './perspectiveGrid.jsx';
import glitchBars from './glitchBars.jsx';
import splitText from './splitText.jsx';
import cursorTrail from './cursorTrail.jsx';
import cardStack from './cardStack.jsx';
import marqueeStrip from './marqueeStrip.jsx';
import gradientBlobs from './gradientBlobs.jsx';
import barChart from './barChart.jsx';
import wireGlobe from './wireGlobe.jsx';
import ditherNoise from './ditherNoise.jsx';
import maskReveal from './maskReveal.jsx';

import hero from '../blocks/hero.jsx';
import features from '../blocks/features.jsx';
import pricing from '../blocks/pricing.jsx';
import faq from '../blocks/faq.jsx';
import nav from '../blocks/nav.jsx';
import footer from '../blocks/footer.jsx';
import auth from '../blocks/auth.jsx';
import form from '../blocks/form.jsx';
import table from '../blocks/table.jsx';
import chat from '../blocks/chat.jsx';
import dashboard from '../blocks/dashboard.jsx';
import shell from '../blocks/shell.jsx';
import cards from '../blocks/cards.jsx';
import steps from '../blocks/steps.jsx';
import dialog from '../blocks/dialog.jsx';
import stats from '../blocks/stats.jsx';
import profile from '../blocks/profile.jsx';
import notFound from '../blocks/notFound.jsx';

export const PATTERNS = {
  dotField,
  particleLines,
  ribbons,
  rings,
  perspectiveGrid,
  glitchBars,
  splitText,
  cursorTrail,
  cardStack,
  marqueeStrip,
  gradientBlobs,
  barChart,
  wireGlobe,
  ditherNoise,
  maskReveal,
  hero,
  features,
  pricing,
  faq,
  nav,
  footer,
  auth,
  form,
  table,
  chat,
  dashboard,
  shell,
  cards,
  steps,
  dialog,
  stats,
  profile,
  notFound,
};

export const PATTERN_META = {
  dotField: ['Dot field', 'Perspective dot grid displaced by layered sine waves.'],
  particleLines: ['Particle network', 'Drifting particles linked by proximity, nudged by the pointer.'],
  ribbons: ['Ribbons', 'Stacked bezier bands with additive blending.'],
  rings: ['Rings', 'Tilted concentric rings with orbiting beads and a glowing core.'],
  perspectiveGrid: ['Perspective grid', 'Neon floor grid rushing to the horizon.'],
  glitchBars: ['Glitch bars', 'Slice displacement, RGB split and scanlines over a bar field.'],
  splitText: ['Split text', 'Per-letter stagger with a 3D fold, cycling every few seconds.'],
  cursorTrail: ['Cursor trail', 'Lagging ring plus a fading dot trail that follows the pointer.'],
  cardStack: ['Card stack', 'Tilting card deck that cycles depth toward the pointer.'],
  marqueeStrip: ['Marquee', 'Seamless dual-row marquee with edge fades.'],
  gradientBlobs: ['Gradient blobs', 'Soft additive blobs blending like liquid light.'],
  barChart: ['Bar chart', 'Animated bars with a live readout line and grid.'],
  wireGlobe: ['Wire globe', 'Rotating wireframe sphere with latitude/longitude lines.'],
  ditherNoise: ['Dither field', 'Ordered-dither pixel field that reacts to the pointer.'],
  maskReveal: ['Mask reveal', 'Highlight band sweeping a masked surface.'],
  hero: ['Hero section', 'Two-column hero with a product panel and social proof.'],
  features: ['Feature grid', 'Section header plus six feature cards.'],
  pricing: ['Pricing tiers', 'Three tier cards with a highlighted plan.'],
  faq: ['FAQ accordion', 'Question list with one open answer.'],
  nav: ['Navigation', 'Top bar with links and a primary action.'],
  footer: ['Footer', 'Brand blurb, link columns and a legal row.'],
  auth: ['Auth card', 'Centred sign-in card with providers.'],
  form: ['Form', 'Two-column settings/contact form.'],
  table: ['Data table', 'Filtered table with status pills.'],
  chat: ['Chat thread', 'Conversation with tool calls and a prompt box.'],
  dashboard: ['Dashboard', 'KPI row, chart and sidebar rail.'],
  shell: ['App shell', 'Icon rail, list column and detail pane.'],
  cards: ['Card grid', 'Content cards with media and meta.'],
  steps: ['Steps', 'Numbered how-it-works sequence.'],
  dialog: ['Dialog', 'Modal over a dimmed surface.'],
  stats: ['Stats band', 'Oversized numbers with a sparkline.'],
  profile: ['Profile', 'Profile header with tabs and activity.'],
  notFound: ['404', 'Large 404 with search and quick links.'],
};

export const PATTERN_SOURCE = {
  ...import.meta.glob('./*.jsx', { query: '?raw', import: 'default' }),
  ...import.meta.glob('../blocks/*.jsx', { query: '?raw', import: 'default' }),
};

export function sourcePath(pattern) {
  return PATTERNS_BLOCKS.has(pattern) ? `../blocks/${pattern}.jsx` : `./${pattern}.jsx`;
}

const PATTERNS_BLOCKS = new Set([
  'hero',
  'features',
  'pricing',
  'faq',
  'nav',
  'footer',
  'auth',
  'form',
  'table',
  'chat',
  'dashboard',
  'shell',
  'cards',
  'steps',
  'dialog',
  'stats',
  'profile',
  'notFound',
]);

export async function loadPatternSource(pattern) {
  const loader = PATTERN_SOURCE[sourcePath(pattern)];
  if (!loader) return '';
  return loader();
}

export function configOf(spec) {
  const { palette, density, speed, seed, label, desc } = spec;
  const config = { palette, label };
  if (spec.kind === 'layout') {
    if (desc) config.desc = desc;
    return config;
  }
  return { ...config, density, speed, seed };
}
