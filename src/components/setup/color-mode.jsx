/* eslint-disable react-refresh/only-export-components */
import { Moon } from 'lucide-react';

/**
 * Dark-fixed stand-in for the official next-themes based color mode module.
 * Exposes the exact same API surface used by the demos and kit components.
 */
export function ColorModeProvider({ children }) {
  return children;
}

export function useColorMode() {
  return {
    theme: 'dark',
    resolvedTheme: 'dark',
    colorMode: 'dark',
    setColorMode: () => {},
    toggleColorMode: () => {}
  };
}

export function useColorModeValue(light, dark) {
  return dark;
}

export function ColorModeIcon() {
  return <Moon />;
}
