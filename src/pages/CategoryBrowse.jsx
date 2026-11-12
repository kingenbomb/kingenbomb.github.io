import { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories } from '../registry';
import previews from '../data/free-previews.json';
import '../css/category-browse.css';

/** Copy taken from reactbits.dev's own category SEO table (vendor/src/utils/seo.js). */
const COPY = {
  'text-animations': {
    heading: 'Text Animations',
    description:
      'Free React text animation components: split text, typewriter effects, rotating text, scroll reveals and more. Try live demos and customize the source.',
  },
  animations: {
    heading: 'Animations',
    description:
      'Explore free React animation effects for cursors, hover interactions, scroll reveals, borders and images. Customize each effect in a live demo.',
  },
  components: {
    heading: 'Components',
    description:
      'Free interactive React UI components for cards, navigation, carousels and galleries. Preview each component and use the JavaScript or TypeScript source.',
  },
  backgrounds: {
    heading: 'Backgrounds',
    description:
      'Free animated React backgrounds, including gradients, particles, grids and shader effects. Explore live previews and customize the look of your page.',
  },
  micro: {
    heading: 'Micro Interactions',
    description:
      'Free React micro interaction components for buttons, toggles, indicators and other interface details. Explore interactive demos and copy the source.',
  },
};

const SORTS = ['A to Z', 'Z to A'];

function PreviewCard({ entry, category }) {
  const videoRef = useRef(null);
  const preview = previews[entry.slug];

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.classList.add('is-live');
    const started = video.play();
    if (started && typeof started.catch === 'function') started.catch(() => {});
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.classList.remove('is-live');
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
  };

  return (
    <Link
      to={`/${category.slug}/${entry.slug}`}
      className="cat-card"
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
    >
      <div className="cat-media">
        {preview ? (
          <>
            <img className="cat-poster" src={preview.poster} alt="" loading="lazy" decoding="async" />
            <video
              ref={videoRef}
              className="cat-video"
              src={preview.webm}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            />
          </>
        ) : (
          <div className="cat-media-placeholder">{entry.name}</div>
        )}
      </div>
      <div className="cat-meta">
        <span className="cat-name">{entry.name}</span>
        <span className="cat-label">{category.name}</span>
      </div>
    </Link>
  );
}

export default function CategoryBrowse() {
  const { category } = useParams();
  const cat = categories.find(item => item.slug === category);
  const [sort, setSort] = useState(SORTS[0]);

  const items = useMemo(() => {
    if (!cat) return [];
    const list = [...cat.items].sort((a, b) => a.name.localeCompare(b.name));
    return sort === 'Z to A' ? list.reverse() : list;
  }, [cat, sort]);

  if (!cat) {
    return (
      <div className="content-inner">
        <header className="page-header">
          <p className="page-kicker">404</p>
          <h1>Category not found</h1>
          <p className="page-lead">
            <Link to="/">Back to the playground</Link>.
          </p>
        </header>
      </div>
    );
  }

  const copy = COPY[cat.slug] || { heading: cat.name, description: '' };

  return (
    <div className="content-inner cat-page">
      <header className="cat-head">
        <h1 className="cat-title">{copy.heading}</h1>
        <p className="cat-lead">{copy.description}</p>
      </header>

      <div className="cat-toolbar">
        <span className="cat-count">
          {cat.items.length} {cat.items.length === 1 ? 'component' : 'components'}
        </span>
        <div className="cat-sort" role="group" aria-label="Sort components">
          {SORTS.map(option => (
            <button
              key={option}
              type="button"
              className="cat-sort-btn"
              aria-pressed={sort === option}
              onClick={() => setSort(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="cat-grid">
        {items.map(entry => (
          <PreviewCard key={entry.slug} entry={entry} category={cat} />
        ))}
      </div>

      <section className="cat-promo">
        <div className="cat-promo-copy">
          <h2>Build the whole product with one library.</h2>
          <p>230 Components · 22 Blocks · 38 App UI · 15 Templates · 20 Agent Skills</p>
        </div>
        <div className="cat-promo-actions">
          <Link className="cat-promo-btn" to="/pro/docs/components">
            Explore React Bits Pro
          </Link>
          <Link className="cat-promo-btn cat-promo-btn--ghost" to="/pro/docs/agent-kit">
            Agent Kit
          </Link>
        </div>
      </section>
    </div>
  );
}
