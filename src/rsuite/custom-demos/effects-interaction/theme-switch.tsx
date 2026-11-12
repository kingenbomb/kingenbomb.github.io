import React, { useState } from 'react';
import { Button, CustomProvider, Input, Progress, Tag, Toggle } from 'rsuite';

const App = () => {
  const [dark, setDark] = useState(false);

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <Toggle checked={dark} onChange={(v) => setDark(Boolean(v))} />
        <span style={{ fontSize: 13 }}>{dark ? '深色模式' : '浅色模式'}</span>
        <span style={{ fontSize: 12, color: '#b0b0b5' }}>基于 CustomProvider 实现，无需刷新页面</span>
      </div>

      <div
        style={{
          borderRadius: 10,
          border: '1px solid',
          borderColor: dark ? '#2a2a2a' : '#e5e5ea',
          background: dark ? '#1a1a1a' : '#ffffff',
          padding: 20,
          transition: 'background .2s, border-color .2s',
        }}
      >
        <CustomProvider theme={dark ? 'dark' : 'light'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button appearance="primary">主要按钮</Button>
              <Button>默认按钮</Button>
              <Button appearance="ghost">幽灵按钮</Button>
            </div>
            <Input placeholder="输入框会跟随主题自动换肤" style={{ maxWidth: 300 }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag color="blue">blue</Tag>
              <Tag color="green">green</Tag>
              <Tag color="orange">orange</Tag>
              <Tag color="red">red</Tag>
            </div>
            <div style={{ maxWidth: 300 }}>
              <Progress.Line percent={64} />
            </div>
          </div>
        </CustomProvider>
      </div>

      <div style={{ fontSize: 12, color: '#c0c0c5', marginTop: 12 }}>
        代码：{`<CustomProvider theme={dark ? 'dark' : 'light'}>…</CustomProvider>`}
      </div>
    </div>
  );
};

export default App;
