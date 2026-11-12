const modules = import.meta.glob('../demos/*/*.tsx');
const customModules = import.meta.glob('../custom-demos/*/*.tsx');

function findLoader(pageId: string, file: string) {
  const customKey = `../custom-demos/${pageId}/${file}`;
  if (customModules[customKey]) return customModules[customKey];
  return modules[`../demos/${pageId}/${file}`];
}

export function loadDemo(pageId: string, file: string) {
  const loader = findLoader(pageId, file);
  if (!loader) return Promise.reject(new Error(`demo module not found: ${pageId}/${file}`));
  return loader() as Promise<Record<string, unknown>>;
}

export function hasDemoModule(pageId: string, file: string) {
  return Boolean(findLoader(pageId, file));
}
