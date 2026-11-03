---
id: 20261103-modernize-blog-stack
status: active
queue: current
depends_on: []
created: 2026-11-03
updated: 2026-11-03
---

# Goal

Replace the outdated Hexo 6.3 + Fluid 1.9.7 blog (hling.org) with an Astro site that looks and behaves like the site
deployed on `gh-pages` today, driven by the same UI settings (colors, banners, slogan, menu, icons, analytics, footer).
The build and publish path must be reproducible from the repo alone.

## Acceptance

- A fresh clone builds on Node 24 with `npm ci && npm run build` from committed files only (lockfile committed), with
  no warnings or errors.
- Every route the deployed site serves exists at the same URL with a trailing slash, including `/blog/<dir>/<file>/`,
  `/archives/`, `/archives/YYYY/` and `/archives/YYYY/MM/`, `/categories/<name>/`, `/tags/<name>/`, `/about/`,
  `/links/`, `/privacy/`, `/resume/`, `/404.html` and `/local-search.xml`.
- Pages match the deployed site in content, layout, colors, banners, navbar, typing subtitle (worker API), dark mode,
  search, TOC, code blocks, footer statistics, and post dates in Asia/Tokyo. The normalized HTML differs from
  `gh-pages` only in the accepted differences listed in Design.
- The UI settings live in one typed `src/site.config.ts`. Changing a value there (for example a color or banner image)
  changes the built site, and a wrong type fails the build.
- The tags hand-injected into the deployed pages (GTM, AdSense, the duplicate inline gtag) are gone. Google Analytics
  G-8X396G5KJG still loads once, through config.
- A push to `master` builds and publishes hling.org through GitHub Actions, and the custom domain keeps working.
- No Hexo files, themes, or plugins remain.

## Design

### Verified facts (2026-11-03)

- **Current stack:** `hexo ^6.2.0` (deployed output says Hexo 6.3.0) and `hexo-theme-fluid ^1.9.7` from npm (deployed
  `CONFIG.version` 1.9.7), with `theme: fluid`. The following are unused leftovers: `hexo-theme-icarus`,
  `hexo-theme-landscape`, `hexo-renderer-inferno`, `glob`, `_config.icarus.yml` and `_config.landscape.yml`.
  `README.md` says Icarus. No lockfile is committed.
- **Content:** 4 posts in `source/_posts/{202403,older}/*.md`, with no asset folders. Front-matter holds `title`,
  `date`/`updated` like `2024/3/14 22:53:25` (Hexo reads these in `timezone: Asia/Tokyo`), `categories`, `tags`,
  `cover`, and `comments`. Pages: `about` (layout about), `categories`, `tags`, `resume` (page), and `privacy` (an
  empty `index.html`). Fluid also generates `/links/` and `/404.html`. Static files: `source/image/site/*` (8
  images), `source/css/iconfont.css` with `icon-chess.*` (the OGS icon), empty `custom.css`/`custom.js`, and `CNAME`.
- **Permalinks:** `permalink: blog/:title/`, where `:title` is the path under `_posts`, for example
  `/blog/older/login_without-pwd/`.
- **UI config:** `_config.fluid.yml` is a full copy of Fluid 1.9.7's defaults, but only about 40 values differ.
  - The user's values: favicon and apple-touch icon; `force_https`; typing speed 60; the Solarized-style colors (body,
    board, text, heading, link, hover, scrollbar); `web_analytics` on with Google G-8X396G5KJG; navbar title
    "Hamilton's home"; ground glass on; footer busuanzi statistics with custom texts; banner images under
    `/image/site/`; slogan text plus the subtitle API (`worker-subtitle.i-060.workers.dev`, key `data`); post author and
    busuanzi views on; about avatar, name link, intro and icons (GitHub, Steam, OGS chess); `privacy.enable` (not a
    Fluid key); and `links.onerror_avatar: /image/avatar.png` (a missing file; the real path is
    `/image/site/avatar.png`).
  - Everything else is Fluid defaults, such as menu items, banner heights and mask alpha, the TOC, code-block widgets,
    anchors, fancybox, lazyload, search, and dark mode `auto`.
- **What the deployed pages load:**
  - Bootstrap 4.6.1, jQuery 3.6.4, nprogress, typed.js 2.0.12, tocbot 4.20.1, anchor-js 4.3.1, fancybox 3.5.7,
    clipboard 2.0.11, github-markdown-css 4.0.0 and hint.css, all from `lib.baomitu.com`.
  - Fluid's own `main.css` (2,281 lines compiled from 42 stylus files, reading config through `theme-config()` /
    `hexo-config()`), `highlight(-dark).css`, and the scripts `boot.js`, `events.js`, `plugins.js`, `utils.js`,
    `color-schema.js`, `local-search.js` and `img-lazyload.js`.
  - Two alicdn iconfont stylesheets, busuanzi, and the hand-injected tags below.
- **Hand-injected tags:** the deployed pages carry an inline gtag for G-8X396G5KJG, Google Tag Manager GTM-WB4JDQW2
  (head script plus a body `noscript` iframe) and AdSense ca-pub-4695419220597596. None of it is in the repo. Rebuilding
  `master` with Hexo 6.3 + Fluid 1.9.7 reproduces the deployed HTML exactly, except for those blocks and the
  mtime-based dates, so the tags were edited into `node_modules` and no other deployed content is missing from git.
  Fluid's `web_analytics.google` already loads G-8X396G5KJG, so the inline gtag duplicates it.
- **Deploy today:** `hexo-deployer-git` pushes to `gh-pages`. GitHub Pages runs in `legacy` mode from `gh-pages`,
  with CNAME hling.org and `https_enforced: false`. The last deploy was 2024-04-21.
- **Astro:** current release 7.4.5, needs Node ≥ 22.23.4 (local Node is 24.20). It supports content collections
  with a glob loader and zod schemas, `build.format: 'directory'`, `trailingSlash: 'always'`, and Vite's stylus
  preprocessor.
- **Fluid:** no Astro or Hugo port exists (web search, 2026-11-03). Fluid is licensed under GPL-3.0.
- **Hexo-path feasibility** (kept as the fallback if Astro is reversed): Hexo 8.1.2 + Fluid 1.9.8 builds cleanly in
  scratchpad, and its HTML matches the deployed site apart from version strings and tiny markup details.

### Proposed implementation

- **Project:** Astro 7 static site in this repo, replacing Hexo. `src/content/posts/**` holds the moved posts with
  front-matter unchanged. `public/` holds `image/site/*`, `css/iconfont.css` + fonts, and `CNAME`. Output goes to
  `dist/`. Add `.nvmrc` (24), `engines`, and the scripts `dev`, `build` (`astro check && astro build`, so config type
  errors fail the build) and `preview`. Commit `package-lock.json`.
- **Content collection:** a glob loader over `src/content/posts/**/*.md` whose ids keep the subdirectory
  (`older/login_without-pwd`). The zod schema covers the front-matter above. `date`/`updated` strings are parsed as
  Asia/Tokyo explicitly, because CI runs in UTC and plain `Date` parsing would shift every date.
- **Routes:** `src/pages/blog/[...slug].astro`, `index` + `page/[n]` (10 per page), `archives/` + year/month,
  `categories/[name]`, `tags/[name]`, `about`, `links`, `privacy`, `resume`, `404`, and `local-search.xml.ts`. Set
  `trailingSlash: 'always'` and `build.format: 'directory'`.
- **Markdown parity:** external links get `target="_blank"` (Hexo `external_link`). Code-block highlighting and
  markup follow the faithful port below. Word count and reading time port Fluid's counting rule.
- **Removed:** `_config*.yml`, `scaffolds/`, `themes/`, the Hexo dependencies, and the empty `custom.css`/`custom.js`.
  Fix `onerror_avatar` and drop the dead `privacy.enable`. `.gitignore` swaps `public/` for `dist/` and `.astro/`,
  because Astro's `public/` is source.
- **Hand-injected tags:** not ported (Q4). Only the config-driven Google Analytics remains.
- **Publish (Q5):** `.github/workflows/pages.yml` triggers on push to `master` and on `workflow_dispatch`. Steps:
  checkout → setup-node from `.nvmrc` with npm cache → `npm ci` → `npm run build` → `actions/upload-pages-artifact`
  (`dist`) → `actions/deploy-pages`, with `pages: write` and `id-token: write`. The Pages source moves from legacy
  `gh-pages` to "GitHub Actions" with custom domain hling.org. `public/CNAME` stays for clarity, though Actions
  deploys take the domain from settings. `gh-pages` is left untouched as the rollback. `hexo-deployer-git` and
  `npm run deploy` are gone.

Fidelity (Q2, decided: A):

- **Faithful port:** Astro components translated from the Fluid EJS partials the site uses, emitting the same
  markup. Fluid's stylus sources are vendored and compiled by Vite. Their 67 `theme-config("…")`/`hexo-config("…")`
  lookups are rewritten in the vendored copy to read the new config's paths through one stylus function backed by
  `site.config.ts`, so colors stay config-driven without a Fluid-key translation table. Fluid's browser scripts and
  the same CDN libraries are reused. Highlighting uses highlight.js through a small rehype step that emits Hexo's `figure.highlight` gutter/code table
  (Shiki off). Search is Fluid's `local-search.js` over a matching `local-search.xml`. Fidelity is checked by markup
  diff against `gh-pages`. The cost: jQuery/Bootstrap 4 stay, and the vendored Fluid files make those parts GPL-3.0
  (keep Fluid's LICENSE beside them).

Config (Q3, decided): `src/site.config.ts` exports one object annotated with the `SiteConfig` interface in the same
file. An annotation rather than `satisfies` keeps option fields typed as their unions, such as TOC placement. It holds every value the port reads: the user's values from
`_config.fluid.yml`/`_config.yml` plus the Fluid defaults that the used features depend on, written out explicitly
(no hidden defaults). Keys are grouped by site area (site, navbar, banner per page, colors, post, footer, analytics,
about, links). Components, the stylus function and the search endpoint all read this object, so it is the only
source.

Accepted differences against `gh-pages` (mechanical, from the executor's side of the design):
- whitespace, attribute quoting and attribute order;
- the `generator` meta, and the Fluid version inside `CONFIG`;
- URLs of assets Vite builds, such as the compiled stylesheet under `/_astro/`;
- removed links to the empty `custom.css`/`custom.js`;
- the removed GTM, AdSense and inline gtag blocks (Q4);
- `article:modified_time`/`published_time` on pages that have no front-matter dates (Hexo took them from file
  mtimes);
- the fixed `onerror_avatar` path;
- HTML comments, such as the theme's "do not modify" notes;
- `window.CONFIG` holding only the keys Fluid's scripts read: no `hostname`, `root`, `version`, `progressbar` or the
  unused analytics providers;
- `/xml/local-search.xml`, the theme's raw template that Hexo copied into the output, which is not generated;
- theme files no page references (`css/gitalk.css`, `js/leancloud.js`, `img/{avatar,default,fluid,police_beian}.png`),
  which are not published.

Dependency note: `stylus@0.64` (the latest) asks for `glob@^10`, which npm reports as deprecated on install.
`package.json` overrides it to `glob@^13`; the compiled CSS stays byte-identical.

Content syntax: the post that used Hexo's `{% codeblock lang:bash >unfolded %}` tag now uses the equivalent fence
`` ``` bash >unfolded ``, which renders the same markup. Hexo/Fluid tag plugins and Fluid's footnote syntax are not
ported, because no content uses them.

Any other hunk is a fidelity bug to fix, or a user-owned question if fixing it would change what visitors see.

## Scope

- In: everything under the repo root that makes up the site, its build, its config and its publish workflow;
  `README.md`.
- Out: post and page wording, new features (RSS, comments, i18n beyond `en`), switching analytics or counters
  (busuanzi stays), enforcing HTTPS on Pages, changing `url`, and deleting the `gh-pages` branch.
- Prohibited: changing URLs, dropping a feature the deployed site has, and freezing a compiled `main.css` copy in
  place of config-driven styles.

## Execution slices

- [x] 1. Tracer: Astro skeleton, `site.config.ts`, posts collection with Tokyo dates, base layout (head,
      navbar, banner, footer) and the post page. `/blog/older/login_without-pwd/` builds at the same URL with code
      blocks, TOC and dark mode, and is compared against `gh-pages`. This proves the content pipeline, URL shape,
      styling path and highlight markup. It defers the listing pages, standalone pages, search and publish.
- [x] 2. Listing pages: index with pagination, archives (+year/month), categories (+each), tags (+each).
- [x] 3. Standalone pages and search: about, links, privacy, resume, 404 with its 5 s redirect, `local-search.xml`.
- [x] 4. Head and analytics: GA through config and busuanzi, with no GTM/AdSense. Remove the Hexo files. README.
- [ ] 5. Publish: add the workflow (done: `.github/workflows/pages.yml`). The Pages source switch is a repo-settings change: the user does it in Settings →
      Pages → Source, or approves `gh api -X PUT repos/jusvail/hexo_blog/pages -f build_type=workflow` at that step.
      The push needs the user's go-ahead. Then confirm the live site.

## Current state

Active. Slices 1–4 are done and validated locally, and the slice 5 workflow file is written. Nothing is committed or
pushed. What remains needs the user: commit and push to `master`, and switch Settings → Pages → Source to
"GitHub Actions" (custom domain hling.org). After that, the Publish check in Validation runs and the task can be
archived. Until the switch, the next push publishes nothing, and `gh-pages` keeps serving the old site.

## Validation

- Fresh build: `npm ci && npm run build` in a clean clone shows no warnings or errors.
- Route parity: the sorted list of `.html`/`.xml` paths in `dist/` equals the list in `git archive origin/gh-pages`.
- Look and behavior:
  - Diff each page's normalized HTML (`><` split to lines) against `gh-pages`, allowing only the accepted
    differences; also diff the compiled CSS against the deployed `css/main.css`.
  - One cropped screenshot each of the home page (desktop) and a post (mobile, menu open, dark mode), to catch what
    markup can't, such as missing assets or script errors.
  - A search query that returns the SSH post, and a post's displayed date checked against its front-matter in Tokyo
    time.
- Config-driven: change the body background color in `site.config.ts`, rebuild, and confirm the value appears in the
  compiled CSS. Set one field to a wrong type and confirm `npm run build` fails. Revert both.
- Publish: the workflow run is green, `curl -s https://hling.org/` no longer shows the Hexo generator meta, and
  `curl -sI http://hling.org/blog/older/login_without-pwd/` returns 200.
- Cleanup: `git grep -iE 'hexo|icarus|landscape' -- ':!.tasks'` shows only intentional mentions (README history,
  Fluid credit).

### Results (2026-11-03, final worktree)

- Fresh build: the would-be-committed files, copied to scratch, pass `npm ci` with no warnings and `npm run build`
  with `astro check` 0 errors / 0 warnings / 0 hints; 27 routes are built.
- Route parity: the `.html`/`.xml` lists match `origin/gh-pages` except `xml/local-search.xml` (accepted).
- Markup: every page's normalized HTML differs from `gh-pages` only in accepted differences. `css/main.css`,
  `highlight.css` and `highlight-dark.css` are byte-identical. `local-search.xml` entries (title, URL, content,
  categories, tags) are identical.
- Browser (`astro preview`): home at 960×600 shows the API slogan, cards and theme colors. The SSH post on mobile in
  dark mode shows Fluid's dropdown menu open, 8 code blocks with copy buttons, a filled TOC and anchors. The date
  reads "December 9, 2018 pm" (13:22 JST, matching the front-matter). Searching "authorized" returns
  `/blog/older/login_without-pwd/`. The console shows no errors.
- Config-driven (in the scratch copy): `bodyBg: '#123456'` appears as `--body-bg-color: #123456` in `main.css`, and
  `bodyBg: 42` fails `npm run build` with TS2322.
- Cleanup: the remaining "hexo" mentions are the footer credit and links-page items kept from the config, Fluid
  credits in vendored files, and comments that cite the Hexo behavior being reproduced.
- Not yet run: Publish (needs the push and the Pages source switch).

## Decisions

- 2026-11-03 Q1 architecture: rewrite on Astro rather than modernizing Hexo + Fluid in place. Chosen by the user
  against the recommendation, knowing no Fluid port exists and the UI must be rebuilt.
- 2026-11-03 Q2 fidelity: A, faithful port. Fluid's markup, vendored stylus (config-driven), browser scripts, CDN
  libraries and highlight.js markup are reused. jQuery/Bootstrap 4 and GPL-3.0 for the vendored parts are accepted.
  Fidelity is checked by markup diff against `gh-pages`.
- 2026-11-03 Q3 config: a typed `src/site.config.ts` rather than Fluid-style YAML. Keys are restructured from Fluid's
  layout; the values carry over.
- 2026-11-03 Q4 hand-injected tags: drop GTM-WB4JDQW2, AdSense ca-pub-4695419220597596 and the duplicate inline gtag.
  Their absence is an accepted diff hunk. Ads and GTM tracking end at the switch.
- 2026-11-03 Q5 publish: GitHub Actions → GitHub Pages on push to `master`, replacing the local `hexo deploy`.
  `gh-pages` is kept as the rollback.
