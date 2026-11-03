import { defineConfig } from 'astro/config';
import { config } from './src/site.config.ts';

export default defineConfig({
  site: config.site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
