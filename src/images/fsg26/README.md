# Formula Student Germany 2026 photo pool

All **117** public photographs matching **both** `GR Thessaloniki U` and `fsg26`
were downloaded from the [specified keyword collection](https://media.formulastudent.de/keyword/GR%20Thessaloniki%20U;fsg26).

- Downloaded 2026-11-19: 117 files, zero failures, approximately 132.4 MB.
- The public `X4LargeImageUrl` rendition was used for every image; its actual long
  edge is at most 2048 pixels. These are web display files, not full-size originals.
- Every file retains its source image ID and photographer-bearing original filename.
- All JPEG headers were verified locally after downloading. No browser testing performed.
- Original download URLs, source pages, keyword arrays, photographer names, dates,
  byte sizes, and SHA-256 hashes are recorded in
  [the manifest](../../data/fsg-media-manifest.json).
- General site imagery can use the curated Astro imports in
  [fsg-media.ts](../../data/fsg-media.ts); historical car photos and season portraits
  should retain their accurate original imagery.

## Attribution

The source site's copyright notice permits use for Formula Student Germany purposes
and requests **©Formula Student Germany** or **©FSG**, **plus the photographer's name**,
inside or close to each photo. Keep the supplied `credit` visible next to or on
every rendered image. Photographer names in the manifest come from the JPEG's
EXIF `Artist` field. The source's `by_…` keyword is retained separately as
`photographerAlias`; it is used only as a fallback if EXIF does not supply a name.

## Re-import

With Python and Pillow installed, run `python scripts/download-fsg-media.py` from the repository root with network
access. The script follows public API pagination, verifies both required keywords,
uses the site's published image-size URLs, retains existing local files, and
writes download failures into the manifest. It does not log in or bypass restrictions.
