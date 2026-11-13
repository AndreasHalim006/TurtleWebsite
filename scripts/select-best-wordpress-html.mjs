import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('recovery/wordpress-archive');
const historyRows = JSON.parse(await readFile(path.join(root, 'cdx-html-history.json'), 'utf8'));
const latestManifest = JSON.parse(await readFile(path.join(root, 'latest-html-manifest.json'), 'utf8'));
const headers = historyRows[0];
const history = historyRows.slice(1).map((row) => Object.fromEntries(headers.map((key, index) => [key, row[index]])));
const bestHtmlRoot = path.join(root, 'raw', 'html-best');
const bestTextRoot = path.join(root, 'extracted-text-best');
const manifestPath = path.join(root, 'best-html-manifest.json');
const indexPath = path.join(root, 'best-html-index.csv');
const maxBytes = 30 * 1024 * 1024;

await mkdir(bestHtmlRoot, { recursive: true });
await mkdir(bestTextRoot, { recursive: true });

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

function inspectHtml(bytes) {
  const html = new TextDecoder().decode(bytes);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? htmlToText(titleMatch[1]) : '';
  const challenge = /one moment, please|attention required|just a moment|cf-chl-|cloudflare ray id/i.test(`${title}\n${html.slice(0, 100_000)}`);
  return { html, text: htmlToText(html), title, challenge };
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

const historyByUrl = new Map();
for (const record of history) {
  if (!historyByUrl.has(record.original)) historyByUrl.set(record.original, []);
  historyByUrl.get(record.original).push(record);
}
for (const records of historyByUrl.values()) records.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

const manifest = latestManifest.map((item, index) => ({
  original_url: item.original_url,
  status: 'pending',
  attempts: [],
  best_raw_html: path.posix.join('raw', 'html-best', `${String(index + 1).padStart(4, '0')}.html`),
  best_extracted_text: path.posix.join('extracted-text-best', `${String(index + 1).padStart(4, '0')}.txt`),
}));

let cursor = 0;
let completed = 0;
let recovered = 0;
let failed = 0;

async function worker() {
  while (cursor < manifest.length) {
    const index = cursor;
    cursor += 1;
    const item = manifest[index];
    const latest = latestManifest[index];
    const candidates = historyByUrl.get(item.original_url) ?? [];

    try {
      let chosen;
      for (const candidate of candidates) {
        let bytes;
        let sourcePath;
        if (candidate.timestamp === latest.snapshot_timestamp && latest.status === 'downloaded') {
          sourcePath = path.join(root, latest.raw_html);
          bytes = new Uint8Array(await readFile(sourcePath));
        } else {
          const archiveUrl = `https://web.archive.org/web/${candidate.timestamp}id_/${candidate.original}`;
          bytes = await fetchWithRetry(archiveUrl);
        }

        const inspected = inspectHtml(bytes);
        item.attempts.push({ timestamp: candidate.timestamp, title: inspected.title, challenge: inspected.challenge });
        if (inspected.challenge) continue;

        chosen = { candidate, bytes, ...inspected };
        break;
      }

      if (!chosen) throw new Error('No non-challenge snapshot found');

      await writeFile(path.join(root, item.best_raw_html), chosen.bytes);
      await writeFile(
        path.join(root, item.best_extracted_text),
        `Title: ${chosen.title}\nOriginal URL: ${item.original_url}\nSnapshot: ${chosen.candidate.timestamp}\nArchive URL: https://web.archive.org/web/${chosen.candidate.timestamp}id_/${chosen.candidate.original}\n\n${chosen.text}\n`,
      );

      item.status = 'recovered';
      item.title = chosen.title;
      item.snapshot_timestamp = chosen.candidate.timestamp;
      item.archive_url = `https://web.archive.org/web/${chosen.candidate.timestamp}id_/${chosen.candidate.original}`;
      item.bytes = chosen.bytes.byteLength;
      item.characters = chosen.text.length;
      recovered += 1;
    } catch (error) {
      item.status = 'failed';
      item.error = error instanceof Error ? error.message : String(error);
      failed += 1;
    }

    completed += 1;
    if (completed % 25 === 0 || completed === manifest.length) {
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      process.stdout.write(`Processed ${completed}/${manifest.length}; recovered ${recovered}; failed ${failed}\n`);
    }
  }
}

await Promise.all(Array.from({ length: 3 }, () => worker()));
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}
const csvHeaders = ['title', 'original_url', 'snapshot_timestamp', 'characters', 'bytes', 'status', 'best_raw_html', 'best_extracted_text', 'archive_url'];
const csvLines = [csvHeaders.map(csvCell).join(',')];
for (const item of manifest) csvLines.push(csvHeaders.map((header) => csvCell(item[header])).join(','));
await writeFile(indexPath, `${csvLines.join('\n')}\n`);

process.stdout.write(`Complete: ${recovered} best pages recovered, ${failed} failed, ${manifest.length} URLs\n`);
