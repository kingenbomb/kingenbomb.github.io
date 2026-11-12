import React, { useRef, useState } from 'react';
import { Button, IconButton, Input, Message, SelectPicker, toaster } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import AddOutlineIcon from '@rsuite/icons/AddOutline';

type Row = { key: number; name: string; relation: string; phone: string };

const RELATIONS = ['同事', '客户', '供应商', '朋友'].map((v) => ({ label: v, value: v }));

const App = () => {
  const nextKey = useRef(3);
  const [rows, setRows] = useState<Row[]>([
    { key: 1, name: '张伟', relation: '同事', phone: '13800000001' },
    { key: 2, name: '', relation: '客户', phone: '' },
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const update = (key: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const add = () => setRows((rs) => [...rs, { key: nextKey.current++, name: '', relation: '同事', phone: '' }]);

  const remove = (key: number) => {
    setRows((rs) => rs.filter((r) => r.key !== key));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const submit = () => {
    const next: Record<number, string> = {};
    for (const r of rows) {
      if (!r.name.trim()) next[r.key] = '姓名不能为空';
      else if (r.phone && !/^1\d{10}$/.test(r.phone)) next[r.key] = '手机号格式不正确（需 11 位）';
    }
    setErrors(next);
    if (Object.keys(next).length === 0) {
      toaster.push(
        <Message type="success" showIcon header="提交成功">
          共 {rows.length} 位联系人已保存（演示）
        </Message>,
        { placement: 'topCenter' }
      );
    } else {
      toaster.push(
        <Message type="error" showIcon header="校验未通过">
          有 {Object.keys(next).length} 行数据需要修正
        </Message>,
        { placement: 'topCenter' }
      );
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ fontSize: 13, color: '#8e8e93', marginBottom: 12 }}>联系人列表（{rows.length} 位）</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 22, lineHeight: '36px', fontSize: 12, color: '#aaa', textAlign: 'center' }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <Input value={r.name} onChange={(v) => update(r.key, { name: v })} placeholder="姓名" />
              {errors[r.key] && <div style={{ fontSize: 12, color: '#f44336', marginTop: 4 }}>{errors[r.key]}</div>}
            </div>
            <SelectPicker
              data={RELATIONS}
              value={r.relation}
              onChange={(v) => update(r.key, { relation: String(v) })}
              style={{ width: 110 }}
              cleanable={false}
            />
            <div style={{ width: 180 }}>
              <Input
                value={r.phone}
                onChange={(v) => update(r.key, { phone: v.replace(/[^\d]/g, '') })}
                placeholder="手机号（选填）"
              />
            </div>
            <IconButton
              icon={<TrashIcon />}
              onClick={() => remove(r.key)}
              title="删除这一行"
              appearance="subtle"
              color="red"
              style={{ marginTop: 2 }}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button appearance="ghost" onClick={add} startIcon={<AddOutlineIcon />}>
          添加联系人
        </Button>
        <Button appearance="primary" onClick={submit}>
          提交保存
        </Button>
      </div>
    </div>
  );
};

export default App;
