/**
 * splitText — per-letter stagger with optional 3D fold, driven by CSS transitions.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef, useState } from 'react';

const WORDS = ['REACT BITS', 'PRO', 'SHIP IT'];

export default function SplitText({ palette, speed = 0.5, seed = 1, label = 'STAGGER' }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timer = useRef(0);
  const text = (label || WORDS[seed % WORDS.length]).toString();
  const letters = text.split('');

  useEffect(() => {
    const cycle = 2600 - speed * 1200 + seed * 40;
    const id = setInterval(() => {
      setVisible(false);
      timer.current = setTimeout(() => {
        setIndex(value => (value + 1) % 3);
        setVisible(true);
      }, 320);
    }, cycle);
    return () => {
      clearInterval(id);
      clearTimeout(timer.current);
    };
  }, [speed, seed]);

  return (
    <div
      className="grid h-full w-full place-items-center px-6"
      style={{ background: palette.bg, perspective: '700px' }}
    >
      <div
        className="flex flex-wrap items-center justify-center gap-y-1"
        style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
      >
        {letters.map((letter, i) => (
          <span
            key={`${index}-${i}`}
            className="inline-block"
            style={{
              fontSize: 'clamp(22px, 7vw, 58px)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: i % 4 === 0 ? palette.a1 : palette.fg,
              opacity: visible ? 1 : 0,
              transform: visible
                ? 'translate3d(0,0,0) rotateX(0deg)'
                : `translate3d(0, ${i % 2 ? 22 : -22}px, 0) rotateX(${i % 2 ? 70 : -70}deg)`,
              transition: `transform ${420 + speed * 320}ms cubic-bezier(.2,.8,.2,1) ${i * 34}ms, opacity 380ms ease ${i * 34}ms`,
              textShadow: i % 4 === 0 ? `0 0 24px ${palette.a1}66` : 'none',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
    </div>
  );
}
