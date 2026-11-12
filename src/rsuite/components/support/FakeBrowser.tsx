import React, { useRef } from 'react';

type FakeBrowserProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
};

const dot = (color: string, onClick?: () => void) => (
  <span
    onClick={onClick}
    style={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: color,
      display: 'inline-block',
      cursor: onClick ? 'pointer' : 'default',
    }}
  />
);

function FakeBrowser({ children, width, height, style, className, ...rest }: FakeBrowserProps) {
  const browserRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    const browser = browserRef.current;
    if (!browser) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      browser.requestFullscreen();
    }
  };

  return (
    <div
      ref={browserRef}
      {...rest}
      className={className}
      style={{ width, height, border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', background: '#fff', ...style }}
    >
      <div
        style={{
          height: 36,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 12px',
          borderBottom: '1px solid #ddd',
        }}
      >
        {dot('#ff5f57')}
        {dot('#febc2e')}
        {dot('#28c840', toggleFullscreen)}
      </div>
      <div style={{ width, height: 'calc(100% - 36px)', overflow: 'auto' }}>{children}</div>
    </div>
  );
}

export default FakeBrowser;
