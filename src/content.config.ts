import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parseSiteDate } from './lib/date';

const siteDate = z.union([z.string(), z.date()]).transform(parseSiteDate);

// Ids keep the path under the folder, dots included: older/journal.2022.8.19 → /blog/older/journal.2022.8.19/
const idFromPath = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts', generateId: idFromPath }),
  schema: z.object({
    title: z.string(),
    date: siteDate,
    updated: siteDate.optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages', generateId: idFromPath }),
  schema: z.object({
    title: z.string(),
    date: siteDate.optional(),
    updated: siteDate.optional(),
  }),
});

export const collections = { posts, pages };
