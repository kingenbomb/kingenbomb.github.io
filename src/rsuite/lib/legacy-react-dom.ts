import type React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createPortal } from 'react-dom';

const roots = new WeakMap<Element, Root>();

const ReactDOM = {
  render(element: React.ReactNode, container: Element | DocumentFragment | null) {
    if (!container) return;
    let root = roots.get(container as Element);
    if (!root) {
      root = createRoot(container as Element);
      roots.set(container as Element, root);
    }
    root.render(element as React.ReactElement);
  },
  unmountComponentAtNode(container: Element) {
    const root = roots.get(container);
    if (root) {
      root.unmount();
      roots.delete(container);
      return true;
    }
    return false;
  },
  createPortal,
};

export default ReactDOM;
