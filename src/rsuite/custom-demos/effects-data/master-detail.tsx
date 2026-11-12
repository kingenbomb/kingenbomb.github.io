import React, { useState } from 'react';
import { Badge, Button, Input, Tag } from 'rsuite';

type Conv = { id: number; name: string; preview: string; time: string; unread: number; tag: string; color: string };

const CONVS: Conv[] = [
  { id: 1, name: '张伟', preview: '明天的评审会移到下午两点', time: '10:24', unread: 2, tag: '内部', color: '#1675e0' },
  { id: 2, name: '李娜', preview: '设计稿已更新到 v3 版本', time: '09:58', unread: 1, tag: '设计', color: '#4caf50' },
  { id: 3, name: '王强', preview: '接口联调完成了，可以提测', time: '昨天', unread: 0, tag: '研发', color: '#ff9800' },
  { id: 4, name: '客户群 · 远航科技', preview: '麻烦把报价单再发一份', time: '昨天', unread: 5, tag: '客户', color: '#e91e63' },
  { id: 5, name: '刘洋', preview: '好的，收到', time: '周三', unread: 0, tag: '内部', color: '#00bcd4' },
  { id: 6, name: '运营对接群', preview: '本周数据周报已同步', time: '周二', unread: 0, tag: '群组', color: '#9c27b0' },
];

const INITIAL_MESSAGES: Record<number, { from: 'me' | 'them'; text: string }[]> = {
  1: [
    { from: 'them', text: '周报里那个转化率的口径我有点疑问' },
    { from: 'me', text: '是指注册到首次下单的漏斗吗？' },
    { from: 'them', text: '对，另外明天的评审会移到下午两点' },
  ],
  2: [
    { from: 'them', text: '设计稿已更新到 v3 版本' },
    { from: 'me', text: '收到，我下午过一遍改版页面' },
  ],
  3: [{ from: 'them', text: '接口联调完成了，可以提测' }],
  4: [{ from: 'them', text: '麻烦把报价单再发一份' }],
  5: [{ from: 'them', text: '好的，收到' }],
  6: [{ from: 'them', text: '本周数据周报已同步' }],
};

const App = () => {
  const [activeId, setActiveId] = useState(1);
  const [convList, setConvList] = useState(CONVS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const active = convList.find((c) => c.id === activeId)!;
  const msgs = messages[activeId] || [];

  const openConv = (id: number) => {
    setActiveId(id);
    setConvList((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => ({ ...m, [activeId]: [...(m[activeId] || []), { from: 'me', text }] }));
    setDraft('');
    setConvList((cs) => cs.map((c) => (c.id === activeId ? { ...c, preview: text, time: '刚刚' } : c)));
  };

  const markRead = () => setConvList((cs) => cs.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c)));

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', minHeight: 440 }}>
      <div
        style={{
          width: 270,
          flexShrink: 0,
          border: '1px solid #e5e5ea',
          borderRadius: 8,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #f2f2f7', fontSize: 13, fontWeight: 600, background: '#fafafa' }}>
          会话列表
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {convList.map((c) => (
            <div
              key={c.id}
              onClick={() => openConv(c.id)}
              style={{
                display: 'flex',
                gap: 10,
                padding: '10px 14px',
                cursor: 'pointer',
                background: c.id === activeId ? '#f0f7ff' : '#fff',
                borderLeft: c.id === activeId ? '2px solid #1675e0' : '2px solid transparent',
              }}
            >
              <Badge content={c.unread || undefined}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: c.color,
                    color: '#fff',
                    fontSize: 14,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {c.name[0]}
                </span>
              </Badge>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: c.unread ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 130,
                    }}
                  >
                    {c.name}
                  </span>
                  <span style={{ fontSize: 11, color: '#b0b0b5', flexShrink: 0 }}>{c.time}</span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#8e8e93',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: 2,
                  }}
                >
                  {c.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          border: '1px solid #e5e5ea',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid #f2f2f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{active.name}</span>
            <Tag size="sm" color="blue">
              {active.tag}
            </Tag>
          </div>
          <Button size="xs" appearance="subtle" onClick={markRead} disabled={!active.unread}>
            标为已读
          </Button>
        </div>

        <div
          style={{
            flex: 1,
            padding: 16,
            background: '#fafbfc',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minHeight: 220,
          }}
        >
          {msgs.map((m, i) => (
            <div key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 13,
                  lineHeight: 1.6,
                  background: m.from === 'me' ? '#1675e0' : '#fff',
                  color: m.from === 'me' ? '#fff' : '#333',
                  border: m.from === 'me' ? 'none' : '1px solid #e5e5ea',
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {msgs.length === 0 && (
            <div style={{ color: '#b0b0b5', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>暂无消息，打个招呼吧</div>
          )}
        </div>

        <div style={{ padding: 12, borderTop: '1px solid #f2f2f7', display: 'flex', gap: 10 }}>
          <Input value={draft} onChange={setDraft} placeholder={`发送给 ${active.name}…`} onPressEnter={send} />
          <Button appearance="primary" onClick={send} disabled={!draft.trim()}>
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
