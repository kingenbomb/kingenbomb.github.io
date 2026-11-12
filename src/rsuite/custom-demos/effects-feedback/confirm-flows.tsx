import React, { useState } from 'react';
import { Button, Input, Message, Modal, Popover, Whisper, toaster } from 'rsuite';

const toast = (text: string) =>
  toaster.push(
    <Message type="success" showIcon>
      {text}
    </Message>,
    { placement: 'topCenter' }
  );

const cardStyle: React.CSSProperties = {
  border: '1px solid #e5e5ea',
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
};

const App = () => {
  const [dangerOpen, setDangerOpen] = useState(false);
  const [dangerText, setDangerText] = useState('');
  const [comments, setComments] = useState(['这里的文案建议再收敛一点', '组件间距统一成 16px 吧', '移动端记得补一下适配']);
  const [popIndex, setPopIndex] = useState<number | null>(null);

  const normalConfirm = () =>
    Modal.confirm({
      title: '删除项目',
      children: '删除后项目成员将无法访问该仓库，确定继续吗？',
      onOk: () => toast('项目已删除'),
    });

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={cardStyle}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>常规确认</div>
        <div style={{ fontSize: 12, color: '#8e8e93', marginBottom: 12 }}>
          影响可控、可恢复的操作，一次确认即可（Modal.confirm）。
        </div>
        <Button color="red" appearance="primary" onClick={normalConfirm}>
          删除项目
        </Button>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>危险操作强确认</div>
        <div style={{ fontSize: 12, color: '#8e8e93', marginBottom: 12 }}>
          不可恢复的批量操作，要求手动输入 DELETE 才可提交。
        </div>
        <Button color="red" onClick={() => setDangerOpen(true)}>
          清空所有数据
        </Button>
        <Modal open={dangerOpen} onClose={() => setDangerOpen(false)} size="sm">
          <Modal.Header>
            <Modal.Title>清空所有数据</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              此操作将清空全部 <b>1,024</b> 条业务数据，且<b>不可恢复</b>。请输入 <b>DELETE</b> 以确认。
            </p>
            <Input
              value={dangerText}
              onChange={setDangerText}
              placeholder="输入 DELETE 确认"
              style={{ marginTop: 12 }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button appearance="subtle" onClick={() => setDangerOpen(false)}>
              取消
            </Button>
            <Button
              color="red"
              appearance="primary"
              disabled={dangerText.trim().toUpperCase() !== 'DELETE'}
              onClick={() => {
                setDangerOpen(false);
                setDangerText('');
                toast('已清空全部数据（演示）');
              }}
            >
              确认清空
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>行内轻确认</div>
        <div style={{ fontSize: 12, color: '#8e8e93', marginBottom: 8 }}>
          低风险操作不用弹窗打断，Popover 就地确认即可。
        </div>
        {comments.map((c, i) => (
          <div
            key={c}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderTop: '1px solid #f2f2f7',
            }}
          >
            <span style={{ fontSize: 13 }}>{c}</span>
            <Whisper
              placement="left"
              trigger="click"
              open={popIndex === i}
              onOpenChange={(open) => setPopIndex(open ? i : null)}
              speaker={
                <Popover title="删除这条评论？">
                  <div style={{ padding: '8px 4px', display: 'flex', gap: 8 }}>
                    <Button
                      size="xs"
                      color="red"
                      appearance="primary"
                      onClick={() => {
                        setComments((cs) => cs.filter((_, idx) => idx !== i));
                        setPopIndex(null);
                        toast('评论已删除');
                      }}
                    >
                      删除
                    </Button>
                    <Button size="xs" appearance="subtle" onClick={() => setPopIndex(null)}>
                      取消
                    </Button>
                  </div>
                </Popover>
              }
            >
              <Button size="xs" appearance="link" color="red">
                删除
              </Button>
            </Whisper>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ fontSize: 12, color: '#b0b0b5', padding: '16px 0', textAlign: 'center' }}>评论都删完了</div>
        )}
      </div>
    </div>
  );
};

export default App;
