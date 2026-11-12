/**
 * cursorTrail — a lagging ring plus a fading trail of dots that follows the pointer.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function CursorTrail({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let t = seed;

    const pointer = { x: 0, y: 0, active: false };
    const ring = { x: 0, y: 0 };
    const trail = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointer.x = w / 2;
      pointer.y = h / 2;
      ring.x = w / 2;
      ring.y = h / 2;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const onMove = event => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    canvas.addEventListener('pointermove', onMove);

    const draw = () => {
      t += 0.02;
      if (!pointer.active) {
        pointer.x = w / 2 + Math.cos(t * 0.7) * w * 0.22;
        pointer.y = h / 2 + Math.sin(t) * h * 0.2;
      }

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

      ring.x += (pointer.x - ring.x) * (0.06 + speed * 0.1);
      ring.y += (pointer.y - ring.y) * (0.06 + speed * 0.1);

      trail.push({ x: ring.x, y: ring.y });
      if (trail.length > Math.round(14 + density * 30)) trail.shift();

      for (let i = 0; i < trail.length; i += 1) {
        const p = trail[i];
        const k = i / trail.length;
        ctx.globalAlpha = k * 0.85;
        ctx.fillStyle = i % 6 === 0 ? palette.a2 : palette.a1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1 + k * (3 + density * 4), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, 14 + Math.sin(t * 2) * 2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = palette.a1;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onMove);
    };
  }, [palette, density, speed, seed]);

  return <canvas ref={ref} className="block h-full w-full cursor-crosshair" aria-hidden="true" />;
}
