import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

const resolveFromRoot = path => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: {
    alias: [
      { find: /^next\/image$/, replacement: resolveFromRoot('./src/rsuite/shims/next-image.tsx') },
      { find: /^next\/link$/, replacement: resolveFromRoot('./src/rsuite/shims/next-link.tsx') },
      { find: /^next\/dynamic$/, replacement: resolveFromRoot('./src/rsuite/shims/next-dynamic.tsx') },
      { find: /^@\//, replacement: resolveFromRoot('./src/rsuite') + '/' },
      { find: '@content', replacement: resolveFromRoot('./src/content') },
      { find: '@tailwind', replacement: resolveFromRoot('./src/tailwind') },
      { find: '@ts-default', replacement: resolveFromRoot('./src/ts-default') },
      { find: '@ts-tailwind', replacement: resolveFromRoot('./src/ts-tailwind') }
    ]
  },
  build: {
    chunkSizeWarningLimit: 8000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      }
    }
  }
});
