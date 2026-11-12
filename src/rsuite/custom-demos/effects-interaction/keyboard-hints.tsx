import React, { useState } from 'react';
import { Kbd, Message, toaster } from 'rsuite';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], desc: '打开命令面板' },
  { keys: ['Ctrl', 'S'], desc: '保存当前草稿' },
  { keys: ['Enter'], desc: '提交当前输入框内容' },
  { keys: ['↑', '↓'], desc: '在列表中移动选择' },
  { keys: ['Esc'], desc: '关闭弹窗 / 取消编辑' },
  { keys: ['Shift', 'Enter'], desc: '多行输入中换行' },
];

const App = () => {
  const [pressed, setPressed] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') return;
    e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      toaster.push(
        <Message type="info" showIcon>
          已拦截 Ctrl+S —— 演示环境不会真的保存
        </Message>,
        { placement: 'topCenter' }
      );
    }
    const keys: string[] = [];
    if (e.ctrlKey || e.metaKey) keys.push('Ctrl');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');
    const k = e.key;
    if (!['Control', 'Meta', 'Alt', 'Shift'].includes(k)) keys.push(k.length === 1 ? k.toUpperCase() : k);
    setPressed(keys);
    const combo = keys.join(' + ');
    if (combo) setLog((l) => [combo, ...l.filter((x) => x !== combo)].slice(0, 5));
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ border: '1px solid #e5e5ea', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '10px 14px', background: '#fafafa', borderBottom: '1px solid #f2f2f7', fontSize: 13, fontWeight: 600 }}>
          快捷键速查
        </div>
        {SHORTCUTS.map((s) => (
          <div
            key={s.desc}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              borderBottom: '1px solid #f7f7fa',
              fontSize: 13,
            }}
          >
            <span style={{ color: '#595959' }}>{s.desc}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {s.keys.map((k, i) => (
                <React.Fragment key={k}>
                  {i > 0 && <span style={{ fontSize: 11, color: '#b0b0b5' }}>+</span>}
                  <Kbd>{k}</Kbd>
                </React.Fragment>
              ))}
            </span>
          </div>
        ))}
      </div>

      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setPressed([])}
        style={{
          border: '1px dashed #c7c7cc',
          borderRadius: 8,
          padding: 24,
          textAlign: 'center',
          outline: 'none',
          cursor: 'text',
        }}
      >
        <div style={{ fontSize: 12, color: '#8e8e93', marginBottom: 14 }}>点击这里聚焦，然后按任意组合键试试</div>
        <div style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {pressed.length === 0 ? (
            <span style={{ color: '#c0c0c5', fontSize: 13 }}>等待按键…</span>
          ) : (
            pressed.map((k, i) => (
              <React.Fragment key={`${k}-${i}`}>
                {i > 0 && <span style={{ color: '#b0b0b5' }}>+</span>}
                <Kbd>{k}</Kbd>
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {log.length > 0 && (
        <div style={{ marginTop: 16, fontSize: 12, color: '#8e8e93' }}>
          <div style={{ marginBottom: 6 }}>最近按下的组合：</div>
          {log.map((l, i) => (
            <div key={l} style={{ padding: '4px 0', color: i === 0 ? '#1675e0' : '#b0b0b5' }}>
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
