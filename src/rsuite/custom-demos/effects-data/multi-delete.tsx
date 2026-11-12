import React, { useState } from 'react';
import { Button, Checkbox, Message, Modal, Table, toaster } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';

const { Column, Cell, HeaderCell } = Table;

type User = { id: number; name: string; email: string; role: string };

const NAMES = ['张伟', '李娜', '王强', '刘洋', '陈晨', '杨帆', '赵磊', '黄敏', '周杰', '吴倩', '徐涛', '孙丽'];

const ALL: User[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: NAMES[i],
  email: `user${i + 1}@example.com`,
  role: ['管理员', '编辑', '访客'][i % 3],
}));

const App = () => {
  const [rows, setRows] = useState(ALL);
  const [selected, setSelected] = useState<number[]>([]);

  const allChecked = selected.length > 0 && selected.length === rows.length;
  const indeterminate = selected.length > 0 && selected.length < rows.length;

  const toggle = (id: number, checked: boolean) =>
    setSelected((s) => (checked ? [...s, id] : s.filter((x) => x !== id)));

  const toggleAll = (checked: boolean) => setSelected(checked ? rows.map((r) => r.id) : []);

  const removeSelected = () => {
    const n = selected.length;
    Modal.confirm({
      title: '确认删除',
      children: `将删除 ${n} 个用户，此操作不可恢复。`,
      onOk: () => {
        setRows((rs) => rs.filter((r) => !selected.includes(r.id)));
        toaster.push(
          <Message type="success" showIcon>
            已删除 {n} 个用户
          </Message>,
          { placement: 'topCenter' }
        );
        setSelected([]);
      },
    });
  };

  return (
    <div data-testid="multi-delete-demo">
      <div style={{ height: 44, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {selected.length > 0 ? (
          <>
            <span style={{ fontSize: 13, color: '#1675e0' }}>已选中 {selected.length} 项</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" appearance="subtle" onClick={() => setSelected([])}>
                取消选择
              </Button>
              <Button size="sm" color="red" appearance="primary" startIcon={<TrashIcon />} onClick={removeSelected}>
                删除所选
              </Button>
            </div>
          </>
        ) : (
          <span style={{ fontSize: 13, color: '#8e8e93' }}>勾选左侧复选框进行批量操作（共 {rows.length} 位用户）</span>
        )}
      </div>
      <Table data={rows} autoHeight>
        <Column width={60}>
          <HeaderCell>
            <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={(v) => toggleAll(Boolean(v))} />
          </HeaderCell>
          <Cell>
            {(row: User) => (
              <Checkbox checked={selected.includes(row.id)} onChange={(v) => toggle(row.id, Boolean(v))} />
            )}
          </Cell>
        </Column>
        <Column width={80}>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column width={120}>
          <HeaderCell>姓名</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>邮箱</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={100}>
          <HeaderCell>角色</HeaderCell>
          <Cell dataKey="role" />
        </Column>
      </Table>
    </div>
  );
};

export default App;
