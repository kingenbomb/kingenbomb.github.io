/**
 * gradientBlobs — soft additive radial blobs drifting and blending like liquid light.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function GradientBlobs({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = seed * 2;
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
      t += 0.003 + speed * 0.008;
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      const count = Math.round(3 + density * 5);
      for (let i = 0; i < count; i += 1) {
        const phase = t * (0.8 + i * 0.22) + i * 2.1;
        const cx = w * (0.5 + 0.32 * Math.sin(phase * 0.9 + i));
        const cy = h * (0.5 + 0.3 * Math.cos(phase * 1.1 + i * 1.7));
        const radius = Math.min(w, h) * (0.22 + 0.16 * Math.sin(phase * 0.6 + i));
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(radius, 1));
        grad.addColorStop(0, i % 2 ? palette.a2 : palette.a1);
        grad.addColorStop(0.55, `${i % 2 ? palette.a2 : palette.a1}55`);
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(radius, 1), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#000';
      for (let y = 0; y < h; y += 2) ctx.fillRect(0, y, w, 1);
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
