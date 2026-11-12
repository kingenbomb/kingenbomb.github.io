/**
 * cardStack — a stacked card deck that tilts toward the pointer and cycles depth.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef, useState } from 'react';

const CARDS = [
  { title: 'Billing', value: '$4,820', note: '+12.4% this month' },
  { title: 'Active seats', value: '1,284', note: '98 new this week' },
  { title: 'Uptime', value: '99.98%', note: '30 day window' },
  { title: 'Latency', value: '42ms', note: 'p95 across regions' },
];

export default function CardStack({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
  const wrap = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [order, setOrder] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setOrder(value => (value + 1) % CARDS.length), 2400 - speed * 900);
    return () => clearInterval(id);
  }, [speed]);

  const onMove = event => {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({
      x: ((event.clientY - rect.top) / rect.height - 0.5) * -14,
      y: ((event.clientX - rect.left) / rect.width - 0.5) * 18,
    });
  };

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative grid h-full w-full place-items-center overflow-hidden"
      style={{ background: palette.bg, perspective: '900px' }}
    >
      <div
        className="relative h-[168px] w-[260px]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 160ms ease-out',
        }}
      >
        {CARDS.map((card, i) => {
          const depth = (i - order + CARDS.length) % CARDS.length;
          return (
            <div
              key={card.title}
              className="absolute inset-0 rounded-xl border p-4"
              style={{
                background: `linear-gradient(160deg, ${i % 2 ? palette.a1 : palette.fg}14, ${palette.bg})`,
                borderColor: `${palette.fg}22`,
                transform: `translate3d(${depth * 9}px, ${depth * -7}px, ${depth * -40}px) rotateZ(${depth * 1.6}deg)`,
                opacity: 1 - depth * 0.16,
                boxShadow: depth === 0 ? `0 18px 40px -18px ${palette.a1}` : 'none',
                transition: 'transform 520ms cubic-bezier(.2,.8,.2,1), opacity 520ms ease',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: `${palette.fg}88` }}>
                {card.title}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums" style={{ color: palette.fg }}>
                {card.value}
              </p>
              <p className="mt-1 text-[11px]" style={{ color: i % 2 ? palette.a2 : palette.a1 }}>
                {card.note}
              </p>
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 12 }).map((_, k) => (
                  <span
                    key={k}
                    className="h-6 flex-1 rounded-sm"
                    style={{
                      background: k < 5 + i * 2 ? (i % 2 ? palette.a1 : palette.a2) : `${palette.fg}18`,
                      opacity: 0.5 + (k % 4) * 0.12,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <span className="absolute bottom-3 left-4 text-[10px]" style={{ color: `${palette.fg}55` }}>
        {Math.round(density * 100)}% density · hover to tilt
      </span>
    </div>
  );
}
