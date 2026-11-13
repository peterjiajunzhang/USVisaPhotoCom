# 2026-11-12 indexing follow-up

Native Chrome was used for signed-in Google/Bing reports and local UI tests. Public receipts omit identities, private inspection IDs and unrelated tabs. The application repository search ledger holds backend observations and official sources.

Changes: inline official Lucide SVG after Google's actual redirect loading failure; a seven-language, browser-only JPEG inspector in the existing upload troubleshooting guide; homepage/index discovery links; truthful per-topic sitemap dates. No new app functionality or store metadata.

Follow-up live test at 17:39 returned HTTP 200/eligible but 20/30 resource errors and an unstyled screenshot. Public probes of six URLs using two UA strings returned 200; these are not verified Google-origin requests. Further hardening embeds the original CSS in cascade order, including flattened badge CSS; lazy-loads the 12 gallery images (16,046,132 source bytes); and replaces cross-host menu icons with local display derivatives (35,614 bytes). Image contents and store artwork remain intact. `payload-change.json` is source accounting, not CWV or actual transfer savings. `critical-render-validation.json` verifies seven pages, stable builds and stylesheet embedding. Final general reference count is 1813.

`static-validation.json`: 35 HTML pages, self canonical/OG, reciprocal hreflang, local resources/fragments, 38 sitemap URLs, protected policies/support/campaigns, repeatable build. Final pass checks all 14 discovery anchors and the five existing in-page tables of contents. The two native Chinese guides have no table of contents; their checker and discovery anchors are checked directly. An initial assertion incorrectly expected seven tables of contents; the final check follows actual page structure.

`file-check-tests.json`: 12 Node VM boundary/state tests with stubbed image decoder. Native Chrome separately verified real 600x600 JPEG decoding, renamed PNG rejection, and the exact 240000/240001 byte boundary. Fixtures are synthetic flat colors, not user photos. Reproduce on macOS:

```sh
python3 scripts/make_file_check_fixtures.py /tmp/us-file-check-fixtures
node scripts/test_file_check.cjs /tmp/us-file-check-fixtures
```

`checker-320.png`, `checker-390.png`, `checker-1440.png`: Chrome device-toolbar viewport captures (device-pixel ratio may exceed 1). Tablet 768px also reviewed visually. They show synthetic data only. Measured zero-overflow assertions were not obtained: DevTools console paste protection was respected. Local preview had the pre-existing Cloudflare RUM localhost CORS error; inspector had no observed script errors. Native iOS/Safari/Android hardware not tested.

This improvement is a usefulness experiment and a proven resource-load repair. It is not proof of Google's underlying selection reason, indexing, ranking, AI recommendation, or attributed downloads. No unchanged-page indexing requests are made.

Final production verification: commit `7d08e37` built; 34 public files matched. Google 17:51 live test HTTP 200/eligible, only 1/22 resources failed (Cloudflare beacon), no console messages; smartphone screenshot styled correctly with both store badges. Updated homepage and upload guide indexing requests were accepted into the priority queue. Google sitemap statuses remained Success / 7 root and 38 US, last read Nov 11; not resubmitted. No indexing confirmation or ranking gain was observed. IndexNow 200 covered the first-stage 21 actual content changes; later homepage hardening did not repeatedly notify the same list. `search-notifications.json` records exact scope. The local preview was closed; live Chinese tool remains open for the user.
