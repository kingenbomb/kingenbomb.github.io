import React, { useRef, useState } from 'react';
import { Button } from 'rsuite';
import ArrowUpIcon from '@rsuite/icons/ArrowUp';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';

const INITIAL = ['产品需求评审', '接口联调', '前端页面开发', '单元测试', '部署上线', '复盘会议'];

const App = () => {
  const [items, setItems] = useState([...INITIAL]);
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    setItems((list) => {
      const next = [...list];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ fontSize: 13, color: '#8e8e93', marginBottom: 12 }}>拖拽卡片调整任务顺序</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div
            key={it}
            draggable
            onDragStart={() => {
              dragIndex.current = i;
              setDragging(i);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (overIndex !== i) setOverIndex(i);
            }}
            onDragLeave={() => setOverIndex((cur) => (cur === i ? null : cur))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex.current !== null && dragIndex.current !== i) move(dragIndex.current, i);
              dragIndex.current = null;
              setDragging(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              dragIndex.current = null;
              setDragging(null);
              setOverIndex(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              background: '#fff',
              border: '1px solid',
              borderColor: overIndex === i ? '#1675e0' : '#e5e5ea',
              borderRadius: 8,
              cursor: 'grab',
              opacity: dragging === i ? 0.4 : 1,
              boxShadow: overIndex === i ? '0 0 0 2px rgba(22,117,224,0.15)' : 'none',
              transition: 'border-color .15s, box-shadow .15s, opacity .15s',
            }}
          >
            <span style={{ color: '#c7c7cc', fontSize: 16, letterSpacing: 2, userSelect: 'none' }}>⠿</span>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#f2f2f7',
                color: '#8e8e93',
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span style={{ flex: 1, fontSize: 14 }}>{it}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <Button size="xs" appearance="subtle" disabled={i === 0} onClick={() => move(i, i - 1)} icon={<ArrowUpIcon />} />
              <Button
                size="xs"
                appearance="subtle"
                disabled={i === items.length - 1}
                onClick={() => move(i, i + 1)}
                icon={<ArrowDownIcon />}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#c0c0c5' }}>基于原生 HTML5 拖放 API，无需第三方依赖</span>
        <Button size="sm" onClick={() => setItems([...INITIAL])}>
          重置顺序
        </Button>
      </div>
    </div>
  );
};

export default App;
