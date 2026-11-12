import React, { useState } from 'react';
import { Button, Checkbox, Divider, Form, IconButton, Message, toaster } from 'rsuite';
import { SchemaModel, StringType } from 'rsuite/Schema';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeCloseIcon from '@rsuite/icons/EyeClose';

const model = SchemaModel({
  username: StringType().isRequired('请输入用户名或邮箱'),
  password: StringType().isRequired('请输入密码').minLength(6, '密码至少 6 位'),
});

const App = () => {
  const [formValue, setFormValue] = useState<any>({ username: '', password: '', remember: true });
  const [formError, setFormError] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toaster.push(
        <Message type="success" showIcon>
          登录成功，欢迎回来！（演示）
        </Message>,
        { placement: 'topCenter' }
      );
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 380, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#1675e0',
            color: '#fff',
            lineHeight: '48px',
            fontSize: 20,
            fontWeight: 600,
            margin: '0 auto 12px',
          }}
        >
          R
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>欢迎回来</div>
        <div style={{ fontSize: 12, color: '#8e8e93', marginTop: 4 }}>登录你的工作台继续使用</div>
      </div>

      <Form
        fluid
        model={model}
        formValue={formValue}
        formError={formError}
        onChange={(v) => setFormValue(v)}
        onCheck={(e) => setFormError(e)}
        onSubmit={handleSubmit}
      >
        <Form.Group controlId="username">
          <Form.Label>账号</Form.Label>
          <Form.Control name="username" placeholder="邮箱或用户名" />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>密码</Form.Label>
          <div style={{ position: 'relative' }}>
            <Form.Control
              name="password"
              type={visible ? 'text' : 'password'}
              placeholder="至少 6 位"
              style={{ paddingRight: 40 }}
              autoComplete="current-password"
            />
            <IconButton
              icon={visible ? <EyeCloseIcon /> : <EyeIcon />}
              appearance="subtle"
              size="sm"
              style={{ position: 'absolute', right: 4, top: 4 }}
              onClick={() => setVisible(!visible)}
              title={visible ? '隐藏密码' : '显示密码'}
            />
          </div>
        </Form.Group>
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Checkbox checked={formValue.remember} onChange={(v) => setFormValue({ ...formValue, remember: Boolean(v) })}>
            记住我
          </Checkbox>
          <Button appearance="link" size="sm">
            忘记密码？
          </Button>
        </div>
        <Button appearance="primary" block loading={loading} type="submit">
          登 录
        </Button>
      </Form>

      <Divider>或</Divider>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button block>微信登录</Button>
        <Button block>GitHub</Button>
      </div>
    </div>
  );
};

export default App;
