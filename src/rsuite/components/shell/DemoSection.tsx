import React, { useEffect, useState } from 'react';
import type { DemoMeta } from '../../generated/registry';
import { loadCode } from '../../lib/code';
import DemoStage from './DemoStage';

const DemoSection = ({ pageId, demo }: { pageId: string; demo: DemoMeta }) => {
  const [showCode, setShowCode] = useState(Boolean(demo.codeOnly));
  const [source, setSource] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (showCode && source === null) {
      loadCode(pageId, demo.file).then(setSource);
    }
  }, [showCode, source, pageId, demo.file]);

  const copy = async () => {
    const src = source ?? (await loadCode(pageId, demo.file));
    setSource(src);
    try {
      await navigator.clipboard.writeText(src);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section
      className="mb-12"
      data-demo-section={demo.id}
      data-demo-id={demo.codeOnly ? `${pageId}/${demo.id}` : undefined}
      data-demo-status={demo.codeOnly ? 'code-only' : undefined}
    >
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-[15px] font-semibold text-gray-900">{demo.title}</h3>
        <span className="font-mono text-[11px] text-gray-400">{demo.file}</span>
        {demo.codeOnly && (
          <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
            code snippet
          </span>
        )}
      </div>
      {demo.description && <p className="mb-3 max-w-3xl text-sm leading-relaxed text-gray-500">{demo.description}</p>}
      {!demo.codeOnly && <DemoStage pageId={pageId} demoId={demo.id} file={demo.file} />}
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setShowCode((v) => !v)}
          className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
        >
          {showCode ? '隐藏代码' : '显示代码'}
        </button>
        {showCode && (
          <button
            onClick={copy}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      {showCode && (
        <div className="demo-code-wrap mt-2 overflow-auto rounded-xl border border-gray-200 bg-[#0d0d0d]">
          <pre className="demo-code p-4 text-[12px] leading-relaxed text-neutral-300">
            <code>{source ?? '// loading...'}</code>
          </pre>
        </div>
      )}
    </section>
  );
};

export default DemoSection;
