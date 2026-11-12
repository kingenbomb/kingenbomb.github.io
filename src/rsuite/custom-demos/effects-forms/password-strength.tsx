import React, { useMemo, useState } from 'react';
import { Input, Progress } from 'rsuite';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';

const RULES = [
  { id: 'len', label: '至少 8 个字符', test: (v: string) => v.length >= 8 },
  { id: 'upper', label: '包含大写字母', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower', label: '包含小写字母', test: (v: string) => /[a-z]/.test(v) },
  { id: 'digit', label: '包含数字', test: (v: string) => /\d/.test(v) },
  { id: 'symbol', label: '包含符号（如 !@#$%）', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const App = () => {
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');

  const passed = useMemo(() => RULES.filter((r) => r.test(pwd)).length, [pwd]);
  const percent = pwd ? passed * 20 : 0;
  const level = !pwd ? 0 : passed <= 1 ? 1 : passed <= 3 ? 2 : passed === 4 ? 3 : 4;
  const label = ['', '弱', '一般', '强', '很强'][level];
  const status: 'fail' | 'active' | 'success' = level <= 1 ? 'fail' : level === 2 ? 'active' : 'success';

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <div style={{ marginBottom: 6, fontSize: 13 }}>设置密码</div>
      <Input
        type="password"
        value={pwd}
        onChange={setPwd}
        placeholder="输入密码"
        autoComplete="new-password"
      />

      {pwd && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
            <span style={{ color: '#8e8e93' }}>强度：{label}</span>
            <span style={{ color: '#8e8e93' }}>
              {passed} / {RULES.length}
            </span>
          </div>
          <Progress.Line percent={percent} status={status} showInfo={false} />
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RULES.map((r) => {
          const ok = Boolean(pwd) && r.test(pwd);
          return (
            <div
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: ok ? '#4caf50' : '#8e8e93',
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: ok ? '#e8f5e9' : '#f2f2f7',
                  color: ok ? '#4caf50' : '#c7c7cc',
                  fontSize: 9,
                  flexShrink: 0,
                }}
              >
                {ok ? <CheckIcon /> : <CloseIcon />}
              </span>
              {r.label}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 22, marginBottom: 6, fontSize: 13 }}>确认密码</div>
      <Input type="password" value={confirm} onChange={setConfirm} placeholder="再次输入" autoComplete="new-password" />
      {confirm && (
        <div style={{ fontSize: 12, marginTop: 6, color: confirm === pwd ? '#4caf50' : '#f44336' }}>
          {confirm === pwd ? '两次输入一致' : '两次输入不一致'}
        </div>
      )}
    </div>
  );
};

export default App;
