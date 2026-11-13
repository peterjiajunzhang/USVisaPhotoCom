# 2026-11-12 indexing follow-up

Native Chrome was used for signed-in Google/Bing reports and local UI tests. Public receipts omit identities, private inspection IDs and unrelated tabs. The application repository search ledger holds backend observations and official sources.

Changes: inline official Lucide SVG after Google's actual redirect loading failure; a seven-language, browser-only JPEG inspector in the existing upload troubleshooting guide; homepage/index discovery links; truthful per-topic sitemap dates. No new app functionality or store metadata.

`static-validation.json`: 35 HTML pages, self canonical/OG, reciprocal hreflang, local resources/fragments, 38 sitemap URLs, protected policies/support/campaigns, repeatable build. Final pass checks all 14 discovery anchors and the five existing in-page tables of contents. The two native Chinese guides have no table of contents; their checker and discovery anchors are checked directly. An initial assertion incorrectly expected seven tables of contents; the final check follows actual page structure.

`file-check-tests.json`: 12 Node VM boundary/state tests with stubbed image decoder. Native Chrome separately verified real 600x600 JPEG decoding, renamed PNG rejection, and the exact 240000/240001 byte boundary. Fixtures are synthetic flat colors, not user photos. Reproduce on macOS:

```sh
python3 scripts/make_file_check_fixtures.py /tmp/us-file-check-fixtures
node scripts/test_file_check.cjs /tmp/us-file-check-fixtures
```

`checker-320.png`, `checker-390.png`, `checker-1440.png`: Chrome device-toolbar viewport captures (device-pixel ratio may exceed 1). Tablet 768px also reviewed visually. They show synthetic data only. Measured zero-overflow assertions were not obtained: DevTools console paste protection was respected. Local preview had the pre-existing Cloudflare RUM localhost CORS error; inspector had no observed script errors. Native iOS/Safari/Android hardware not tested.

This improvement is a usefulness experiment and a proven resource-load repair. It is not proof of Google's underlying selection reason, indexing, ranking, AI recommendation, or attributed downloads. No unchanged-page indexing requests are made.
