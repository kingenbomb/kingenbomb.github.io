import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Loader, Tag } from 'rsuite';

const TOTAL = 80;
const PAGE = 12;
const COLORS = ['#1675e0', '#4caf50', '#ff9800', '#e91e63', '#00bcd4', '#9c27b0'];
const ACTIONS = ['提交了代码', '创建了任务', '评论了需求', '部署了服务', '关闭了缺陷'];
const USERS = ['张伟', '李娜', '王强', '刘洋', '陈晨', '杨帆'];

const App = () => {
  const items = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => ({
        id: i + 1,
        user: USERS[i % USERS.length],
        action: ACTIONS[i % ACTIONS.length],
        time: `${Math.floor(i / 6) + 1}h 前`,
        color: COLORS[i % COLORS.length],
        isNew: i < 2,
      })),
    []
  );
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = count < TOTAL;

  useEffect(() => {
    const el = sentinelRef.current;
    const root = listRef.current;
    if (!el || !root || !hasMore || loading) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoading(true);
          window.setTimeout(() => {
            setCount((c) => Math.min(c + PAGE, TOTAL));
            setLoading(false);
          }, 500);
        }
      },
      { root, rootMargin: '80px 0px' }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [hasMore, loading, count]);

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div
        ref={listRef}
        style={{ height: 380, overflow: 'auto', border: '1px solid #e5e5ea', borderRadius: 8 }}
      >
        {items.slice(0, count).map((it) => (
          <div
            key={it.id}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid #f2f2f7' }}
          >
            <Avatar circle style={{ background: it.color, flexShrink: 0 }}>
              {it.user[0]}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13 }}>
                <b>{it.user}</b> {it.action}
                {it.isNew && (
                  <Tag color="blue" size="sm" style={{ marginLeft: 8 }}>
                    新
                  </Tag>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{it.time}</div>
            </div>
          </div>
        ))}
        <div ref={sentinelRef} style={{ padding: 14, textAlign: 'center', fontSize: 12, color: '#aaa' }}>
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Loader size="xs" /> 加载中…
            </span>
          ) : hasMore ? (
            '上滑加载更多'
          ) : (
            `没有更多了 — 共 ${TOTAL} 条`
          )}
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#c0c0c5', marginTop: 10 }}>
        已加载 {count} / {TOTAL} 条。在容器内滚动到底部自动加载下一页（IntersectionObserver 实现）。
      </div>
    </div>
  );
};

export default App;
