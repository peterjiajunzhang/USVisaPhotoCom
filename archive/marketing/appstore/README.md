# App Store marketing frames (USVisaPhotoCom stack)

**完整方案对比、目录说明、给 Agent 的接手清单**（含方案 A/B/C）：[`../DOCUMENTATION.md`](../DOCUMENTATION.md)。

This uses the same **Tailwind CDN** approach as the public site, but renders **fixed-size canvases** for App Store Connect.

## Zero-server workflow

Playwright opens `frame.html` via `file://` (no local web server), injects per-frame config, then screenshots at exact pixel sizes.

## Site sections → App Store PNGs (recommended)

This repo’s preferred workflow is to **reuse the real landing page sections** from `../../index.html`.

1. `index.html` contains paired markers:

   - `<!-- APPSTORE_SHOT:BEGIN:<id> -->`
   - `<!-- APPSTORE_SHOT:END:<id> -->`

2. `build-site-shots-html.mjs` reads those slices and writes `generated/shots.html` (gitignored), including a `<base href="file://.../USVisaPhotoCom/">` so relative image paths resolve under `file://`.

3. `export-site-shots.mjs` opens `generated/shots.html` via `file://`, sizes `:root { --shot-w; --shot-h; }` per `targets.json`, then exports one PNG per slice.

```bash
cd marketing/appstore
npm run site-shots
```

Outputs:

```
dist/appstore-site/<target_name>/<shot_id>.png
```

Configure slices in `site-shots.json` (ids must match the markers in `index.html`).

## Prereqs

```bash
cd marketing/appstore
npm install
npx playwright install chromium
```

## Generate (legacy PNG-in-frame workflow)

```bash
cd marketing/appstore
npm run generate -- --config screenshots.json --targets targets.json --out ../../dist/appstore
```

Outputs:

```
dist/appstore/<target_name>/<screen_id>.png
```

## Configure

- `targets.json`: iPhone canvas sizes
- `screenshots.json`: per-frame assets + optional marketing copy + optional device frame
