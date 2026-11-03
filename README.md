## hling.org

Personal blog built with [Astro](https://astro.build), using the look of the
[Fluid](https://github.com/fluid-dev/hexo-theme-fluid) Hexo theme.

### Write

- Posts: `src/content/posts/<folder>/<name>.md`, served at `/blog/<folder>/<name>/`.
  Front-matter: `title`, `date` (`2024/3/14 22:53:25`, Asia/Tokyo), optional `updated`, `categories`, `tags`.
  Put `<!-- more -->` after the excerpt. Code fences take a language and caption: ```` ``` bash caption ````.
- Pages: `src/content/pages/<name>.md` (`about.md` feeds the About page).
- Images and other static files: `public/`.

### UI settings

Everything the pages show (colors, banners, menu, slogan, icons, analytics, footer) is in
[`src/site.config.ts`](src/site.config.ts).

### Run

```bash
npm ci
npm run dev      # local server
npm run build    # type check + static site in dist/
```

Pushing to `master` builds and publishes the site through GitHub Actions (`.github/workflows/pages.yml`).

### License

The stylesheets in `src/styles/fluid/` and the scripts in `public/js/` come from Fluid and are under the GPL-3.0
license included beside them.
