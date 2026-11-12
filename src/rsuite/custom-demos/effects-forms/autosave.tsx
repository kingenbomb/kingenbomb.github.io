import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Loader } from 'rsuite';
import SaveIcon from '@rsuite/icons/Save';
import CheckIcon from '@rsuite/icons/Check';

type Status = 'idle' | 'dirty' | 'saving' | 'saved';

const App = () => {
  const [title, setTitle] = useState('产品周报');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [count, setCount] = useState(0);
  const timerRef = useRef<number | null>(null);
  const innerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (innerRef.current) window.clearTimeout(innerRef.current);
    },
    []
  );

  const doSave = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (innerRef.current) window.clearTimeout(innerRef.current);
    setStatus('saving');
    innerRef.current = window.setTimeout(() => {
      setCount((c) => c + 1);
      setSavedAt(new Date());
      setStatus('saved');
    }, 600);
  };

  const touch = () => {
    setStatus('dirty');
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(doSave, 900);
  };

  const statusNode = () => {
    if (status === 'saving')
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Loader size="xs" /> 正在保存…
        </span>
      );
    if (status === 'saved')
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4caf50' }}>
          <CheckIcon />
          已自动保存 {savedAt ? savedAt.toLocaleTimeString('zh-CN', { hour12: false }) : ''}（第 {count} 次）
        </span>
      );
    if (status === 'dirty') return <span style={{ color: '#ff9800' }}>有未保存的修改，稍后自动保存…</span>;
    return '开始输入后，停止 900ms 将自动保存（模拟）';
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', border: '1px solid #e5e5ea', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: '#8e8e93', minHeight: 20 }}>{statusNode()}</span>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Button
            size="sm"
            startIcon={<SaveIcon />}
            disabled={status === 'idle' || status === 'saving'}
            onClick={doSave}
          >
            手动保存
          </Button>
          <Button
            size="sm"
            appearance="subtle"
            onClick={() => {
              setTitle('产品周报');
              setContent('');
              setStatus('idle');
              setCount(0);
              setSavedAt(null);
            }}
          >
            清空
          </Button>
        </div>
      </div>
      <Input
        value={title}
        onChange={(v) => {
          setTitle(v);
          touch();
        }}
        placeholder="文档标题"
        style={{ marginBottom: 10 }}
      />
      <Input
        as="textarea"
        rows={7}
        value={content}
        onChange={(v) => {
          setContent(v);
          touch();
        }}
        placeholder="在这里输入正文，模拟草稿自动保存…"
      />
      <div style={{ fontSize: 12, color: '#c0c0c5', marginTop: 10 }}>
        提示：修改标题或正文都会触发「脏标记 → 保存中 → 已保存」的完整状态流。
      </div>
    </div>
  );
};

export default App;
