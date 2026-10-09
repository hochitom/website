import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile, access } from 'node:fs/promises';
import { transform, bundle, browserslistToTargets } from 'lightningcss';
import { minify } from 'html-minifier-terser';

const src = new URL('../src/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);

const targets = browserslistToTargets(['last 2 versions', 'not dead', '>= 0.5%']);

await rm(dist, { recursive: true, force: true });
await mkdir(new URL('assets/', dist), { recursive: true });

// CSS: bundle @imports, minify, add content hash
const { code } = bundle({
  filename: new URL('css/main.css', src).pathname,
  minify: true,
  targets,
});
const cssHash = createHash('sha256').update(code).digest('hex').slice(0, 8);
const cssName = `main.${cssHash}.css`;
await writeFile(new URL(`assets/${cssName}`, dist), code);

// HTML: point to hashed CSS, minify markup
let html = await readFile(new URL('index.html', src), 'utf8');
html = html.replace('/css/main.css', `/assets/${cssName}`);
html = await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeOptionalTags: false,
  removeAttributeQuotes: false,
  minifyCSS: (css) => transform({ filename: 'inline.css', code: Buffer.from(css), minify: true, targets }).code.toString(),
  minifyJS: true,
  sortAttributes: true,
  sortClassName: true,
});
await writeFile(new URL('index.html', dist), html);

// Static files (favicon, robots, images, ...) if present
try {
  await access(new URL('static/', src));
  await cp(new URL('static/', src), dist, { recursive: true });
} catch {}

console.log(`Build fertig: dist/index.html, dist/assets/${cssName}`);
