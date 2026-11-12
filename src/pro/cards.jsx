import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, NewBadge } from './ui.jsx';

const CATEGORY_BASE = { blocks: '/pro/docs/blocks', appUi: '/pro/docs/app-ui' };

/** Blocks / Application UI category card: the live site draws its thumbnail with plain divs. */
export function CategoryCard({ card, kind = 'blocks', highlighted }) {
  const base = CATEGORY_BASE[kind] || CATEGORY_BASE.blocks;
  return (
    <Link
      id={`cat-${card.slug}`}
      to={`${base}/${card.slug}`}
      className={`group relative flex flex-col h-full rounded-xl border bg-muted/50 p-1 transition-all hover:border-foreground/20 hover:shadow-md ${
        highlighted ? 'border-foreground/30 ring-2 ring-ring' : ''
      }`}
      title={`Open ${card.name}`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-background">
        <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: card.preview }} />
      </div>
      <div className="flex flex-col flex-1 p-3 pb-2">
        <h3 className="font-semibold tracking-tight leading-tight truncate mb-1.5">{card.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{card.description}</p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums">{card.count}</span> variants
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            Browse
            <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Scrolls the card named in `?cat=` into view once the page is mounted. */
export function useScrollToCard(slug) {
  const done = useRef(false);
  useEffect(() => {
    if (!slug || done.current) return;
    done.current = true;
    const node = document.getElementById(`cat-${slug}`);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [slug]);
}

export function TemplateCard({ card }) {
  const videoRef = useRef(null);
  return (
    <div className="group relative flex flex-col rounded-xl border bg-muted/50 overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
      <div className="p-1">
        <div className="relative aspect-video bg-muted overflow-hidden rounded-lg border">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={card.video}
            poster={card.poster}
            muted
            loop
            playsInline
            preload="none"
            onMouseEnter={() => videoRef.current?.play().catch(() => {})}
            onMouseLeave={() => {
              const node = videoRef.current;
              if (!node) return;
              node.pause();
              node.currentTime = 0;
            }}
          />
          <div className="absolute inset-x-1 bottom-1 flex items-center gap-1.5 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
            {card.liveUrl ? (
              <a
                href={card.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-8 rounded-sm px-2.5 text-[13px] font-medium bg-background/95 backdrop-blur-sm text-foreground hover:bg-background shadow-sm"
              >
                Live Preview
              </a>
            ) : null}
            <Link
              to={`/pro/docs/templates/${card.slug}`}
              className="inline-flex items-center gap-1.5 h-8 rounded-sm px-2.5 text-[13px] font-medium bg-background/95 backdrop-blur-sm text-foreground hover:bg-background shadow-sm"
            >
              View Details
            </Link>
          </div>
          <div className="absolute top-1 left-1 flex items-center gap-1.5">
            {card.isNew ? <NewBadge /> : null}
            {card.isFree ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[5px] border border-border/60 bg-background/95 text-[10px] font-medium leading-none text-foreground backdrop-blur-sm shadow-sm">
                Free
              </span>
            ) : (
              <div className="bg-black/70 backdrop-blur-sm rounded-sm p-1.5 text-white/80" aria-hidden="true">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
        <h3 className="text-base font-semibold tracking-tight">{card.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{card.description}</p>
        <div className="mt-4 flex flex-col gap-2">
          <a
            href={card.buyUrl || card.href}
            target="_blank"
            rel="noreferrer"
            className="gradient-button inline-flex items-center justify-center gap-2 w-full h-10 rounded-lg px-4 text-sm font-medium"
          >
            Buy Template ($49)
          </a>
          <Link
            to="/pro/pricing"
            className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-lg border bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Or Unlock All
          </Link>
        </div>
      </div>
    </div>
  );
}

