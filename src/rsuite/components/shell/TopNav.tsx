import React from 'react';

const TopNav = ({ activeId }: { activeId?: string }) => {
  const isHome = !activeId;
  const isEffects = Boolean(activeId && activeId.startsWith('effects-'));

  const link = (active: boolean) =>
    `rounded-md p-2 text-sm transition-colors ${
      active ? 'font-medium text-[#1c1f23]' : 'text-gray-600 hover:text-blue-600'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/92 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-6">
        <a href="#/rsuite" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[#1c1f23] text-[12px] font-bold text-white">
            R
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[#1c1f23]">React Suite Clone</span>
        </a>
        <nav className="ml-4 flex items-center gap-1">
          <a href="#/rsuite" className={link(isHome)}>
            首页
          </a>
          <a href="#/rsuite/components/effects-forms" className={link(isEffects)}>
            常用效果
          </a>
          <a
            href="https://www.rsuitejs.com/zh/components/overview/"
            target="_blank"
            rel="noreferrer"
            className={link(false)}
          >
            官方文档 ↗
          </a>
          <a href="https://github.com/rsuite/rsuite" target="_blank" rel="noreferrer" className={link(false)}>
            GitHub ↗
          </a>
          <span className="mx-1 h-4 w-px bg-gray-200" />
          <a
            href="#/"
            className="rounded-md p-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            React Bits 动画
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <a
            href="#/rsuite/components/button"
            className="rounded-md bg-[#1c1f23] px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#2e3238]"
          >
            从 Button 开始 →
          </a>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
