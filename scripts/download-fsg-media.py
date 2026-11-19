"""Download the public FSG26 / GR Thessaloniki U keyword intersection.

Uses the public page's API configuration and public display sizes only; no login.
Run from the repository root. Existing files are retained to allow resuming.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json
import re
import time
import urllib.parse
import urllib.request
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'src/images/fsg26'
MANIFEST = ROOT / 'src/data/fsg-media-manifest.json'
SOURCE = 'https://media.formulastudent.de/keyword/GR%20Thessaloniki%20U;fsg26'
HOST = 'https://media.formulastudent.de'


def request(url, accept='application/json'):
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'Accept': accept, 'User-Agent': 'Aristurtle media import'})
            with urllib.request.urlopen(req, timeout=90) as response:
                return response.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(attempt + 1)


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    html = request(SOURCE, 'text/html').decode()
    # Public site configuration, not a private account credential.
    key = re.search(r'"apiKey":"([^"]+)"', html).group(1)

    def api(uri):
        sep = '&' if '?' in uri else '?'
        return json.loads(request(HOST + uri + sep + urllib.parse.urlencode({'APIKey': key})))

    config = json.loads(re.search(r'Y\.SM\.Page\.galleryConfig = (\{.*?\});', html).group(1))
    uri = config['galleryImageSourceUri'] + '&count=100'
    images = []
    while uri:
        response = api(uri)['Response']
        images.extend(response.get('AlbumImage', []))
        pages = response.get('Pages', {})
        total = pages.get('Total', len(images))
        uri = pages.get('NextPage')
    seen = set()
    images = [im for im in images if not (im['ImageKey'] in seen or seen.add(im['ImageKey']))]
    for im in images:
        tags = {tag.casefold() for tag in im['KeywordArray']}
        if not {'gr thessaloniki u', 'fsg26'} <= tags:
            raise ValueError('Unexpected keyword match: ' + im['ImageKey'])
    print(f'Found {len(images)} photos; reported total {total}.', flush=True)

    def download(im):
        sizes = api(im['Uris']['ImageSizes']['Uri'])['Response']['ImageSizes']
        size = next(name for name in ['X4LargeImageUrl', 'X3LargeImageUrl', 'X2LargeImageUrl', 'LargestImageUrl'] if sizes.get(name))
        url = sizes[size]
        name = im['ImageKey'] + '-' + im['FileName']
        path = DEST / name
        if not path.exists():
            data = request(url, 'image/jpeg')
            if not data.startswith(b'\xff\xd8'):
                raise ValueError('Not a JPEG: ' + im['ImageKey'])
            path.write_bytes(data)
        data = path.read_bytes()
        alias = next((tag[3:] for tag in im['KeywordArray'] if tag.startswith('by_')), '')
        if not alias:
            alias = Path(im['FileName']).stem.rsplit('_', 1)[-1]
        with Image.open(path) as photo:
            exif = photo.getexif()
            photographer = str(exif.get(315) or alias).strip('\x00 ')
            copyright_owner = str(exif.get(33432) or 'Formula Student Germany').strip('\x00 ')
            width, height = photo.size
        return {
            'id': im['ImageKey'], 'fileName': im['FileName'],
            'localPath': path.relative_to(ROOT).as_posix(),
            'sourcePage': im['WebUri'], 'downloadUrl': url, 'displaySize': size,
            'originalUrl': sizes.get('OriginalImageUrl'),
            'originalWidth': im['OriginalWidth'], 'originalHeight': im['OriginalHeight'],
            'dateTaken': im.get('DateTimeOriginal'), 'keywords': im['KeywordArray'],
            'caption': im.get('Caption', ''), 'photographer': photographer,
            'photographerAlias': alias, 'copyright': copyright_owner,
            'width': width, 'height': height,
            'credit': '\u00a9FSG / ' + photographer,
            'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
        }

    results, failures = [], []
    with ThreadPoolExecutor(max_workers=5) as pool:
        futures = {pool.submit(download, im): im for im in images}
        for future in as_completed(futures):
            im = futures[future]
            try:
                results.append(future.result())
                print(f'{len(results)}/{len(images)}: {im["ImageKey"]}', flush=True)
            except Exception as error:
                failures.append({'id': im['ImageKey'], 'sourcePage': im['WebUri'], 'error': str(error)})
                print(f'FAILED: {im["ImageKey"]}: {error}', flush=True)
    order = {im['ImageKey']: index for index, im in enumerate(images)}
    results.sort(key=lambda im: order[im['id']])
    manifest = {
        'source': SOURCE, 'keywords': ['GR Thessaloniki U', 'fsg26'],
        'retrievedAt': datetime.now(timezone.utc).isoformat(),
        'reportedTotal': total, 'downloadedCount': len(results),
        'resolutionNote': 'All matching photos, public X4 display size (actual long edge at most 2048px); original URLs retained for future retrieval.',
        'attribution': 'FSG permits Formula Student Germany uses; show ©FSG AND photographer inside or close to each image.',
        'sourceUsageNotice': 'https://media.formulastudent.de/keyword#fsg-copyright',
        'images': results, 'failures': failures,
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Downloaded {len(results)}; failed {len(failures)}; {sum(im["bytes"] for im in results) / 1e6:.1f} MB', flush=True)
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
