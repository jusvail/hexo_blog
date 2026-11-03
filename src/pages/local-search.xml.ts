// Search index read by Fluid's local-search.js.
import { getPosts } from '../lib/posts';
import { escapeAttr } from '../lib/text';
import { config } from '../site.config';

const noControlChars = (str: string) => str.replace(/[\x00-\x1F\x7F]/g, '');

export async function GET() {
  const entries = (await getPosts()).map((post) => {
    const url = encodeURI(post.url);
    const content = config.search.content
      ? `\n    <content type="html"><![CDATA[${noControlChars(post.html)}]]></content>`
      : '';
    const categories = post.categories.length
      ? `\n    <categories>${post.categories.map((c) => `\n      <category>${escapeAttr(c.name)}</category>`).join('')}\n    </categories>`
      : '';
    const tags = post.tags.length
      ? `\n    <tags>${post.tags.map((t) => `\n      <tag>${escapeAttr(t.name)}</tag>`).join('')}\n    </tags>`
      : '';
    return `  <entry>
    <title>${escapeAttr(post.title)}</title>
    <link href="${url}"/>
    <url>${url}</url>${content}${categories}${tags}
  </entry>`;
  });
  const xml = `<?xml version="1.0" encoding="utf-8"?>\n<search>\n${entries.join('\n')}\n</search>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
