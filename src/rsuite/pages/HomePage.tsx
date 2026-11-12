import React, { useState } from 'react';
import { categories, pages } from '../lib/registry';

const INSTALL = 'npm install rsuite @rsuite/icons';

const InstallCommand = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(INSTALL);
      ok = true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = INSTALL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="mt-10 flex max-w-2xl flex-wrap items-center gap-x-4 gap-y-2">
      <span className="text-sm text-gray-500">安装命令</span>
      <button
        onClick={copy}
        title="点击复制"
        className="group flex min-w-0 flex-1 items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-left transition-colors hover:border-gray-300"
      >
        <code className="truncate font-mono text-[13px] text-gray-800">{INSTALL}</code>
        <span className={`flex-shrink-0 text-xs ${copied ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
          {copied ? '已复制' : '复制'}
        </span>
      </button>
    </div>
  );
};

const HomePage = () => {
  const totalDemos = pages.reduce((n, p) => n + p.demos.length, 0);
  return (
    <main className="mx-auto max-w-6xl px-8 py-14">
      <section className="mb-14">
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.15] tracking-tight text-[#1c1f23] md:text-6xl">
          React Suite 全组件复刻，
          <br />
          加一打常用功能效果
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-gray-500">
          rsuite v6 官方文档全部组件与示例的可浏览复刻，直接基于官方 npm 包渲染真实组件； 另附 20
          个自制「常用效果」——登录、分步向导、远程表格、命令面板等高频页面模式，全部由真实 rsuite 组件组合实现。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#/rsuite/components/button"
            className="rounded-lg bg-[#1c1f23] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2e3238]"
          >
            开始浏览 →
          </a>
          <a
            href="https://www.rsuitejs.com/zh/components/overview/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
          >
            官方文档 ↗
          </a>
        </div>
        <InstallCommand />
      </section>

      <section className="mb-12 flex flex-wrap gap-x-12 gap-y-5 border-y border-gray-200 py-7">
        <div>
          <div className="text-2xl font-semibold text-[#1c1f23]">{pages.length}</div>
          <div className="mt-1 text-xs text-gray-500">总页面</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-[#1c1f23]">{totalDemos}</div>
          <div className="mt-1 text-xs text-gray-500">交互示例（含 20 个自制效果）</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-[#1c1f23]">{categories.length}</div>
          <div className="mt-1 text-xs text-gray-500">分类</div>
        </div>
      </section>

      <section>
        <div className="mb-5 text-sm font-semibold text-[#1c1f23]">分类总览</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300"
            >
              <div className="mb-0.5 text-sm font-semibold text-[#1c1f23]">{c.title}</div>
              <div className="mb-3 font-mono text-[11px] text-gray-400">
                {c.name} · {c.pages.length}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.pages.slice(0, 8).map((p) => (
                  <a
                    key={p.id}
                    href={`#/rsuite/components/${p.id}`}
                    className="rounded-md bg-gray-100 px-2 py-0.5 text-[12px] text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    {p.title}
                  </a>
                ))}
                {c.pages.length > 8 && <span className="px-1 py-0.5 text-[12px] text-gray-400">+{c.pages.length - 8}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
