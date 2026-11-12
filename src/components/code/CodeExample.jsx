import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useComponentPropsContext } from '../../hooks/useComponentPropsContext';
import { formatPropValue } from '../../utils/codeGeneration';

/**
 * Injects current prop values into a usage code string.
 * Updates changed props in place, and adds new props that don't exist yet.
 * (Ported verbatim from the official react-bits CodeExample.)
 */
export function injectPropsIntoCode(usageCode, props, defaultProps, componentName, demoOnlyProps = []) {
  if (!usageCode || !props || !componentName) return usageCode;

  const demoOnlySet = new Set(demoOnlyProps);
  const changedProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (demoOnlySet.has(key)) continue;

    if (JSON.stringify(value) !== JSON.stringify(defaultProps[key])) {
      changedProps[key] = value;
    }
  }

  if (Object.keys(changedProps).length === 0) return usageCode;

  let result = usageCode;
  const propsToAdd = [];

  for (const [propName, propValue] of Object.entries(changedProps)) {
    const formattedValue = formatPropValue(propValue, propName);
    const newPropLine =
      typeof propValue === 'boolean' && propValue === true ? propName : `${propName}=${formattedValue}`;

    const simplePropRegex = new RegExp(
      `(^[ \\t]*)(${propName})(?:=(?:"[^"\\n]*"|'[^'\\n]*'|\\{[^{}\\n]*\\}|[^\\s/>]+))?[ \\t]*(\\r?\\n|$)`,
      'gm'
    );

    const hasSimpleMatch = simplePropRegex.test(result);
    simplePropRegex.lastIndex = 0;

    if (hasSimpleMatch) {
      let seen = false;
      result = result.replace(simplePropRegex, (_, indent, __, lineEnding) => {
        if (seen) return '';
        seen = true;
        return `${indent}${newPropLine}${lineEnding}`;
      });
      continue;
    }

    const multiLineStart = new RegExp(`^([ \\t]*)(${propName})=\\{`, 'gm');
    let match;
    let updated = false;

    while ((match = multiLineStart.exec(result)) !== null) {
      const indent = match[1];
      const startIndex = match.index;
      const openBraceIndex = match.index + match[0].length - 1;

      let braceCount = 1;
      let i = openBraceIndex + 1;
      while (i < result.length && braceCount > 0) {
        if (result[i] === '{') braceCount++;
        else if (result[i] === '}') braceCount--;
        i++;
      }

      if (braceCount === 0) {
        const before = result.slice(0, startIndex);
        const after = result.slice(i);
        result = before + indent + newPropLine + after;
        updated = true;
        break;
      }
    }

    if (!updated) {
      propsToAdd.push(newPropLine);
    }
  }

  if (propsToAdd.length > 0) {
    const indentMatch = result.match(/\n([ \t]+)\w/);
    const indent = indentMatch ? indentMatch[1] : '  ';

    const newPropsStr = propsToAdd.map(p => `${indent}${p}`).join('\n');

    const closingIndex = result.lastIndexOf('/>');
    if (closingIndex !== -1) {
      const before = result.slice(0, closingIndex);
      const after = result.slice(closingIndex);
      result = before.trimEnd() + '\n' + newPropsStr + '\n' + after.trim();
    }
  }

  return result;
}

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="codex-copy" onClick={copy} aria-label={copied ? 'Copied' : label}>
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
};

const CodeBlock = ({ text }) => (
  <pre className="codex-block">
    <code>{text}</code>
  </pre>
);

const Snippet = ({ title, note, text, actions, children }) => (
  <section className="codex-snippet">
    <div className="codex-snippet-head">
      <div className="codex-snippet-title">
        <h3>{title}</h3>
        {note ? <span className="codex-note">{note}</span> : null}
      </div>
      <div className="codex-snippet-actions">
        {actions}
        <CopyButton text={text} />
      </div>
    </div>
    {children ?? <CodeBlock text={text} />}
  </section>
);

const InstallNote = ({ dependencies }) => {
  const command = `npm install ${dependencies}`;
  return (
    <div className="codex-install">
      <code title={command}>{command}</code>
      <CopyButton text={command} label="Copy" />
    </div>
  );
};

const CodeExample = ({ codeObject, componentName }) => {
  const { tailwind, css, tsTailwind, tsCode, code, usage, dependencies } = codeObject;
  const { props, hasChanges, demoOnlyProps, computedProps } = useComponentPropsContext();

  const dynamicUsage = useMemo(() => {
    if (!usage || !componentName || !props || Object.keys(props).length === 0) return usage;

    const mergedProps = { ...props, ...computedProps };
    return injectPropsIntoCode(usage, mergedProps, {}, componentName, demoOnlyProps);
  }, [usage, props, computedProps, componentName, demoOnlyProps]);

  const variants = useMemo(
    () =>
      [
        tailwind && { id: 'tw', label: 'Tailwind', text: tailwind, css: null },
        code && { id: 'js', label: 'JS', text: code, css },
        tsTailwind && { id: 'tw-ts', label: 'Tailwind · TS', text: tsTailwind, css: null },
        tsCode && { id: 'js-ts', label: 'TS', text: tsCode, css }
      ].filter(Boolean),
    [tailwind, code, tsTailwind, tsCode, css]
  );

  const [activeVariant, setActiveVariant] = useState(() => variants[0]?.id);
  const current = variants.find(variant => variant.id === activeVariant) ?? variants[0];

  return (
    <div className="codex">
      {dependencies ? <InstallNote dependencies={dependencies} /> : null}

      {dynamicUsage ? (
        <Snippet title="Usage" note={hasChanges ? 'With your settings' : null} text={dynamicUsage} />
      ) : null}

      {current ? (
        <Snippet
          title="Component"
          text={current.text}
          actions={
            variants.length > 1 ? (
              <div className="codex-tabs" role="tablist" aria-label="Code variants">
                {variants.map(variant => (
                  <button
                    key={variant.id}
                    type="button"
                    role="tab"
                    aria-selected={variant.id === current.id}
                    className={`codex-tab${variant.id === current.id ? ' is-active' : ''}`}
                    onClick={() => setActiveVariant(variant.id)}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            ) : null
          }
        />
      ) : null}

      {current?.css ? <Snippet title="CSS" text={current.css} /> : null}
    </div>
  );
};

export default CodeExample;
