import { RefreshCw } from 'lucide-react';

const RefreshButton = ({ onClick }) => (
  <button type="button" className="docs-refresh" onClick={onClick} aria-label="Refresh animation">
    <RefreshCw size={16} strokeWidth={1.6} aria-hidden="true" />
  </button>
);

export default RefreshButton;
