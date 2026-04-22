# App Store screenshot generator (iPhone only)

> **Moved**: the maintained generator now lives at `USVisaPhotoCom/marketing/appstore/` (same outputs, but uses `file://frame.html` with the USVisaPhotoCom Tailwind CDN stack).

**三种方案（旧模板 / frame+JSON / 官网切片）的对照与维护说明**：[USVisaPhotoCom/DOCUMENTATION.md](../../DOCUMENTATION.md)。

This folder contains a **repeatable pipeline** to render App Store Connect–sized PNGs from:

- **Real app UI screenshots** (your library)
- Optional **marketing frames** (brand background + frosted glass card + `object-fit: contain` so nothing is cropped)

## What you get

- `targets.json`: iPhone canvas sizes (edit as Apple requirements change)
- `screenshots.json`: per-frame layout + assets + optional device frame (JSON first; YAML can be added later via a converter)
- `template.html` + `generate.mjs`: Playwright renders each frame at exact pixel size

## Prereqs

Install Node deps (once):

```bash
cd tools/appstore-screenshots
npm install
npx playwright install chromium
```

## Generate

```bash
cd tools/appstore-screenshots
npm run generate -- --config screenshots.json --targets targets.json --out ../../dist/appstore
```

Outputs:

```
dist/appstore/<target_name>/<screen_id>.png
```

## Device frame toggle

Each screen can override:

- `deviceFrame.enabled`: `true|false`
- `deviceFrame.variant`: currently only `iphone_flat` (placeholder styling; swap for real bezel assets later)

Global defaults live under `defaults.deviceFrame`.

## Marketing copy (optional)

You can add `defaults.copy` and/or per-screen `copy`:

- If `title` **or** `subtitle` is non-empty, the template reserves space at the top and **moves the screenshot card downward** (still `object-fit: contain`, no cropping).
- If both are empty strings, the marketing block is hidden.

`generate.mjs` merges `defaults.copy` with each screen’s `copy` so you can set a global baseline and override per frame.
