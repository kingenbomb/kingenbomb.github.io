/**
 * ditherNoise — ordered-dither / pixel-mosaic field that breathes and reacts to the pointer.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function DitherNoise({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1);
    let raf = 0;
    let t = seed * 5;
    let w = 0;
    let h = 0;
    const pointer = { x: -1, y: -1 };

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

    const onMove = event => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    canvas.addEventListener('pointermove', onMove);

    const draw = () => {
      t += 0.01 + speed * 0.03;
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

      const cell = Math.max(4, Math.round(11 - density * 6));
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const px = x * cell;
          const py = y * cell;
          const nx = (x / cols - 0.5) * 2;
          const ny = (y / rows - 0.5) * 2;
          let field =
            0.5 +
            0.5 * Math.sin(nx * 4.2 + t) * Math.cos(ny * 3.6 - t * 0.8) +
            0.22 * Math.sin((nx + ny) * 7 - t * 1.4);

          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const near = Math.hypot(dx, dy);
          if (near < 120) field += (1 - near / 120) * 0.55;

          const level = Math.floor(Math.max(0, Math.min(1, field)) * 4);
          if (level === 0 && (x + y) % 3 !== 0) continue;
          ctx.globalAlpha = 0.45 + level * 0.14;
          ctx.fillStyle = level >= 3 ? palette.a2 : palette.a1;
          ctx.fillRect(px, py, cell - 1, cell - 1);
        }
      }
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

  return <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />;
}
