import React, { useState } from 'react';
import { Button, Message, SegmentedControl } from 'rsuite';
import FolderIcon from '@rsuite/icons/Folder';
import ReloadIcon from '@rsuite/icons/Reload';
import TimeIcon from '@rsuite/icons/Time';
import PageIcon from '@rsuite/icons/Page';

const DOCS = [
  { name: '需求说明书 v2.docx', time: '2 小时前更新' },
  { name: '交互设计稿.fig', time: '昨天 18:20' },
  { name: '接口文档.md', time: '3 天前' },
  { name: '测试用例.xlsx', time: '上周' },
];

const App = () => {
  const [mode, setMode] = useState<'list' | 'empty' | 'error'>('list');
  const [retrying, setRetrying] = useState(false);

  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => {
      setRetrying(false);
      setMode('list');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <SegmentedControl
          value={mode}
          onChange={(v) => setMode(v as 'list' | 'empty' | 'error')}
          data={[
            { label: '正常列表', value: 'list' },
            { label: '空数据', value: 'empty' },
            { label: '加载失败', value: 'error' },
          ]}
          block
        />
      </div>

      <div
        style={{
          border: '1px solid #e5e5ea',
          borderRadius: 8,
          minHeight: 300,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {mode === 'list' && (
          <div>
            {DOCS.map((d) => (
              <div
                key={d.name}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', borderBottom: '1px solid #f2f2f7' }}
              >
                <PageIcon style={{ fontSize: 18, color: '#1675e0' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: '#aaa', marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <TimeIcon /> {d.time}
                  </div>
                </div>
                <Button size="xs" appearance="link">
                  下载
                </Button>
              </div>
            ))}
          </div>
        )}

        {mode === 'empty' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              textAlign: 'center',
              padding: '40px 0',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: '#f7f7fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderIcon style={{ fontSize: 30, color: '#b0b0b5' }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>这里还没有文件</div>
            <div style={{ fontSize: 12, color: '#8e8e93', maxWidth: 260, lineHeight: 1.7 }}>
              上传第一个文件后，团队成员就能在这里看到并协作。
            </div>
            <Button appearance="primary" size="sm">
              上传文件
            </Button>
          </div>
        )}

        {mode === 'error' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              padding: '40px 0',
            }}
          >
            <Message type="error" showIcon style={{ maxWidth: 380 }}>
              加载文件列表失败：网络请求超时（ERR_TIMEOUT）
            </Message>
            <Button startIcon={<ReloadIcon />} loading={retrying} onClick={retry}>
              重试
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
