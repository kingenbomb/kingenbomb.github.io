const rawModules = import.meta.glob('../demos/*/*.tsx', { query: '?raw', import: 'default' });
const rawCustom = import.meta.glob('../custom-demos/*/*.tsx', { query: '?raw', import: 'default' });
const rawSnippets = import.meta.glob('../snippets/*/*.txt', { query: '?raw', import: 'default' });

const cache = new Map<string, Promise<string>>();

export function loadCode(pageId: string, file: string): Promise<string> {
  const isSnippet = file.endsWith('.txt');
  const customKey = `../custom-demos/${pageId}/${file}`;
  const key = isSnippet ? `../snippets/${pageId}/${file}` : rawCustom[customKey] ? customKey : `../demos/${pageId}/${file}`;
  const map = isSnippet ? rawSnippets : rawCustom[customKey] ? rawCustom : rawModules;
  const loader = map[key] as (() => Promise<string>) | undefined;
  if (!loader) return Promise.resolve('// source not found');
  if (!cache.has(key)) cache.set(key, loader().catch((e) => `// failed to load source: ${e?.message || e}`));
  return cache.get(key)!;
}
