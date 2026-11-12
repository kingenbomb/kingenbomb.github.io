import React from 'react';

type Props = { children: React.ReactNode; onError?: (message: string) => void };
type State = { error: Error | null };

export class DemoErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(String(error?.message || error));
  }

  render() {
    if (this.state.error) {
      return (
        <div data-demo-error className="flex w-full items-center justify-center p-10">
          <div className="max-w-xl rounded-lg border border-red-400 bg-red-50 p-4 text-sm text-red-700">
            <div className="mb-1 font-semibold">DEMO ERROR</div>
            <div className="break-all font-mono text-xs opacity-80">{String(this.state.error?.message || this.state.error)}</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
