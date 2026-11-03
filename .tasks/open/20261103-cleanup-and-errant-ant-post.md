---
id: 20261103-cleanup-and-errant-ant-post
status: active
queue: current
depends_on: []
created: 2026-11-03
updated: 2026-11-03
---

# Goal

Clean out what the Hexo → Astro migration kept only for fidelity (old theme credits, sample and empty pages, unused
images, the old `gh-pages` branch), then publish a new post that introduces Errant Ant and links to
https://errantant.com.

## Acceptance

- The footer no longer shows the "Hexo ♥ Fluid" credit; the visitor statistics stay.
- `/links/`, `/privacy/` and `/resume/` are gone, along with the config that existed only for them. Every other URL keeps
  working.
- Unreferenced images are gone from `public/image/site/`.
- The remote `gh-pages` branch is deleted, and Pages still serves hling.org from the workflow.
- A new post at `/blog/<folder>/<name>/` introduces Errant Ant and links to https://errantant.com. It shows on the
  home page, in archives, in its category and tags, and in search.
- `npm run build` passes with 0 errors, warnings or hints. Committing and pushing (which publishes) wait for the
  user's go-ahead.

## Design

### Verified facts (2026-11-03)

- **Errant Ant** (https://errantant.com; title "Errant Ant", so the request's "Arrant Ant" is read as a typo): "A
  reader for language learners that counts each word you meet and keeps the sentences you met it in."
  - Availability: Windows through the Microsoft Store (https://apps.microsoft.com/detail/9PD02WCJVDQC); Steam is
    "coming soon".
  - Highlights from the site: 12 languages; local-first, with no account and no ads.
  - Reading: EPUB, PDF and TXT books, plus the Project Gutenberg catalog; paged reading; a word panel with
    dictionaries, notes and sentences.
  - Words: a word map, vocabulary of words and phrases, and word lists in TXT/CSV/TSV.
  - Privacy: no personal data collected, no analytics or tracking; dictionary lookups and translations run on the
    device; the app only goes online for Project Gutenberg and for downloading dictionaries or translation packs from
    GitHub.
- **Fidelity leftovers:**
  - `footer.content` in `src/site.config.ts` holds the Hexo/Fluid credit.
  - `/links/` (`src/pages/links.astro`, `config.links`) lists only Fluid's three sample links, whose avatar
    `/img/favicon.png` does not exist. No menu links to it.
  - `/privacy/` (`src/content/pages/privacy.md`) is empty and titled "page.title"; it dates from 2024-04-20, the
    same day the AdSense code appeared, which has since been removed.
  - `/resume/` (`src/content/pages/resume.md`) has front-matter and no content.
  - None of these pages are in the navbar.
- **Unused images:** `public/image/site/{b2,bg3,bg4}.jpg` (12.5 MB) are referenced nowhere in `src/` or `public/`.
- **Git:** besides `master`, the only branch is the remote `gh-pages` (the old Hexo output). Pages is set to
  `build_type: workflow`, so nothing serves from it. There are no tags, stashes or extra worktrees. The
  `github-pages` environment is used by the workflow and stays.

### Proposal

- Set `footer.content` to `''`. `Footer.astro` already skips an empty credit.
- Delete `src/content/pages/privacy.md`, `src/content/pages/resume.md`, `src/pages/links.astro`, and `config.links`
  with its `SiteConfig` type. `src/pages/[page].astro` stays, so a future `src/content/pages/<name>.md` still becomes a page.
  The vendored stylus is left as is.
- Delete `b2.jpg`, `bg3.jpg` and `bg4.jpg`.
- New post `src/content/posts/202611/errant-ant.md` → `/blog/202611/errant-ant/`, dated 2026-11-03 (Tokyo time),
  category `Projects`, tags `Errant Ant` and `language learning`. Written neutrally, without claiming authorship: what
  it is, reading, words, privacy, where to get it. Links go to errantant.com and the Microsoft Store listing. An
  excerpt marker sits after the first paragraph.
- `git push origin --delete gh-pages` now: Pages already serves from the workflow, and the user asked for the branch
  to be deleted. The commit and push of the file changes wait for the user.

## Scope

- In: the footer credit, the three pages and their config, unused images, the new post, and the `gh-pages` branch.
- Out: the vendored Fluid CSS and JS, the about page text, other config values, and the design.

## Execution slices

- [x] 1. Remove the credit, the chosen pages and the images; build.
- [x] 2. Add the post; build; check it on home, archive, category, tag and search output.
- [ ] 3. Delete `gh-pages` (done). With the user's go-ahead: commit and push, then confirm the deploy and the live
      pages.

## Current state

Active. Slices 1–2 are done. The remote `gh-pages` branch is deleted, and Pages still reports `build_type: workflow`,
`status: built`. The file changes are uncommitted. Next: the user's go-ahead to commit and push, then the live check.

## Validation

- `npm run build`: 0 errors / 0 warnings / 0 hints. The route list differs from the previous build only by the
  deleted pages and the new post's routes (post, `archives/2026/`, `archives/2026/11/`, category and tag pages).
- The new post's HTML has links to https://errantant.com and appears in `index.html` and `local-search.xml`.
- Live: the post returns 200, the deleted pages return 404, and `git ls-remote origin` shows no `gh-pages`.

### Results (2026-11-03, local)

- `npm run build`: 0 errors / 0 warnings / 0 hints; 30 routes. Compared with the previous build, `links/`, `privacy/`
  and `resume/` are gone, and `blog/202611/errant-ant/`, `archives/2026/`, `archives/2026/11/`,
  `categories/Projects/`, `tags/Errant-Ant/` and `tags/language-learning/` are new.
- The post links to https://errantant.com/ (twice) and the Microsoft Store, with `target="_blank" rel="noopener"`.
  It appears in `index.html`, `local-search.xml`, the 2026/11 archive, `categories/Projects/` and
  `tags/Errant-Ant/`. Its date reads "November 3, 2026 pm" (15:59 JST).
- The footer has only the visitor statistics; the credit markup is gone.
- Known theme quirk, kept: Fluid's word count removes all whitespace before counting, so English text is undercounted
  (this post shows "30 words"). The live site's SSH post has the same behavior.

## Decisions

- 2026-11-03 User: remove the leftover "old description" items named after the migration (footer credit, Fluid
  sample links, the "page.title" page), clean useless branches and files, and add the Errant Ant post.
- 2026-11-03 Q1: delete `/links/`, `/privacy/` and `/resume/`.
- 2026-11-03 Post: the name is "Errant Ant", following the site's title and domain (the request said "Arrant Ant").
