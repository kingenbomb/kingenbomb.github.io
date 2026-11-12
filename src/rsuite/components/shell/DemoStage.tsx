import React, { Suspense, useEffect, useState } from 'react';
import { loadDemo } from '../../lib/demos';
import { DemoErrorBoundary } from './DemoErrorBoundary';

type Status = 'loading' | 'ok' | 'error' | 'missing' | 'render-error';

const DemoStage = ({ pageId, demoId, file }: { pageId: string; demoId: string; file: string }) => {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    setComp(null);
    setStatus('loading');
    setErr('');
    loadDemo(pageId, file)
      .then((mod) => {
        if (cancelled) return;
        const candidate = (mod.default || mod.App) as React.ComponentType | undefined;
        if (!candidate) {
          setErr(`no default export in ${file}`);
          setStatus('error');
          return;
        }
        setComp(() => candidate);
        setStatus('ok');
      })
      .catch((e) => {
        if (cancelled) return;
        setErr(String(e?.message || e));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [pageId, file]);

  return (
    <div
      data-demo-status={status}
      data-demo-id={`${pageId}/${demoId}`}
      className="demo-stage w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="w-full overflow-x-auto p-6">
        {status === 'error' && (
          <div className="max-w-xl rounded-lg border border-red-400 bg-red-50 p-4 text-sm text-red-700" data-demo-error>
            <div className="mb-1 font-semibold">DEMO ERROR</div>
            <div className="break-all font-mono text-xs opacity-80">{err}</div>
          </div>
        )}
        {status === 'loading' && <div className="text-sm text-neutral-400">Loading…</div>}
        {Comp && (
          <DemoErrorBoundary key={`${pageId}/${demoId}`} onError={(m) => { setStatus('render-error'); setErr(m); }}>
            <Suspense fallback={<div className="text-sm text-neutral-400">Loading…</div>}>
              <Comp />
            </Suspense>
          </DemoErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default DemoStage;
