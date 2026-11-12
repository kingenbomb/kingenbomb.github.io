import React, { useMemo, useState } from 'react';
import { categories } from '../../lib/registry';

const Sidebar = ({ activeId }: { activeId?: string }) => {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return null;
    const out: { pageId: string; title: string; name: string; cat: string }[] = [];
    for (const c of categories) {
      for (const p of c.pages) {
        if (p.id.includes(q) || p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)) {
          out.push({ pageId: p.id, title: p.title, name: p.name, cat: c.title });
        }
      }
    }
    return out;
  }, [q]);

  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索组件…"
          className="w-full rounded-lg border border-transparent bg-gray-100 px-3 py-1.5 text-[13px] text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-blue-300 focus:bg-white"
        />
      </div>
      <nav className="flex-1 overflow-y-auto p-3 pb-16">
        {filtered ? (
          <ul className="space-y-0.5">
            {filtered.map((p) => (
              <li key={p.pageId}>
                <a
                  href={`#/rsuite/components/${p.pageId}`}
                  className={`block rounded-md px-2 py-1.5 text-[13px] transition-colors ${
                    p.pageId === activeId
                      ? 'bg-blue-50 font-medium text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {p.title}
                  <span className="ml-2 text-[10px] text-gray-400">{p.cat}</span>
                </a>
              </li>
            ))}
            {!filtered.length && <li className="px-2 py-2 text-xs text-gray-400">无结果</li>}
          </ul>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="mb-4">
              <div className="mb-1 flex items-baseline justify-between px-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{c.title}</span>
                <span className="text-[10px] text-gray-300">{c.name}</span>
              </div>
              <ul className="space-y-0.5">
                {c.pages.map((p) => (
                  <li key={p.id}>
                    <a
                      href={`#/rsuite/components/${p.id}`}
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] transition-colors ${
                        p.id === activeId
                          ? 'bg-blue-50 font-medium text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span>{p.title}</span>
                      <span className={`text-[10px] ${p.id === activeId ? 'text-blue-300' : 'text-gray-300'}`}>
                        {p.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
