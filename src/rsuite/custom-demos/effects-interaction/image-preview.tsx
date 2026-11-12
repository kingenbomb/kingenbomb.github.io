import React, { useEffect, useMemo, useState } from 'react';
import { IconButton, Modal } from 'rsuite';
import ArrowLeftIcon from '@rsuite/icons/ArrowLeft';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';

const COLORS = ['#5B8FF9', '#61DDAA', '#F6BD16', '#7262fd', '#78D3F8', '#F6903D'];

const makeSvg = (bg: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="100%" height="100%" fill="${bg}"/><circle cx="80" cy="340" r="120" fill="rgba(255,255,255,0.14)"/><text x="50%" y="50%" font-family="sans-serif" font-size="44" fill="rgba(255,255,255,0.95)" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  )}`;

const App = () => {
  const images = useMemo(
    () => COLORS.map((c, i) => ({ src: makeSvg(c, `示例图 ${i + 1}`), title: `工作台截图 ${i + 1}` })),
    []
  );
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => {
              setIdx(i);
              setOpen(true);
            }}
            style={{
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'zoom-in',
              border: '1px solid #e5e5ea',
              transition: 'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <img src={img.src} alt={img.title} style={{ display: 'block', width: '100%' }} />
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: '#c0c0c5', marginTop: 10 }}>点击任意缩略图打开预览（支持 ← → 方向键切换）</div>

      <Modal open={open} onClose={() => setOpen(false)} size="lg">
        <Modal.Body style={{ padding: 0 }}>
          <div style={{ position: 'relative', textAlign: 'center', background: '#0d0d0d', borderRadius: 8, overflow: 'hidden' }}>
            <img
              src={images[idx].src}
              alt={images[idx].title}
              style={{ display: 'block', width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
            />
            <IconButton
              icon={<ArrowLeftIcon />}
              circle
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              onClick={prev}
              title="上一张"
            />
            <IconButton
              icon={<ArrowRightIcon />}
              circle
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
              onClick={next}
              title="下一张"
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 4px 0',
              fontSize: 13,
              color: '#595959',
            }}
          >
            <span>{images[idx].title}</span>
            <span style={{ color: '#8e8e93' }}>
              {idx + 1} / {images.length}
            </span>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
