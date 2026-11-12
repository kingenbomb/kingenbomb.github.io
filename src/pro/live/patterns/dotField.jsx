/**
 * dotField — a grid of dots displaced by layered sine waves in perspective.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function DotField({ palette, density = 0.5, speed = 0.5, seed = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = seed * 10;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = () => {
      t += 0.008 + speed * 0.022;
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, w, h);

      // Soft accent wash so the frame reads like the official capture, not flat black.
      const wash = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
      wash.addColorStop(0, palette.a1);
      wash.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      const cols = Math.round(24 + density * 42);
      const rows = Math.round(cols * (h / w) * 1.35);
      const cx = w / 2;
      const horizon = h * 0.34;

      for (let j = 0; j < rows; j += 1) {
        const depth = (j + 1) / rows;
        const scale = Math.pow(depth, 2.2);
        const y = horizon + scale * (h - horizon) * 0.96;
        for (let i = 0; i < cols; i += 1) {
          const spread = 0.35 + scale * 1.15;
          const x = cx + ((i + 0.5) / cols - 0.5) * w * spread;
          const wave = Math.sin(t + i * 0.32 + j * 0.26) * Math.cos(t * 0.7 + j * 0.18);
          const lift = wave * 26 * scale;
          const size = Math.max(1, 6.2 * scale);
          const glow = 0.3 + 0.9 * (0.5 + 0.5 * wave) * scale;
          ctx.globalAlpha = Math.min(1, glow);
          ctx.fillStyle = j % 3 === 0 ? palette.a2 : palette.a1;
          ctx.beginPath();
          ctx.arc(x, y - lift, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [palette, density, speed, seed]);

  return <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />;
}
