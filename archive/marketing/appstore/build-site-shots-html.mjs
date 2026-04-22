import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = { config: path.join(__dirname, "site-shots.json"), out: path.join(__dirname, "generated", "shots.html") };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function usage() {
  return `Usage:
  node build-site-shots-html.mjs [--config ./site-shots.json] [--out ./generated/shots.html]
`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertOnce(haystack, needle, label) {
  const first = haystack.indexOf(needle);
  if (first === -1) throw new Error(`Missing marker: ${label}`);
  const second = haystack.indexOf(needle, first + needle.length);
  if (second !== -1) throw new Error(`Duplicate marker: ${label}`);
}

function extractShotHtml(indexHtml, shotId) {
  const begin = `<!-- APPSTORE_SHOT:BEGIN:${shotId} -->`;
  const end = `<!-- APPSTORE_SHOT:END:${shotId} -->`;

  assertOnce(indexHtml, begin, `${shotId} BEGIN`);
  assertOnce(indexHtml, end, `${shotId} END`);

  const i0 = indexHtml.indexOf(begin);
  const i1 = indexHtml.indexOf(end);
  if (i1 <= i0) throw new Error(`Invalid marker ordering for shot "${shotId}"`);

  return indexHtml.slice(i0 + begin.length, i1).trim();
}

function injectAfterHeadOpen(headInner, injection) {
  const idx = headInner.indexOf(">");
  if (idx === -1) throw new Error("Malformed <head> in index.html");
  // headInner starts with "<head ...>"
  return headInner.slice(0, idx + 1) + injection + headInner.slice(idx + 1);
}

function buildHeadFromIndex(indexHtml, baseHref) {
  const lower = indexHtml.toLowerCase();
  const headStart = lower.indexOf("<head");
  const headOpenEnd = lower.indexOf(">", headStart);
  const headEnd = lower.indexOf("</head>");
  if (headStart === -1 || headOpenEnd === -1 || headEnd === -1) throw new Error("Could not find <head>…</head> in index.html");

  // Includes the full opening <head ...> tag through the last character before "</head>"
  let headInner = indexHtml.slice(headStart, headEnd);

  headInner = headInner.replace(/<title>[\s\S]*?<\/title>/i, "<title>US Visa Photo — App Store site shots</title>");

  const baseTag = `\n    <base href="${baseHref}">\n`;
  headInner = injectAfterHeadOpen(headInner, baseTag);

  const extraCss = `
    <style>
      /* App Store shot canvases: sized by Playwright per-target via CSS variables on :root */
      :root { --shot-w: 1290px; --shot-h: 2796px; }
      html, body { height: 100%; }
      body { margin: 0; background: #ffffff; position: relative; }
      /* Stack every shot at (0,0); exporter toggles visibility one-at-a-time */
      .shot-root { position: absolute; left: 0; top: 0; width: var(--shot-w); height: var(--shot-h); overflow: hidden; }
      .shot-frame {
        width: var(--shot-w);
        height: var(--shot-h);
        overflow: hidden;
        position: relative;
        background: #ffffff;
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }
      .shot-stage {
        width: 100%;
        height: 100%;
        overflow: hidden;
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      /* Keep Tailwind sticky behavior from affecting export composition */
      nav.sticky { position: relative; top: auto; }
    </style>
`;

  return `${headInner}\n${extraCss}\n</head>`;
}

function buildBody(shots) {
  const blocks = shots
    .map((s) => {
      const id = String(s.id);
      const title = String(s.title ?? id);
      return `
  <section class="shot-root" id="shot-${id}" aria-label="${title.replaceAll('"', "&quot;")}">
    <div class="shot-frame">
      <div class="shot-stage">
${s.html}
      </div>
    </div>
  </section>`;
    })
    .join("\n");

  return `<body>
${blocks}

  <script>lucide.createIcons();</script>
</body>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage());
    return;
  }

  const cfgPath = path.isAbsolute(args.config) ? args.config : path.resolve(process.cwd(), args.config);
  const cfg = readJson(cfgPath);

  const indexRel = cfg.indexHtml ?? "../../index.html";
  const indexPath = path.isAbsolute(indexRel) ? indexRel : path.resolve(path.dirname(cfgPath), indexRel);
  const indexHtml = fs.readFileSync(indexPath, "utf8");

  const siteRootDir = path.resolve(indexPath, "..");
  const baseHref = pathToFileURL(path.join(siteRootDir, path.sep)).href;

  const shotsCfg = cfg.shots;
  if (!Array.isArray(shotsCfg) || shotsCfg.length === 0) throw new Error(`Invalid "shots" in ${cfgPath}`);

  const shots = shotsCfg.map((s) => {
    if (!s?.id) throw new Error(`Shot missing id in ${cfgPath}`);
    return { id: String(s.id), title: s.title ? String(s.title) : String(s.id), html: extractShotHtml(indexHtml, String(s.id)) };
  });

  const head = buildHeadFromIndex(indexHtml, baseHref);
  const body = buildBody(shots);
  const doc = `<!DOCTYPE html>\n<html lang="en">\n${head}\n${body}\n</html>\n`;

  const outPath = path.isAbsolute(args.out) ? args.out : path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, doc, "utf8");

  process.stdout.write(`Wrote ${outPath}\n`);
}

await main();
