import React, { useState } from 'react';
import { Button, Checkbox, Input, Message, Steps, toaster } from 'rsuite';
import CheckIcon from '@rsuite/icons/Check';
import ArrowLeftIcon from '@rsuite/icons/ArrowLeft';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';

const STEP_TITLES = ['基本信息', '收件信息', '确认提交'];

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}) => (
  <div>
    <div style={{ fontSize: 13, marginBottom: 6 }}>{label}</div>
    <Input value={value} onChange={onChange} placeholder={placeholder} />
    {error && <div style={{ fontSize: 12, color: '#f44336', marginTop: 4 }}>{error}</div>}
  </div>
);

const App = () => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = (s: number) => {
    const next: Record<string, string> = {};
    if (s === 0) {
      if (!form.name.trim()) next.name = '请输入收件人姓名';
      if (!/^1\d{10}$/.test(form.phone)) next.phone = '请输入 11 位手机号';
    }
    if (s === 1) {
      if (!form.city.trim()) next.city = '请输入城市';
      if (!form.address.trim()) next.address = '请输入详细地址';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep(step + 1);
  };

  const submit = () => {
    if (!agreed) return;
    setDone(true);
    toaster.push(
      <Message type="success" showIcon>
        提交成功（演示）
      </Message>,
      { placement: 'topCenter' }
    );
  };

  if (done) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#e8f5e9',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckIcon style={{ fontSize: 30, color: '#4caf50' }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 16 }}>提交成功</div>
        <div style={{ color: '#8e8e93', fontSize: 13, marginTop: 8, lineHeight: 1.8 }}>
          {form.name} · {form.phone}
          <br />
          {form.city} {form.address}
        </div>
        <Button
          appearance="primary"
          style={{ marginTop: 24 }}
          onClick={() => {
            setDone(false);
            setStep(0);
            setForm({ name: '', phone: '', city: '', address: '' });
            setAgreed(false);
            setErrors({});
          }}
        >
          再填一份
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Steps current={step} style={{ marginBottom: 28 }}>
        {STEP_TITLES.map((t) => (
          <Steps.Item key={t} title={t} />
        ))}
      </Steps>

      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="收件人" value={form.name} onChange={set('name')} placeholder="请输入姓名" error={errors.name} />
          <Field label="手机号" value={form.phone} onChange={set('phone')} placeholder="11 位手机号" error={errors.phone} />
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="城市" value={form.city} onChange={set('city')} placeholder="如：杭州市" error={errors.city} />
          <Field label="详细地址" value={form.address} onChange={set('address')} placeholder="街道、门牌号" error={errors.address} />
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ background: '#f7f7fa', borderRadius: 8, padding: 16, fontSize: 13, lineHeight: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8e8e93' }}>收件人</span>
              <span>{form.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8e8e93' }}>手机号</span>
              <span>{form.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8e8e93' }}>城市</span>
              <span>{form.city}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8e8e93' }}>详细地址</span>
              <span style={{ maxWidth: 320, textAlign: 'right' }}>{form.address}</span>
            </div>
          </div>
          <Checkbox checked={agreed} onChange={(v) => setAgreed(Boolean(v))} style={{ marginTop: 16 }}>
            我已确认上述信息无误
          </Checkbox>
        </div>
      )}

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={step === 0} onClick={() => setStep(step - 1)} startIcon={<ArrowLeftIcon />}>
          上一步
        </Button>
        {step < 2 ? (
          <Button appearance="primary" onClick={next} endIcon={<ArrowRightIcon />}>
            下一步
          </Button>
        ) : (
          <Button appearance="primary" color="green" disabled={!agreed} onClick={submit}>
            提交信息
          </Button>
        )}
      </div>
    </div>
  );
};

export default App;
