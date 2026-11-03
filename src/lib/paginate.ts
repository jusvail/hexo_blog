import { config } from '../site.config';

export interface Pagination<T> {
  items: T[];
  current: number;
  total: number;
  /** URL of page 1, such as `/` or `/archives/2018/`. */
  base: string;
}

/** Split items into pages; page 1 lives at `base`, page n at `base + page/n/`. */
export function paginate<T>(items: T[], base: string, perPage = config.site.postsPerPage): Pagination<T>[] {
  const total = Math.max(1, Math.ceil(items.length / perPage));
  return Array.from({ length: total }, (_, i) => ({
    items: items.slice(i * perPage, (i + 1) * perPage),
    current: i + 1,
    total,
    base,
  }));
}

/** Route rest parameter for a page: undefined for page 1, `page/n` after it. */
export const pageParam = (current: number) => (current === 1 ? undefined : `page/${current}`);

export const pageUrl = (base: string, current: number, anchor = '') =>
  current === 1 ? base : `${base}page/${current}/${anchor}`;
