import React, { useEffect, useState } from 'react';
import { Avatar, Button, Placeholder, Tag } from 'rsuite';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 2200);
    return () => window.clearTimeout(t);
  }, []);

  const reload = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', border: '1px solid #e5e5ea', borderRadius: 8, overflow: 'hidden' }}>
      {loading ? (
        <div style={{ padding: 20 }} data-testid="skeleton">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div className="animate-pulse" style={{ width: 56, height: 56, borderRadius: '50%', background: '#ececf1' }} />
            <div style={{ flex: 1 }}>
              <div className="animate-pulse" style={{ height: 14, width: '35%', borderRadius: 4, background: '#ececf1' }} />
              <div className="animate-pulse" style={{ height: 12, width: '55%', borderRadius: 4, background: '#f2f2f7', marginTop: 10 }} />
            </div>
          </div>
          <Placeholder.Paragraph rows={3} active style={{ marginTop: 20 }} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
              <div className="animate-pulse" style={{ width: 36, height: 36, borderRadius: 8, background: '#ececf1' }} />
              <div style={{ flex: 1 }}>
                <div
                  className="animate-pulse"
                  style={{ height: 12, width: `${60 - i * 12}%`, borderRadius: 4, background: '#ececf1' }}
                />
                <div
                  className="animate-pulse"
                  style={{ height: 10, width: '80%', borderRadius: 4, background: '#f2f2f7', marginTop: 8 }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar size="lg" circle style={{ background: '#1675e0' }}>
              王
            </Avatar>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                王小明
                <Tag size="sm" color="green" style={{ marginLeft: 8 }}>
                  已验证
                </Tag>
              </div>
              <div style={{ fontSize: 12, color: '#8e8e93', marginTop: 4 }}>高级前端工程师 · 杭州 · 加入 3 年</div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: '#595959', marginTop: 16 }}>
            关注组件库与可视化方向，负责过多个中后台系统的前端架构设计，喜欢把重复的事情自动化。
          </p>
          <div style={{ marginTop: 16 }}>
            {['数据可视化平台', '组件库 6.x 升级', '低代码表单引擎'].map((p) => (
              <div
                key={p}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderTop: '1px solid #f2f2f7',
                  fontSize: 13,
                }}
              >
                <span>{p}</span>
                <span style={{ color: '#1675e0' }}>查看</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid #f2f2f7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, color: '#c0c0c5' }}>{loading ? '正在加载个人资料…' : '资料已加载'}</span>
        <Button size="sm" appearance="subtle" onClick={reload} disabled={loading}>
          重新加载（演示骨架屏）
        </Button>
      </div>
    </div>
  );
};

export default App;
