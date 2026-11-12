import React, { useRef, useState } from 'react';
import { Button, Input, Message, toaster } from 'rsuite';
import CopyIcon from '@rsuite/icons/Copy';
import CheckIcon from '@rsuite/icons/Check';

const ITEMS = [
  { label: '安装命令', value: 'npm install rsuite @rsuite/icons' },
  { label: '接口地址', value: 'https://api.example.com/v1/users' },
  { label: 'Access Key', value: 'sk-live-9f8a7b6c5d4e3f2a1b0c' },
];

const CODE = 'toaster.push(<Message type="success">Saved</Message>);';

const App = () => {
  const [copied, setCopied] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const doCopy = async (text: string, index: number) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(index);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(null), 1600);
    } else {
      toaster.push(
        <Message type="warning" showIcon>
          复制失败，请手动选择复制
        </Message>,
        { placement: 'topCenter' }
      );
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {ITEMS.map((it, i) => (
        <div key={it.label} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#8e8e93', marginBottom: 6 }}>{it.label}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input readOnly value={it.value} style={{ flex: 1 }} />
            <Button
              style={{ flexShrink: 0, width: 100 }}
              icon={copied === i ? <CheckIcon /> : <CopyIcon />}
              color={copied === i ? 'green' : undefined}
              onClick={() => doCopy(it.value, i)}
            >
              {copied === i ? '已复制' : '复制'}
            </Button>
          </div>
        </div>
      ))}

      <div style={{ fontSize: 12, color: '#8e8e93', margin: '20px 0 8px' }}>图标形态（常用于代码块 / 卡片角标）</div>
      <div style={{ position: 'relative', background: '#0d0d0d', borderRadius: 8, padding: '14px 48px 14px 14px' }}>
        <pre style={{ margin: 0, fontSize: 12, color: '#ddd' }}>{CODE}</pre>
        <button
          onClick={() => doCopy(CODE, 99)}
          title="复制代码"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            border: '1px solid #333',
            background: '#1a1a1a',
            color: copied === 99 ? '#4caf50' : '#aaa',
            borderRadius: 6,
            width: 28,
            height: 28,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {copied === 99 ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};

export default App;
