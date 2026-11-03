// Markdown to HTML with the output the Hexo site produced: fenced code becomes highlight.js
// tables with line numbers, headings get Hexo's ids and anchors, text gets smart quotes and Hexo's
// escaping, and `<!-- more -->` marks the excerpt.

import hljs from 'highlight.js';
import { Marked } from 'marked';
import { config } from '../site.config';
import { encodeURL, escapeHTML, isExternalLink, slugize, stripHTML } from './text';

// ``` lang caption [url] [link text]
const rBacktick =
  /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2[^\S\r\n]?(\n+|$)/gm;
const rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
const rLangCaption = /([^\s]+)\s*(.+)?/;
const rCodePlaceholder = /<!--code￼(\d+)-->/g;
const rExcerpt = /<!-- ?more ?-->/i;

function stripIndent(str: string): string {
  const indents = str.match(/^[ \t]*(?=\S)/gm);
  if (!indents) return str;
  const min = Math.min(...indents.map((indent) => indent.length));
  return min ? str.replace(new RegExp(`^[ \\t]{${min}}`, 'gm'), '') : str;
}

// Re-open spans that a line break cut, so every line is valid on its own.
function closeTags(value: string): string {
  const stack: string[] = [];
  return value
    .split('\n')
    .map((line) => {
      const prepend = stack.map((cls) => `<span class="${cls}">`).join('');
      for (const match of line.matchAll(/(<span class="(.*?)">|<\/span>)/g)) {
        if (match[0] === '</span>') stack.shift();
        else stack.unshift(match[2]);
      }
      return prepend + line + '</span>'.repeat(stack.length);
    })
    .join('\n');
}

function highlightCode(code: string, lang: string | undefined, caption: string | undefined): string {
  code = stripIndent(code);
  let result;
  if (lang) {
    const name = lang.toLowerCase();
    result = hljs.highlight(code, { language: hljs.getLanguage(name) ? name : 'plaintext', ignoreIllegals: true });
  } else {
    result = hljs.highlightAuto(code);
  }
  const language = lang || result.language || '';
  const lines = closeTags(result.value).split('\n');
  const numbers = lines.map((_, i) => `<span class="line">${i + 1}</span><br>`).join('');
  const content = lines.map((line) => `${line}<br>`).join('');
  const gutter = config.code.highlight.lineNumber ? `<td class="gutter"><pre>${numbers}</pre></td>` : '';
  return (
    `<figure class="highlight${result.language ? ` ${result.language}` : ''}">` +
    (caption ? `<figcaption>${caption}</figcaption>` : '') +
    `<table><tr>${gutter}<td class="code"><pre><code class="hljs${language ? ` ${language}` : ''}">${content}</code></pre></td></tr></table></figure>`
  );
}

// Fenced blocks are rendered before markdown and kept out of it as placeholders.
function extractCodeBlocks(markdown: string, store: string[]): string {
  return markdown.replace(rBacktick, (_, start: string, _fence, args: string, body: string, end: string) => {
    let content = body.replace(/\n$/, '');
    let lang: string | undefined;
    let caption: string | undefined;
    const match = args && (rAllOptions.exec(args) || rLangCaption.exec(args));
    if (match) {
      lang = match[1];
      if (match[2]) {
        caption = `<span>${match[2]}</span>`;
        if (match[3]) caption += `<a href="${match[3]}">${match[4] || 'link'}</a>`;
      }
    }
    if (start.includes('>')) {
      const depth = start.split('>').length - 1;
      content = content.replace(new RegExp(`^([^\\S\\r\\n]*>){0,${depth}}([^\\S\\r\\n]|$)`, 'mg'), '');
    }
    store.push(highlightCode(content, lang, caption));
    return `${start}<!--code￼${store.length - 1}-->${end}`;
  });
}

function smartypants(str: string): string {
  return str
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/(^|[-—/([{"\s])'/g, '$1‘')
    .replace(/'/g, '’')
    .replace(/(^|[-—/([{‘\s])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/\.{3}/g, '…');
}

function lazyImages(html: string): string {
  if (!config.lazyload.enable) return html;
  return html.replace(/<img[^>]+?src=(".*?")[^>]*?>/gims, (tag, src: string) =>
    /lazyload/i.test(tag) ? tag : tag.replace(src, `${src} srcset="${config.lazyload.loadingImg}" lazyload`),
  );
}

function createMarked(): Marked {
  const headingIds: Record<string, number> = {};
  const marked = new Marked({ gfm: true, breaks: true });
  marked.use({
    hooks: {
      // Keep the blank lines after a raw HTML block in its output, as older marked did; the
      // 200-character summaries count them.
      processAllTokens(tokens) {
        tokens.forEach((token, i) => {
          const next = tokens[i + 1];
          if (token.type === 'html' && next?.type === 'space') token.text += next.raw;
        });
        return tokens;
      },
    },
    tokenizer: {
      inlineText(src) {
        const cap = this.rules.inline.text.exec(src);
        if (!cap) return undefined;
        const raw = cap[0];
        const keep = this.lexer.state.inRawBlock || this.rules.inline.url.exec(src);
        return { type: 'text', raw, text: keep ? raw : escapeHTML(smartypants(raw)), escaped: true };
      },
    },
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        let id = slugize(stripHTML(text).trim());
        if (headingIds[id]) id += `-${headingIds[id]++}`;
        else headingIds[id] = 1;
        return `<h${depth} id="${id}"><a href="#${id}" class="headerlink" title="${stripHTML(text)}"></a>${text}</h${depth}>`;
      },
      paragraph({ tokens }) {
        const text = this.parser.parseInline(tokens);
        const dl = /(?:^|\s)(\S.+)<br>:\s+(\S.+)/;
        if (dl.test(text)) return text.replace(dl, '<dl><dt>$1</dt><dd>$2</dd></dl>');
        return `<p>${text}</p>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = isExternalLink(href, config.site.url) ? ' target="_blank" rel="noopener"' : '';
        return `<a${external} href="${encodeURL(href)}"${title ? ` title="${title}"` : ''}>${text}</a>`;
      },
      image({ href, title, text }) {
        return `<img src="${encodeURL(href)}"${text ? ` alt="${text}"` : ''}${title ? ` title="${title}"` : ''}>`;
      },
    },
  });
  return marked;
}

export interface Rendered {
  html: string;
  /** HTML before `<!-- more -->`, or empty when there is no marker. */
  excerpt: string;
}

export function renderMarkdown(markdown: string): Rendered {
  const blocks: string[] = [];
  let html = createMarked().parse(extractCodeBlocks(markdown, blocks), { async: false });
  html = html.replace(rCodePlaceholder, (_, i: string) => blocks[Number(i)]);
  html = html.replace(/<pre><code>/g, '<pre><code class="hljs">');
  html = lazyImages(html);

  let excerpt = '';
  if (rExcerpt.test(html)) {
    excerpt = html.split(rExcerpt)[0].trim();
    html = html.replace(rExcerpt, '<span id="more"></span>');
  }
  return { html, excerpt };
}

/** Words as Fluid counted them: CJK characters one each, other runs of letters one each. */
export function wordCount(html: string): number {
  const content = stripHTML(html).replace(/\r?\n|\r/g, '').replace(/\s+/g, '');
  const zh = (content.match(/[一-龥]/g) || []).length;
  const en = (
    content
      .replace(/[一-龥]/g, '')
      .match(
        /[a-zA-Z0-9_Β-ωЀ-ӿ]+|[一-鿿㐀-䶿豈-﫿぀-ゟ가-힯Ѐ-ӿ]+|[äÄåÅöÖ]+|\w+/g,
      ) || []
  ).length;
  return zh + en;
}
