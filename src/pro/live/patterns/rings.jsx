/**
 * rings — concentric rings and orbiting beads around a glowing core.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function Rings({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
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
      t += 0.004 + speed * 0.012;
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

      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) * 0.16;
      const count = Math.round(3 + density * 6);

      for (let i = 0; i < count; i += 1) {
        const radius = base * (0.7 + i * 0.52) * (1 + 0.05 * Math.sin(t + i));
        const tilt = 0.16 + 0.1 * i;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.12 * (i % 2 ? -1 : 1) + i * 0.4);
        ctx.scale(1, 1 - tilt);

        ctx.strokeStyle = i % 2 ? palette.a2 : palette.a1;
        ctx.globalAlpha = 0.5 + 0.4 * Math.abs(Math.cos(t + i));
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        const bead = t * (1.1 + i * 0.25);
        const bx = Math.cos(bead) * radius;
        const by = Math.sin(bead) * radius;
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = palette.fg;
        ctx.beginPath();
        ctx.arc(bx, by, 1.6 + 1.4 * Math.abs(Math.sin(bead)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 2.2);
      glow.addColorStop(0, palette.a1);
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, base * 2.2, 0, Math.PI * 2);
      ctx.fill();
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
