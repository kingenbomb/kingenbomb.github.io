/**
 * ribbons — layered bezier ribbons flowing across the frame with additive blending.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function Ribbons({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = seed * 3;
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
      t += 0.004 + speed * 0.014;
      ctx.globalCompositeOperation = 'source-over';
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
      ctx.globalCompositeOperation = 'lighter';

      const count = Math.round(5 + density * 9);
      for (let i = 0; i < count; i += 1) {
        const phase = i * 0.9 + t;
        const yBase = h * (0.18 + (i / count) * 0.68);
        const amplitude = h * (0.06 + 0.1 * Math.sin(phase * 0.7));
        const thickness = 1.8 + 3.4 * Math.abs(Math.sin(phase * 1.3));

        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 12) {
          const u = x / w;
          const y =
            yBase +
            Math.sin(u * 5.2 + phase) * amplitude +
            Math.sin(u * 11.3 - phase * 0.8) * amplitude * 0.28;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = i % 2 ? palette.a2 : palette.a1;
        ctx.globalAlpha = 0.38 + 0.3 * Math.abs(Math.sin(phase));
        ctx.lineWidth = thickness;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
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
