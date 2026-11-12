import React, { forwardRef } from 'react';

type SummaryItem = {
  name?: string;
  label?: React.ReactNode;
  controlId?: string;
  message?: React.ReactNode;
};

const ErrorSummaryCompat = forwardRef<HTMLDivElement, { header?: React.ReactNode; items?: SummaryItem[] }>(
  ({ header, items = [] }, ref) => {
    if (!items.length) return null;
    return (
      <div
        ref={ref}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className="rs-form-error-summary"
        style={{
          marginBottom: 16,
          padding: '12px 16px',
          border: '1px solid #f5c2c0',
          borderRadius: 6,
          background: '#fff2f0',
          color: '#c9181f',
          outline: 'none',
        }}
      >
        {header && <div style={{ fontWeight: 600, marginBottom: 8 }}>{header}</div>}
        <ul style={{ margin: 0, paddingInlineStart: 20 }}>
          {items.map((item, index) => (
            <li key={item.name || index}>
              {item.controlId ? (
                <a
                  href={`#${item.controlId}`}
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(item.controlId!);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    (el as HTMLInputElement | null)?.focus?.();
                  }}
                >
                  {item.label}
                </a>
              ) : (
                item.label
              )}
              {item.message ? <span>{`: ${String(item.message)}`}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

ErrorSummaryCompat.displayName = 'ErrorSummaryCompat';

export default ErrorSummaryCompat;
