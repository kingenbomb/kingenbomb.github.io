/** Renders the block lists produced by the doc/site extractors. */
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function resolveHref(href) {
  if (!href) return null;
  if (href.startsWith('/docs/')) return { to: href.replace('/docs/', '/pro/docs/'), external: false };
  if (href === '/#pricing' || href === '/pricing') return { to: '/pro/pricing', external: false };
  if (href.startsWith('/')) return { to: `https://pro.reactbits.dev${href}`, external: true };
  return { to: href, external: true };
}

export function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border bg-[#0a0a0a]">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 z-10 rounded-md border border-border/70 bg-background/90 px-2 py-1 text-[11px] text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
}

export default function Blocks({ blocks, numbered = true }) {
  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`;
    switch (block.type) {
      case 'stat':
        return (
          <div
            key={key}
            className="mb-3 inline-flex w-full flex-col rounded-xl border bg-muted/30 p-4 sm:mr-3 sm:w-auto sm:min-w-[160px]"
          >
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{block.value}</span>
            <span className="mt-0.5 text-xs text-muted-foreground">{block.label}</span>
          </div>
        );
      case 'h2':
        return (
          <h2 key={key} className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight">
            {block.text}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={key} className="mt-6 mb-2 text-base font-semibold tracking-tight">
            {block.text}
          </h3>
        );
      case 'step':
        return (
          <div key={key} className="mt-6 mb-2 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full border border-border/70 bg-muted/50 text-[11px] font-medium tabular-nums">
              {index}
            </span>
            <span className="text-base font-semibold tracking-tight">{block.label}</span>
          </div>
        );
      case 'list':
        return (
          <ul key={key} className="my-3 space-y-2">
            {block.items.map(item => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      case 'code':
        return <CodeBlock key={key} code={block.text} />;
      case 'table':
        return (
          <div key={key} className="my-4 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b last:border-0">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-3 py-2 ${rowIndex === 0 ? 'font-medium' : 'text-muted-foreground'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default: {
        const link = resolveHref(block.href);
        return (
          <p key={key} className="my-3 text-sm leading-relaxed text-muted-foreground">
            {block.text}
            {link ? (
              link.external ? (
                <a
                  href={link.to}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 text-foreground underline decoration-border underline-offset-4"
                  title="Opens pro.reactbits.dev"
                >
                  ↗
                </a>
              ) : (
                <Link to={link.to} className="ml-1 text-foreground underline decoration-border underline-offset-4">
                  →
                </Link>
              )
            ) : null}
          </p>
        );
      }
    }
  });
}
