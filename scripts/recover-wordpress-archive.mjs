import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('recovery/wordpress-archive');
const indexPath = path.join(root, 'cdx-index.json');
const rawRoot = path.join(root, 'raw');
const manifestPath = path.join(root, 'download-manifest.json');
const maxBytes = 30 * 1024 * 1024;

const rows = JSON.parse(await readFile(indexPath, 'utf8'));
const headers = rows[0];
const records = rows.slice(1).map((row) => Object.fromEntries(headers.map((key, index) => [key, row[index]])));

const wantedMimeTypes = new Set([
  'text/html',
  'text/plain',
  'application/json',
  'application/xml',
  'text/xml',
  'application/rss+xml',
  'application/atom+xml',
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
]);

const selected = records.filter((record) => wantedMimeTypes.has(record.mimetype));

function extensionFor(record) {
  const typeExtensions = {
    'text/html': '.html',
    'text/plain': '.txt',
    'application/json': '.json',
    'application/xml': '.xml',
    'text/xml': '.xml',
    'application/rss+xml': '.xml',
    'application/atom+xml': '.xml',
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/webp': '.webp',
  };

  return typeExtensions[record.mimetype] ?? '.bin';
}

function groupFor(record) {
  if (record.mimetype === 'text/html') return 'html';
  if (record.mimetype.startsWith('image/')) return 'images';
  if (record.mimetype === 'application/pdf') return 'pdf';
  return 'feeds-and-data';
}

function safeStem(record, index) {
  let pathname = '/';
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

  return `${String(index + 1).padStart(4, '0')}-${stem}${extensionFor(record)}`;
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

      const declaredLength = Number(response.headers.get('content-length') || 0);
      if (declaredLength > maxBytes) throw new Error(`exceeds ${maxBytes} byte limit`);

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

await mkdir(rawRoot, { recursive: true });
for (const group of ['html', 'images', 'pdf', 'feeds-and-data']) {
  await mkdir(path.join(rawRoot, group), { recursive: true });
}

const manifest = selected.map((record, index) => {
  const group = groupFor(record);
  const relativePath = path.posix.join('raw', group, safeStem(record, index));
  return {
    original_url: record.original,
    snapshot_timestamp: record.timestamp,
    mime_type: record.mimetype,
    archive_url: `https://web.archive.org/web/${record.timestamp}id_/${record.original}`,
    local_path: relativePath,
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
      await writeFile(path.join(root, item.local_path), bytes);
      item.status = 'downloaded';
      item.bytes = bytes.byteLength;
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
process.stdout.write(`Complete: ${downloaded} downloaded, ${failed} failed, ${manifest.length} selected\n`);
