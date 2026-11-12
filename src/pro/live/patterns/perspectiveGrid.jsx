/**
 * perspectiveGrid — a neon floor grid rushing toward the horizon with a soft glow.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function PerspectiveGrid({ palette, density = 0.5, speed = 0.5, seed = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let offset = seed * 4;
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
      offset += 0.35 + speed * 1.6;
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, palette.bg);
      sky.addColorStop(0.48, palette.bg);
      sky.addColorStop(0.5, '#000000');
      sky.addColorStop(1, palette.bg);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Soft accent wash so the frame reads like the official capture, not flat black.
      const wash = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
      wash.addColorStop(0, palette.a1);
      wash.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      const horizon = h * 0.5;
      const cx = w / 2;
      const lanes = Math.round(9 + density * 12);

      ctx.lineWidth = 1.6;
      ctx.strokeStyle = palette.a1;
      for (let i = -lanes; i <= lanes; i += 1) {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx + i * 8, horizon);
        ctx.lineTo(cx + i * (w / lanes) * 1.9, h);
        ctx.stroke();
      }

      const rows = 16;
      for (let r = 0; r < rows; r += 1) {
        const z = (r + (offset % 1)) / rows;
        const p = Math.pow(z, 3.2);
        const y = horizon + p * (h - horizon);
        ctx.globalAlpha = 0.22 + 0.6 * p;
        ctx.strokeStyle = r % 4 === 0 ? palette.a2 : palette.a1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      const glow = ctx.createLinearGradient(0, horizon - 60, 0, horizon + 20);
      glow.addColorStop(0, 'transparent');
      glow.addColorStop(1, palette.a1);
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, horizon - 60, w, 80);
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
