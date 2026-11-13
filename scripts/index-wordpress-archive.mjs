import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('recovery/wordpress-archive');
const manifest = JSON.parse(await readFile(path.join(root, 'download-manifest.json'), 'utf8'));
const textRoot = path.join(root, 'extracted-text');

await mkdir(textRoot, { recursive: true });

function decodeEntities(value) {
  const named = {
    amp: '&',
    apos: "'",
    gt: '>',
    hellip: '…',
    laquo: '«',
    ldquo: '“',
    lsquo: '‘',
    lt: '<',
    nbsp: ' ',
    ndash: '–',
    mdash: '—',
    quot: '"',
    raquo: '»',
    rdquo: '”',
    rsquo: '’',
  };

  return value
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)))
    .replace(/&([a-z]+);/gi, (entity, name) => named[name.toLowerCase()] ?? entity);
}

function htmlToText(html) {
  return decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|svg|template)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      .replace(/<\/(address|article|aside|blockquote|div|dl|fieldset|figcaption|figure|footer|form|h[1-6]|header|li|main|nav|ol|p|pre|section|table|tr|ul)>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\r/g, '')
    .replace(/[\t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function titleFromHtml(html, fallback) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? htmlToText(match[1]) : fallback;
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

const pages = [];
let textIndex = 0;

for (const item of manifest) {
  if (item.status !== 'downloaded' || item.mime_type !== 'text/html') continue;

  const html = await readFile(path.join(root, item.local_path), 'utf8');
  const text = htmlToText(html);
  const title = titleFromHtml(html, new URL(item.original_url).pathname);
  const sourceName = path.basename(item.local_path, '.html');
  const textName = `${sourceName}.txt`;
  const relativeTextPath = path.posix.join('extracted-text', textName);

  await writeFile(
    path.join(textRoot, textName),
    `Title: ${title}\nOriginal URL: ${item.original_url}\nSnapshot: ${item.snapshot_timestamp}\nArchive URL: ${item.archive_url}\n\n${text}\n`,
  );

  pages.push({
    title,
    original_url: item.original_url,
    snapshot_timestamp: item.snapshot_timestamp,
    raw_html: item.local_path,
    extracted_text: relativeTextPath,
    characters: text.length,
  });
  textIndex += 1;
}

pages.sort((a, b) => a.original_url.localeCompare(b.original_url));

const csvHeaders = ['title', 'original_url', 'snapshot_timestamp', 'characters', 'raw_html', 'extracted_text'];
const csvLines = [csvHeaders.map(csvCell).join(',')];
for (const page of pages) {
  csvLines.push(csvHeaders.map((header) => csvCell(page[header])).join(','));
}
await writeFile(path.join(root, 'html-page-index.csv'), `${csvLines.join('\n')}\n`);

const fullInventoryHeaders = ['original_url', 'snapshot_timestamp', 'mime_type', 'bytes', 'status', 'local_path', 'archive_url'];
const fullInventoryLines = [fullInventoryHeaders.map(csvCell).join(',')];
for (const item of manifest) {
  fullInventoryLines.push(fullInventoryHeaders.map((header) => csvCell(item[header])).join(','));
}
await writeFile(path.join(root, 'content-inventory.csv'), `${fullInventoryLines.join('\n')}\n`);

const markdown = [
  '# Archived HTML Page Index',
  '',
  `Recovered ${pages.length} HTML records. Links below point to the original URL for identification; use the local text and HTML paths for preserved content.`,
  '',
  '| Page | Snapshot | Characters | Local text | Raw HTML |',
  '|---|---:|---:|---|---|',
  ...pages.map((page) => {
    const title = page.title.replaceAll('|', '\\|');
    const original = page.original_url.replaceAll('|', '%7C');
    return `| [${title}](${original}) | ${page.snapshot_timestamp} | ${page.characters} | [text](${page.extracted_text}) | [HTML](${page.raw_html}) |`;
  }),
  '',
];
await writeFile(path.join(root, 'html-page-index.md'), markdown.join('\n'));

process.stdout.write(`Indexed ${textIndex} HTML records and wrote CSV/Markdown inventories.\n`);
