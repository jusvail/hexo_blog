// String helpers that reproduce the escaping and slug rules the Hexo site used, so URLs and
// markup stay the same.

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
  '/': '&#x2F;',
  '=': '&#x3D;',
};

const htmlUnescapes: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#96;': '`',
  '&#x2F;': '/',
  '&#x3D;': '=',
};

export function unescapeHTML(str: string): string {
  return str.replace(/&(amp|lt|gt|quot|#39|#96|#x2F|#x3D);/g, (entity) => htmlUnescapes[entity]);
}

/** Markdown text escaping: also escapes `/` and `=`, and never double-escapes. */
export function escapeHTML(str: string): string {
  return unescapeHTML(str).replace(/[&<>"'`/=]/g, (char) => htmlEntities[char]);
}

/** Attribute and text escaping as done by the theme templates. */
export function escapeAttr(str: string): string {
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

export function stripHTML(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g, '');
}

const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g;

/** URL segment for a category, tag or heading id. */
export function slugize(str: string): string {
  return str
    .replace(/[À-ɏḀ-ỿ]/g, (char) => char.normalize('NFD').replace(/[̀-ͯ]/g, ''))
    .replace(/[\u0000-\u001f]/g, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function encodeURL(str: string): string {
  if (/^[a-z][a-z\d+.-]*:/i.test(str)) {
    try {
      const url = new URL(str);
      if (url.origin === 'null') return str;
      url.search = encodeURI(decodeURI(url.search));
      return url.toString();
    } catch {
      return str;
    }
  }
  return encodeURI(decodeURI(str));
}

/** Links to another host open in a new tab, as Hexo's `external_link` did. */
export function isExternalLink(href: string, siteUrl: string): boolean {
  if (!/^(?:https?:)?\/\//i.test(href)) return false;
  try {
    return new URL(href, siteUrl).hostname !== new URL(siteUrl).hostname;
  } catch {
    return false;
  }
}

/** Fill the `{}` placeholder of a config text such as `{} words`. */
export function fill(format: string, value: string | number): string {
  return format.replace('{}', String(value));
}
