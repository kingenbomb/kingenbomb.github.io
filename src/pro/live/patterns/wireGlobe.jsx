/**
 * wireGlobe — a rotating wireframe sphere with latitude/longitude lines and node sparks.
 * Reimplementation written for this clone (the original component's source is paid).
 */
import { useEffect, useRef } from 'react';

export default function WireGlobe({ palette, density = 0.5, speed = 0.4, seed = 1 }) {
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

    const project = (lon, lat, radius, cx, cy) => {
      const x = Math.cos(lat) * Math.sin(lon + t * 0.6);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(lon + t * 0.6);
      return { x: cx + x * radius, y: cy - y * radius, z };
    };

    const draw = () => {
      t += 0.006 + speed * 0.016;
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
      const radius = Math.min(w, h) * 0.36;

      const latLines = Math.round(5 + density * 7);
      for (let i = 1; i < latLines; i += 1) {
        const lat = -Math.PI / 2 + (Math.PI * i) / latLines;
        ctx.beginPath();
        for (let lon = 0; lon <= Math.PI * 2 + 0.05; lon += 0.08) {
          const p = project(lon, lat, radius, cx, cy);
          if (lon === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = i % 3 === 0 ? palette.a2 : palette.a1;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      const lonLines = Math.round(8 + density * 10);
      for (let i = 0; i < lonLines; i += 1) {
        const lon = (Math.PI * 2 * i) / lonLines;
        ctx.beginPath();
        let started = false;
        for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += 0.09) {
          const p = project(lon, lat, radius, cx, cy);
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = i % 4 === 0 ? palette.a2 : palette.a1;
        ctx.globalAlpha = 0.28;
        ctx.stroke();
      }

      for (let i = 0; i < 26; i += 1) {
        const lon = i * 2.399 + t * 0.1;
        const lat = Math.asin(-1 + (2 * (i + 0.5)) / 26);
        const p = project(lon, lat, radius, cx, cy);
        if (p.z < -0.1) continue;
        ctx.globalAlpha = 0.35 + 0.6 * p.z;
        ctx.fillStyle = palette.fg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4 + 1.6 * p.z, 0, Math.PI * 2);
        ctx.fill();
      }

      const glow = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.35);
      glow.addColorStop(0, 'transparent');
      glow.addColorStop(0.75, `${palette.a1}22`);
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
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
