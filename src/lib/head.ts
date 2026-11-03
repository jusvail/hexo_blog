import { config } from '../site.config';
import { escapeHTML, stripHTML } from './text';

export interface PageMeta {
  /** Page title; the home page has none. */
  title?: string;
  /** HTML or text the description is taken from. */
  description?: string;
  /** Rendered content, searched for images. */
  content?: string;
  type: 'article' | 'website';
  published?: Date;
  modified?: Date;
  tags?: string[];
}

const locales: Record<string, string> = { en: 'en_US', ja: 'ja_JP' };

function meta(attr: 'name' | 'property', key: string, content: string, escape = true): string {
  return `<meta ${attr}="${key}" content="${escape ? escapeHTML(content) : content}">`;
}

/** The description and Open Graph tags Hexo's `open_graph` helper wrote. */
export function openGraph(page: PageMeta, path: string): string {
  const url = new URL(path.endsWith('/') ? `${path}index.html` : path, config.site.url).toString();
  const description = escapeHTML(
    stripHTML(page.description || config.site.description).substring(0, 200).trim(),
  ).replace(/\n/g, ' ');
  const images = [...(page.content ?? '').matchAll(/<img [^>]*src=['"]([^'"]+)([^>]*>)/gi)]
    .map((match) => new URL(match[1], url).toString())
    .filter((src) => !src.startsWith('data:'));
  const tags = page.tags?.length ? page.tags : [config.site.keywords];

  const lines = [
    meta('name', 'description', description, false),
    meta('property', 'og:type', page.type),
    meta('property', 'og:title', page.title || config.site.title),
    meta('property', 'og:url', url, false),
    meta('property', 'og:site_name', config.site.title),
    meta('property', 'og:description', description, false),
    meta('property', 'og:locale', locales[config.site.language] ?? config.site.language, false),
    ...images.map((src) => meta('property', 'og:image', src, false)),
    ...(page.published ? [meta('property', 'article:published_time', page.published.toISOString())] : []),
    ...(page.modified ? [meta('property', 'article:modified_time', page.modified.toISOString())] : []),
    meta('property', 'article:author', config.site.author),
    ...tags.map((tag) => meta('property', 'article:tag', tag)),
    meta('name', 'twitter:card', config.openGraph.twitterCard),
    ...(images.length ? [meta('name', 'twitter:image', images[0], false)] : []),
  ];
  return lines.join('\n');
}

/** The settings Fluid's browser scripts read from `window.CONFIG`. */
export function clientConfig() {
  const { features, code, post, lazyload, analytics, search } = config;
  return {
    typing: {
      enable: features.typing.enable,
      typeSpeed: features.typing.typeSpeed,
      cursorChar: features.typing.cursorChar,
      loop: features.typing.loop,
    },
    anchorjs: features.anchorjs,
    code_language: code.language,
    copy_btn: code.copyBtn,
    image_caption: { enable: post.imageCaption },
    image_zoom: { enable: post.imageZoom.enable, img_url_replace: post.imageZoom.imgUrlReplace },
    toc: post.toc,
    lazyload: { enable: lazyload.enable, loading_img: lazyload.loadingImg, offset_factor: lazyload.offsetFactor },
    web_analytics: { enable: analytics.enable, follow_dnt: analytics.followDnt },
    search_path: search.path,
    include_content_in_search: search.content,
  };
}
