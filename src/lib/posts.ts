import { getCollection, getEntry } from 'astro:content';
import { config } from '../site.config';
import { renderMarkdown, wordCount } from './markdown';
import { slugize, stripHTML } from './text';

export interface Post {
  id: string;
  title: string;
  date: Date;
  updated: Date;
  url: string;
  html: string;
  excerpt: string;
  words: number;
  categories: Term[];
  tags: Term[];
}

export interface Term {
  name: string;
  url: string;
}

export interface TermGroup extends Term {
  posts: Post[];
}

export const categoryUrl = (name: string) => `/categories/${slugize(name)}/`;
export const tagUrl = (name: string) => `/tags/${slugize(name)}/`;

let cache: Promise<Post[]> | undefined;

/** All posts, newest first. */
export function getPosts(): Promise<Post[]> {
  cache ??= getCollection('posts').then((entries) =>
    entries
      .map((entry) => {
        const { html, excerpt } = renderMarkdown(entry.body ?? '');
        const { title, date, updated, categories, tags } = entry.data;
        return {
          id: entry.id,
          title,
          date,
          updated: updated ?? date,
          url: `/blog/${entry.id}/`,
          html,
          excerpt,
          words: wordCount(html),
          categories: categories.map((name) => ({ name, url: categoryUrl(name) })),
          tags: tags.map((name) => ({ name, url: tagUrl(name) })),
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
  );
  return cache;
}

function groupBy(posts: Post[], terms: (post: Post) => Term[]): TermGroup[] {
  const groups = new Map<string, TermGroup>();
  for (const post of posts) {
    for (const term of terms(post)) {
      const group = groups.get(term.name) ?? { ...term, posts: [] };
      group.posts.push(post);
      groups.set(term.name, group);
    }
  }
  return [...groups.values()];
}

export const getCategories = async () => groupBy(await getPosts(), (post) => post.categories);
export const getTags = async () => groupBy(await getPosts(), (post) => post.tags);

export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing page src/content/pages/${id}.md`);
  const { html } = renderMarkdown(entry.body ?? '');
  return { ...entry.data, html };
}

/** 1234 → 1.2k, as the theme abbreviated counts. */
export function shortCount(count: number): string {
  if (count > 9999) return `${Math.round(count / 1000)}k`;
  if (count > 999) return `${Math.round(count / 100) / 10}k`;
  return String(count);
}

export function minutesToRead(words: number): number {
  const { awl, wpm } = config.post.meta.min2read;
  return Math.floor(words / (awl * wpm)) + 1;
}

/** The first characters of the text, on one line. */
export function summary(html: string, length = 200): string {
  return stripHTML(html)
    .substring(0, length)
    .trim()
    .replace(/\n/g, ' ');
}
