/**
 * maskReveal — a moving highlight sweeps a masked surface, revealing a second layer.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function MaskReveal({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = seed;
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
      t += 0.006 + speed * 0.014;
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

      const stripe = Math.round(10 + density * 16);
      for (let i = 0; i < stripe; i += 1) {
        const x = (i / stripe) * w;
        ctx.fillStyle = i % 2 ? `${palette.a1}26` : `${palette.a2}1c`;
        ctx.fillRect(x, 0, w / stripe, h);
      }

      const sweep = ((Math.sin(t * 0.8) + 1) / 2) * (w * 1.2) - w * 0.1;
      const band = w * 0.22;

      ctx.save();
      ctx.beginPath();
      ctx.rect(sweep - band / 2, 0, band, h);
      ctx.clip();
      const grad = ctx.createLinearGradient(sweep - band / 2, 0, sweep + band / 2, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, palette.a1);
      grad.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = grad;
      ctx.fillRect(sweep - band / 2, 0, band, h);

      ctx.globalAlpha = 0.9;
      for (let y = 0; y < h; y += 14) {
        ctx.fillStyle = palette.fg;
        ctx.fillRect(sweep - band / 2 + 6, y + 4, band - 12, 1);
      }
      ctx.restore();

      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = `${palette.fg}66`;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
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
