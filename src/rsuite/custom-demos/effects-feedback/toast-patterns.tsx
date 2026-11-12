import React, { useState } from 'react';
import { Button, Loader, Message, Notification, SelectPicker, toaster } from 'rsuite';

const PLACEMENTS = ['topCenter', 'topStart', 'topEnd', 'bottomCenter', 'bottomStart', 'bottomEnd'].map((v) => ({
  label: v,
  value: v,
}));

const App = () => {
  const [placement, setPlacement] = useState('topCenter');

  const push = (type: 'success' | 'warning' | 'error' | 'info', header: string, text: string) => {
    toaster.push(
      <Message type={type} showIcon header={header}>
        {text}
      </Message>,
      { placement: placement as any, duration: 2500 }
    );
  };

  const asyncFlow = () => {
    const key = toaster.push(
      <Notification type="info" header="正在提交" duration={0} closable={false}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Loader size="xs" /> 正在把数据提交到服务器…
        </span>
      </Notification>,
      { placement: placement as any }
    );
    window.setTimeout(() => {
      toaster.remove(key);
      toaster.push(
        <Notification type="success" header="提交成功" duration={2500}>
          数据已保存（演示）
        </Notification>,
        { placement: placement as any }
      );
    }, 1600);
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 13 }}>弹出位置</span>
        <SelectPicker
          data={PLACEMENTS}
          value={placement}
          onChange={(v) => setPlacement(String(v))}
          style={{ width: 160 }}
          cleanable={false}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Button onClick={() => push('success', '操作成功', '数据已保存')}>成功提示</Button>
        <Button onClick={() => push('warning', '注意', '磁盘空间剩余不足 10%')}>警告提示</Button>
        <Button onClick={() => push('error', '请求失败', '网络异常，请稍后重试')}>错误提示</Button>
        <Button onClick={() => push('info', '提示', '新版本 v6.2.5 已发布')}>信息提示</Button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <Button block appearance="primary" onClick={asyncFlow}>
          加载 → 成功（异步更新）
        </Button>
        <Button style={{ flexShrink: 0 }} onClick={() => toaster.clear()}>
          清空全部
        </Button>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 12, color: '#8e8e93' }}>页面内静态提示（不弹出）：</div>
        <Message type="success" showIcon closable>
          已自动备份到云端。
        </Message>
        <Message type="info" showIcon>
          本周还有 3 个任务待处理。
        </Message>
      </div>
    </div>
  );
};

export default App;
