/**
 * barChart — animated bars with a live readout line, grid and value labels.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function BarChart({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
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
      t += 0.008 + speed * 0.02;
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, w, h);

      const pad = { l: 26, r: 12, t: 18, b: 22 };
      const plotW = w - pad.l - pad.r;
      const plotH = h - pad.t - pad.b;

      ctx.strokeStyle = `${palette.fg}14`;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i += 1) {
        const y = pad.t + (plotH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(w - pad.r, y);
        ctx.stroke();
      }

      const bars = Math.round(8 + density * 16);
      const barW = plotW / bars;
      const points = [];
      for (let i = 0; i < bars; i += 1) {
        const v =
          0.35 +
          0.32 * (0.5 + 0.5 * Math.sin(t * 1.1 + i * 0.6)) +
          0.18 * (0.5 + 0.5 * Math.cos(t * 0.7 + i * 1.4));
        const barH = plotH * Math.min(0.96, v);
        const x = pad.l + i * barW;
        const y = pad.t + plotH - barH;
        const grad = ctx.createLinearGradient(0, y, 0, pad.t + plotH);
        grad.addColorStop(0, i % 4 === 0 ? palette.a2 : palette.a1);
        grad.addColorStop(1, `${palette.a1}11`);
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.roundRect(x + barW * 0.16, y, barW * 0.68, barH, [3, 3, 0, 0]);
        ctx.fill();
        points.push({ x: x + barW / 2, y });
      }

      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();

      points.forEach(p => {
        ctx.fillStyle = palette.bg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = palette.fg;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      ctx.globalAlpha = 0.5;
      ctx.fillStyle = palette.fg;
      ctx.font = '9px ui-monospace, monospace';
      ctx.fillText('100', 4, pad.t + 8);
      ctx.fillText('50', 8, pad.t + plotH / 2 + 3);
      ctx.fillText('0', 12, pad.t + plotH + 3);
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
