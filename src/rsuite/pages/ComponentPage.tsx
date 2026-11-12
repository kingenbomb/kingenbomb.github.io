import React from 'react';
import { byId, categories, isCustomPage } from '../lib/registry';
import DemoSection from '../components/shell/DemoSection';

const NotFound = ({ id }: { id: string }) => (
  <div className="py-24 text-center">
    <div className="text-lg font-semibold text-[#1c1f23]">页面不存在</div>
    <div className="mt-2 font-mono text-sm text-gray-400">{id}</div>
    <a
      href="#/rsuite"
      className="mt-6 inline-block rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
    >
      返回首页
    </a>
  </div>
);

const ComponentPage = ({ id }: { id: string }) => {
  const page = byId[id];
  if (!page) return <NotFound id={id} />;
  const cat = categories.find((c) => c.pages.some((p) => p.id === id));
  const first = page.components[0] || page.name.replace(/\s+/g, '');

  return (
    <main data-page-id={page.id} className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-6 text-[13px] text-gray-400">
        <a href="#/rsuite" className="transition-colors hover:text-gray-700">
          Components
        </a>
        <span className="mx-1.5 text-gray-300">/</span>
        <span>{cat?.title}</span>
        <span className="mx-1.5 text-gray-300">/</span>
        <span className="text-gray-700">{page.title}</span>
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1c1f23]">
            {page.title} <span className="ml-2 align-middle text-base font-normal text-gray-400">{page.name}</span>
          </h1>
          {page.description && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-500">{page.description}</p>}
        </div>
        {isCustomPage(page.id) ? (
          <span className="rounded-lg border border-green-200 bg-green-50 px-3.5 py-1.5 text-xs text-green-700">
            自制扩展效果
          </span>
        ) : (
          <a
            href={`https://www.rsuitejs.com/zh/components/${page.id}/`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-xs text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
          >
            查看原站 ↗
          </a>
        )}
      </div>

      {page.demos.map((d) => (
        <DemoSection key={d.id} pageId={page.id} demo={d} />
      ))}

      {!page.hasDemos && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          该页面在官方文档中暂无示例代码（纯说明页），可前往原站查看。
        </div>
      )}

      <section className="mt-14">
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-[#1c1f23]">Installation</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-500">terminal</div>
          <pre className="p-4 text-[12px] text-gray-800">
            <code>{`npm install rsuite @rsuite/icons`}</code>
          </pre>
          <div className="border-y border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-500">usage</div>
          <pre className="p-4 text-[12px] text-gray-800">
            <code>{`import { ${first} } from 'rsuite';`}</code>
          </pre>
        </div>
      </section>
    </main>
  );
};

export default ComponentPage;
