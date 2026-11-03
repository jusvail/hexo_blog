// Compiles the vendored Fluid stylesheets with values from site.config.ts.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import stylus from 'stylus';
import { config } from '../site.config';

const fluidDir = path.join(process.cwd(), 'src/styles/fluid');
const require = createRequire(path.join(process.cwd(), 'package.json'));

type Variant = 'light' | 'dark';

function highlightStyle(variant: Variant): string {
  const { style, styleDark } = config.code.highlight;
  return require.resolve(`highlight.js/styles/${variant === 'light' ? style : styleDark}.css`);
}

// The background the highlight.js style gives `.hljs`, which code blocks reuse.
function highlightBackground(variant: Variant): string | undefined {
  const css = readFileSync(highlightStyle(variant), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  let background: string | undefined;
  for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (!selectors.split(',').some((selector) => selector.trim().endsWith('.hljs'))) continue;
    for (const [, value] of body.matchAll(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/g)) {
      background = value.trim();
    }
  }
  return background === 'white' || background === '#ffffff' ? '#fff' : background;
}

/** `site-config("a.b")` in stylus: the value at that path, or '' when it is missing. */
function lookup(name: string): unknown {
  let value: unknown = config;
  for (const key of name.split('.')) {
    if (typeof value !== 'object' || value === null || !Object.hasOwn(value, key)) return '';
    value = (value as Record<string, unknown>)[key];
  }
  return value;
}

function render(source: string, filename: string): string {
  return stylus(source)
    .set('filename', filename)
    .set('include css', true)
    .define('site-config', (node: { val: string }) => lookup(node.val))
    .define('highlight-bg-color', (node: { val: Variant }) => {
      const background = highlightBackground(node.val);
      if (background && background !== '#fff') return new stylus.nodes.Literal(background);
      return new stylus.nodes.Literal(node.val === 'light' ? '#f6f8fa' : '#2d333b');
    })
    .render();
}

export function mainCss(): string {
  const file = path.join(fluidDir, 'main.styl');
  return render(readFileSync(file, 'utf8'), file);
}

export function highlightCss(variant: Variant): string {
  const file = highlightStyle(variant);
  return render(`@require "${file}"`, path.join(fluidDir, `highlight-${variant}.styl`));
}

export function cssResponse(css: string): Response {
  return new Response(css, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
}
