import { useCallback, useState } from 'react';

const STORAGE_KEY = 'rb-package-manager';
const VALID = ['npm', 'pnpm', 'yarn', 'bun'];

/**
 * Lightweight stand-in for the official installation-preference hook.
 * Defaults to npm; the choice is remembered locally.
 */
export function useInstallation() {
  const [packageManager, setPackageManagerState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return VALID.includes(stored) ? stored : 'npm';
    } catch {
      return 'npm';
    }
  });

  const setPackageManager = useCallback(value => {
    if (!VALID.includes(value)) return;
    setPackageManagerState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  return { packageManager, setPackageManager };
}

export default useInstallation;
