import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Kbd, Message, Modal, toaster } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';

type Cmd = { id: string; label: string; group: string; run: () => void };

const App = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const commands: Cmd[] = useMemo(
    () => [
      {
        id: 'table',
        label: '打开 Table 表格',
        group: '跳转',
        run: () => {
          setOpen(false);
          window.location.hash = '#/rsuite/components/table';
        },
      },
      {
        id: 'date-picker',
        label: '打开 DatePicker 日期选择',
        group: '跳转',
        run: () => {
          setOpen(false);
          window.location.hash = '#/rsuite/components/date-picker';
        },
      },
      {
        id: 'form-validation',
        label: '打开 表单校验',
        group: '跳转',
        run: () => {
          setOpen(false);
          window.location.hash = '#/rsuite/components/form-validation';
        },
      },
      {
        id: 'effects-forms',
        label: '打开 常用效果 · 表单模式',
        group: '跳转',
        run: () => {
          setOpen(false);
          window.location.hash = '#/rsuite/components/effects-forms';
        },
      },
      {
        id: 'effects-data',
        label: '打开 常用效果 · 数据列表',
        group: '跳转',
        run: () => {
          setOpen(false);
          window.location.hash = '#/rsuite/components/effects-data';
        },
      },
      {
        id: 'toast',
        label: '触发一个成功提示',
        group: '动作',
        run: () => {
          setOpen(false);
          toaster.push(
            <Message type="success" showIcon>
              你触发了一个命令（演示）
            </Message>,
            { placement: 'topCenter' }
          );
        },
      },
      {
        id: 'home',
        label: '回到首页',
        group: '跳转',
        run: () => {
          setOpen(false);
          window.location.hash = '#/rsuite';
        },
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.includes(q));
  }, [commands, query]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      const cmd = filtered[active];
      if (cmd) cmd.run();
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', paddingTop: 24 }}>
      <div style={{ fontSize: 13, color: '#8e8e93', marginBottom: 16 }}>
        按 <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>（Mac 为 ⌘ + K）随时唤起命令面板
      </div>
      <Button appearance="primary" startIcon={<SearchIcon />} onClick={() => setOpen(true)}>
        打开命令面板
      </Button>
      <div style={{ fontSize: 12, color: '#c0c0c5', marginTop: 16 }}>支持模糊过滤、↑↓ 选择、Enter 执行、Esc 关闭</div>

      <Modal open={open} onClose={() => setOpen(false)} size="sm">
        <div style={{ padding: 12 }}>
          <Input autoFocus value={query} onChange={setQuery} placeholder="输入命令或搜索…" onKeyDown={onInputKeyDown} />
          <div style={{ marginTop: 10, maxHeight: 300, overflow: 'auto' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: '#b0b0b5' }}>没有匹配的命令</div>
            )}
            {filtered.map((c, i) => (
              <div
                key={c.id}
                onMouseEnter={() => setActive(i)}
                onClick={c.run}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  background: i === active ? '#f0f7ff' : 'transparent',
                  color: i === active ? '#1675e0' : '#333',
                }}
              >
                <span>{c.label}</span>
                <span style={{ fontSize: 11, color: '#b0b0b5' }}>{c.group}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: '1px solid #f2f2f7',
              paddingTop: 10,
              marginTop: 4,
              fontSize: 11,
              color: '#b0b0b5',
              display: 'flex',
              gap: 12,
            }}
          >
            <span>
              <Kbd>↑</Kbd> <Kbd>↓</Kbd> 选择
            </span>
            <span>
              <Kbd>Enter</Kbd> 执行
            </span>
            <span>
              <Kbd>Esc</Kbd> 关闭
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
