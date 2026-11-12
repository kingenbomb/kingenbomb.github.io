import React, { useEffect, useRef, useState } from 'react';
import { Button, Loader, Progress } from 'rsuite';

const cardStyle: React.CSSProperties = {
  position: 'relative',
  border: '1px solid #e5e5ea',
  borderRadius: 8,
  padding: 16,
  marginBottom: 14,
  overflow: 'hidden',
};

const titleStyle: React.CSSProperties = { fontSize: 14, fontWeight: 600, marginBottom: 6 };
const descStyle: React.CSSProperties = { fontSize: 12, color: '#8e8e93', marginBottom: 12 };

const App = () => {
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [percent, setPercent] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startProgress = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setPercent(0);
    timerRef.current = window.setInterval(() => {
      setPercent((p) => {
        if (p >= 100) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 100;
        }
        return p + 2;
      });
    }, 120);
  };

  useEffect(() => {
    startProgress();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={cardStyle}>
        <div style={titleStyle}>按钮加载</div>
        <div style={descStyle}>适合提交后短暂等待：按钮本身给出反馈，文案同步变化。</div>
        <Button
          appearance="primary"
          loading={submitting}
          onClick={() => {
            setSubmitting(true);
            window.setTimeout(() => setSubmitting(false), 1800);
          }}
        >
          {submitting ? '提交中…' : '提交订单'}
        </Button>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}>区域刷新遮罩</div>
        <div style={descStyle}>保留原有内容并蒙上一层遮罩，用户知道「数据在刷新，页面没坏」。</div>
        <div style={{ fontSize: 13, color: '#595959', lineHeight: 2.2 }}>
          <div>· 华东区营收 ¥1,204,000（+12.4%）</div>
          <div>· 新增注册用户 3,218（+8.1%）</div>
          <div>· 平均响应时间 240ms（-15%）</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Button
            size="sm"
            onClick={() => {
              setRefreshing(true);
              window.setTimeout(() => setRefreshing(false), 1500);
            }}
          >
            刷新数据
          </Button>
        </div>
        {refreshing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.78)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontSize: 12,
              color: '#8e8e93',
            }}
          >
            <Loader />
            刷新中…
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}>确定性进度</div>
        <div style={descStyle}>任务有明确进度时用进度条，完成后自动切换为成功态。</div>
        <Progress.Line percent={percent} status={percent >= 100 ? 'success' : 'active'} />
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#8e8e93' }}>{percent >= 100 ? '处理完成' : `处理中… ${percent}%`}</span>
          <Button size="sm" onClick={startProgress}>
            重新开始
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
