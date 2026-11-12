/**
 * glitchBars — slice displacement, RGB split and scanlines over a glowing bar field.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function GlitchBars({ palette, density = 0.5, speed = 0.5, seed = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let frame = seed * 7;
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
      frame += 1;
      const burst = Math.sin(frame * 0.045) > 0.72 ? 1 : 0;
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

      const bars = Math.round(14 + density * 26);
      const barW = w / bars;
      for (let i = 0; i < bars; i += 1) {
        const energy = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.04 + i * 0.7));
        const barH = h * energy * (0.25 + 0.55 * Math.abs(Math.cos(i * 1.7 + frame * 0.03)));
        const hueShift = i % 5 === 0 ? palette.a2 : palette.a1;
        ctx.globalAlpha = 0.25 + 0.55 * energy;
        ctx.fillStyle = hueShift;
        ctx.fillRect(i * barW + 1, h - barH, barW - 2, barH);
      }

      if (burst) {
        for (let k = 0; k < 6; k += 1) {
          const y = Math.random() * h;
          const sliceH = 3 + Math.random() * 22;
          const dx = (Math.random() - 0.5) * 60 * (0.4 + speed);
          ctx.globalAlpha = 0.75;
          ctx.fillStyle = k % 2 ? palette.a1 : palette.a2;
          ctx.fillRect(dx, y, w, sliceH * 0.35);
        }
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = palette.a1;
        ctx.fillRect(-6, h * 0.34, w, 2);
        ctx.fillStyle = palette.a2;
        ctx.fillRect(6, h * 0.52, w, 2);
      }

      ctx.globalAlpha = 0.16;
      ctx.fillStyle = '#000';
      for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
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
