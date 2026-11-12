import React, { useLayoutEffect, useRef, useState } from 'react';
import { Tabs } from '@chakra-ui/react';
import { Code as CodeIcon, Eye } from 'lucide-react';
import CustomizeActionsContext from './Preview/CustomizeContext';
import { useComponentPropsContext } from '../../hooks/useComponentPropsContext';

/**
 * Simplified port of the official TabsLayout (react-bits).
 * Keeps the Preview / Code tab contract used by every demo:
 *   <TabsLayout>
 *     <PreviewTab>…live demo, Customize panel, PropTable, Dependencies…</PreviewTab>
 *     <CodeTab><CodeExample …/></CodeTab>
 *   </TabsLayout>
 */

const usePill = (trackRef, selection) => {
  const [pill, setPill] = useState(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const measure = () => {
      const active = track.querySelector('[aria-selected="true"], [aria-pressed="true"]');
      setPill(previous => {
        if (!active) return previous ? { ...previous, hidden: true } : null;
        const next = { x: active.offsetLeft, width: active.offsetWidth, hidden: false, ready: Boolean(previous) };
        const same = previous && previous.x === next.x && previous.width === next.width && !previous.hidden;
        return same ? previous : next;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef, selection]);

  return pill;
};

const Pill = ({ pill }) => (
  <span
    className="docs-pill"
    aria-hidden="true"
    data-ready={pill?.ready ? '' : undefined}
    style={
      pill ? { width: pill.width, transform: `translateX(${pill.x}px)`, opacity: pill.hidden ? 0 : 1 } : { opacity: 0 }
    }
  />
);

const TabIcon = ({ icon: Icon }) => <Icon size={16} strokeWidth={1.6} aria-hidden="true" />;

const TabsLayout = ({ children, className }) => {
  const { hasChanges, resetProps } = useComponentPropsContext();
  const [activeTab, setActiveTab] = useState('preview');
  const tabsTrackRef = useRef(null);
  const tabsPill = usePill(tabsTrackRef, activeTab);

  const contentMap = { PreviewTab: null, CodeTab: null };
  React.Children.forEach(children, child => {
    if (!child) return;
    if (child.type === PreviewTab) contentMap.PreviewTab = child;
    if (child.type === CodeTab) contentMap.CodeTab = child;
  });

  return (
    <Tabs.Root
      w="100%"
      variant="plain"
      lazyMount
      value={activeTab}
      onValueChange={({ value }) => setActiveTab(value)}
      className={className}
    >
      <Tabs.List className="docs-toolbar">
        <div className="docs-track docs-tabs" ref={tabsTrackRef} data-pill="">
          <Pill pill={tabsPill} />
          <Tabs.Trigger value="preview" className="docs-segment">
            <TabIcon icon={Eye} />
            Preview
          </Tabs.Trigger>
          <Tabs.Trigger value="code" className="docs-segment">
            <TabIcon icon={CodeIcon} />
            Code
          </Tabs.Trigger>
        </div>
      </Tabs.List>

      <Tabs.Content pt={0} value="preview" className="preview-panel">
        <CustomizeActionsContext.Provider value={{ openStudio: null, reset: resetProps, canReset: hasChanges }}>
          {contentMap.PreviewTab}
        </CustomizeActionsContext.Provider>
      </Tabs.Content>

      <Tabs.Content pt={0} value="code">
        {contentMap.CodeTab}
      </Tabs.Content>
    </Tabs.Root>
  );
};

export const PreviewTab = ({ children }) => <>{children}</>;
export const CodeTab = ({ children }) => <>{children}</>;

export { TabsLayout };
export default TabsLayout;
