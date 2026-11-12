import { categories as generatedCategories } from '../generated/registry';
import type { CategoryMeta, PageMeta } from '../generated/registry';
import { customCategories } from '../custom/registry';

export const categories: CategoryMeta[] = [...generatedCategories, ...customCategories];
export const pages: PageMeta[] = categories.flatMap((c) => c.pages);
export const byId = Object.fromEntries(pages.map((p) => [p.id, p])) as Record<string, PageMeta>;

export function isCustomPage(id: string) {
  return id.startsWith('effects-');
}
