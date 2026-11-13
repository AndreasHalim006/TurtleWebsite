import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('recovery/wordpress-archive');
const historyPath = path.join(root, 'cdx-html-history.json');
const htmlRoot = path.join(root, 'raw', 'html-latest');
const textRoot = path.join(root, 'extracted-text-latest');
const manifestPath = path.join(root, 'latest-html-manifest.json');
const indexPath = path.join(root, 'latest-html-index.csv');
const maxBytes = 30 * 1024 * 1024;

const rows = JSON.parse(await readFile(historyPath, 'utf8'));
const headers = rows[0];
const history = rows.slice(1).map((row) => Object.fromEntries(headers.map((key, index) => [key, row[index]])));

const latestByUrl = new Map();
for (const record of history) {
  const existing = latestByUrl.get(record.original);
  if (!existing || record.timestamp > existing.timestamp) latestByUrl.set(record.original, record);
}
const latest = [...latestByUrl.values()].sort((a, b) => a.original.localeCompare(b.original));

function safeStem(record, index) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(record.original).pathname);
  } catch {
    pathname = record.original;
  }
  const stem = pathname
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^\p{L}\p{N}._-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(-140) || 'home';
  return `${String(index + 1).padStart(4, '0')}-${stem}`;
}

function decodeEntities(value) {
  const named = {
    amp: '&', apos: "'", gt: '>', hellip: '…', laquo: '«', ldquo: '“', lsquo: '‘', lt: '<',
    nbsp: ' ', ndash: '–', mdash: '—', quot: '"', raquo: '»', rdquo: '”', rsquo: '’',
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

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Aristurtle content recovery/1.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(45_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > maxBytes) throw new Error(`exceeds ${maxBytes} byte limit`);
      return bytes;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
    }
  }
  throw lastError;
}

await mkdir(htmlRoot, { recursive: true });
await mkdir(textRoot, { recursive: true });

const manifest = latest.map((record, index) => {
  const stem = safeStem(record, index);
  return {
    original_url: record.original,
    snapshot_timestamp: record.timestamp,
    archive_url: `https://web.archive.org/web/${record.timestamp}id_/${record.original}`,
    raw_html: path.posix.join('raw', 'html-latest', `${stem}.html`),
    extracted_text: path.posix.join('extracted-text-latest', `${stem}.txt`),
    status: 'pending',
  };
});

let cursor = 0;
let completed = 0;
let downloaded = 0;
let failed = 0;

async function worker() {
  while (cursor < manifest.length) {
    const index = cursor;
    cursor += 1;
    const item = manifest[index];
    try {
      const bytes = await fetchWithRetry(item.archive_url);
      const html = new TextDecoder().decode(bytes);
      const text = htmlToText(html);
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? htmlToText(titleMatch[1]) : new URL(item.original_url).pathname;

      await writeFile(path.join(root, item.raw_html), bytes);
      await writeFile(
        path.join(root, item.extracted_text),
        `Title: ${title}\nOriginal URL: ${item.original_url}\nSnapshot: ${item.snapshot_timestamp}\nArchive URL: ${item.archive_url}\n\n${text}\n`,
      );
      item.status = 'downloaded';
      item.title = title;
      item.bytes = bytes.byteLength;
      item.characters = text.length;
      downloaded += 1;
    } catch (error) {
      item.status = 'failed';
      item.error = error instanceof Error ? error.message : String(error);
      failed += 1;
    }
    completed += 1;
    if (completed % 25 === 0 || completed === manifest.length) {
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      process.stdout.write(`Processed ${completed}/${manifest.length}; downloaded ${downloaded}; failed ${failed}\n`);
    }
  }
}

await Promise.all(Array.from({ length: 3 }, () => worker()));
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}
const csvHeaders = ['title', 'original_url', 'snapshot_timestamp', 'characters', 'bytes', 'status', 'raw_html', 'extracted_text', 'archive_url'];
const csvLines = [csvHeaders.map(csvCell).join(',')];
for (const item of manifest) csvLines.push(csvHeaders.map((header) => csvCell(item[header])).join(','));
await writeFile(indexPath, `${csvLines.join('\n')}\n`);

process.stdout.write(`Complete: ${downloaded} downloaded, ${failed} failed, ${manifest.length} latest HTML records\n`);
