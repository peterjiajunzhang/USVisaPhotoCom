import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = {
    shotsHtml: path.join(__dirname, "generated", "shots.html"),
    targets: path.join(__dirname, "targets.json"),
    shotConfig: path.join(__dirname, "site-shots.json"),
    outDir: path.resolve(__dirname, "..", "..", "dist", "appstore-site"),
    settleMs: 1500,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--shots") args.shotsHtml = argv[++i];
    else if (a === "--targets") args.targets = argv[++i];
    else if (a === "--config") args.shotConfig = argv[++i];
    else if (a === "--out") args.outDir = argv[++i];
    else if (a === "--settle-ms") args.settleMs = Number(argv[++i]);
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function usage() {
  return `Usage:
  node export-site-shots.mjs [--shots ./generated/shots.html] [--targets ./targets.json] [--config ./site-shots.json] [--out ../../dist/appstore-site]

Notes:
  - Run \`node build-site-shots-html.mjs\` first to generate ./generated/shots.html
  - Opens shots via file:// (no local web server)
  - Targets may set "layoutViewportCssWidth" (e.g. 428) smaller than "width": CSS layout uses the narrow width so Tailwind max-width breakpoints look like a phone; deviceScaleFactor is chosen so width×scale equals the final PNG width (App Store Connect size).
`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage());
    return;
  }

  const shotsPath = path.isAbsolute(args.shotsHtml) ? args.shotsHtml : path.resolve(process.cwd(), args.shotsHtml);
  if (!fs.existsSync(shotsPath)) {
    throw new Error(`Missing ${shotsPath}. Run: node build-site-shots-html.mjs`);
  }

  const targetsPath = path.isAbsolute(args.targets) ? args.targets : path.resolve(process.cwd(), args.targets);
  const targets = readJson(targetsPath);
  if (!Array.isArray(targets) || targets.length === 0) throw new Error(`Invalid targets JSON: ${targetsPath}`);

  const cfgPath = path.isAbsolute(args.shotConfig) ? args.shotConfig : path.resolve(process.cwd(), args.shotConfig);
  const cfg = readJson(cfgPath);
  const shotIds = (cfg.shots ?? []).map((s) => String(s.id));
  if (!Array.isArray(cfg.shots) || shotIds.length === 0) throw new Error(`Invalid shot list in ${cfgPath}`);

  const outDir = path.isAbsolute(args.outDir) ? args.outDir : path.resolve(process.cwd(), args.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const shotsUrl = pathToFileURL(shotsPath).href;

  const browser = await chromium.launch({ headless: true });
  try {
    for (const t of targets) {
      const w = Number(t.width);
      const h = Number(t.height);
      const name = String(t.name);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) throw new Error(`Invalid target entry: ${JSON.stringify(t)}`);

      const layoutW =
        t.layoutViewportCssWidth != null && t.layoutViewportCssWidth !== ""
          ? Number(t.layoutViewportCssWidth)
          : w;
      if (!Number.isFinite(layoutW) || layoutW <= 0 || layoutW > w) {
        throw new Error(`Invalid layoutViewportCssWidth for ${name}: ${JSON.stringify(t.layoutViewportCssWidth)}`);
      }

      const layoutH = layoutW === w ? h : Math.round((h * layoutW) / w);
      const deviceScaleFactor = layoutW === w ? 1 : w / layoutW;
      if (!Number.isFinite(deviceScaleFactor) || deviceScaleFactor < 1) {
        throw new Error(`Invalid deviceScaleFactor for ${name}: width/layoutWidth must be >= 1`);
      }
      if (Math.abs(deviceScaleFactor - Math.round(deviceScaleFactor)) > 1e-6) {
        throw new Error(
          `width (${w}) / layoutViewportCssWidth (${layoutW}) must be an integer for crisp PNGs; got ${deviceScaleFactor}`,
        );
      }

      const context = await browser.newContext({
        viewport: { width: layoutW, height: layoutH },
        deviceScaleFactor: Math.round(deviceScaleFactor),
      });
      const page = await context.newPage();

      await page.goto(shotsUrl, { waitUntil: "load" });

      await page.addStyleTag({
        content: `
          :root { --shot-w: ${layoutW}px; --shot-h: ${layoutH}px; }
        `,
      });

      await page.evaluate(() => {
        if (window.lucide?.createIcons) window.lucide.createIcons();
      });

      // Give Tailwind CDN + Lucide a moment; also allows short entrance animations to finish.
      const settleMs = Number.isFinite(args.settleMs) ? args.settleMs : 1500;
      await sleep(settleMs);

      const targetDir = path.join(outDir, name);
      fs.mkdirSync(targetDir, { recursive: true });

      for (const id of shotIds) {
        const ok = await page.evaluate((shotId) => {
          const roots = Array.from(document.querySelectorAll(".shot-root"));
          if (!roots.length) return { ok: false, reason: "no-shot-roots" };

          for (const el of roots) {
            el.style.display = "none";
          }

          const active = document.querySelector(`#shot-${shotId}`);
          if (!active) return { ok: false, reason: "missing-shot" };

          active.style.display = "block";

          const stage = active.querySelector(".shot-stage");
          if (stage) stage.scrollTop = 0;

          if (window.lucide?.createIcons) window.lucide.createIcons();
          return { ok: true };
        }, id);

        if (!ok?.ok) throw new Error(`Failed to activate shot "${id}" (${ok?.reason ?? "unknown"})`);

        // Re-run icons after visibility changes (some browsers skip inert subtrees during initial passes).
        await page.evaluate(() => {
          if (window.lucide?.createIcons) window.lucide.createIcons();
        });

        // Compliance checklist uses short CSS animations; give the freshly-shown subtree a beat.
        await sleep(250);

        // Scale tall landing sections to fit one App Store frame (mobile layout can still overflow vertically).
        await page.evaluate((shotId) => {
          const active = document.querySelector(`#shot-${shotId}`);
          if (!active) return;
          const stage = active.querySelector(".shot-stage");
          if (!stage) return;
          const inner = stage.firstElementChild;
          if (!inner || !(inner instanceof HTMLElement)) return;

          inner.style.transformOrigin = "top center";
          inner.style.transform = "";
          inner.style.marginLeft = "auto";
          inner.style.marginRight = "auto";

          const pad = 0;
          const availW = stage.clientWidth - pad * 2;
          const availH = stage.clientHeight - pad * 2;
          const sw = Math.max(inner.scrollWidth, inner.getBoundingClientRect().width);
          const sh = Math.max(inner.scrollHeight, inner.getBoundingClientRect().height);
          const scale = Math.min(1, availW / sw, availH / sh);
          if (scale < 1) inner.style.transform = `scale(${scale})`;
        }, id);

        const handle = await page.$(`#shot-${id}`);
        if (!handle) throw new Error(`Missing #shot-${id} in ${shotsPath}`);

        const box = await handle.boundingBox();
        if (!box) throw new Error(`No bounding box for #shot-${id} @ ${name}`);

        // Shot root fills the CSS viewport; PNG pixel size is viewport × deviceScaleFactor (= w×h).
        if (Math.abs(box.width - layoutW) > 1 || Math.abs(box.height - layoutH) > 1) {
          throw new Error(
            `Unexpected #shot-${id} size ${Math.round(box.width)}×${Math.round(box.height)} (expected ${layoutW}×${layoutH})`,
          );
        }
        if (Math.abs(box.x) > 1 || Math.abs(box.y) > 1) {
          throw new Error(`Unexpected #shot-${id} position (${box.x}, ${box.y}) — expected top-left at (0, 0)`);
        }

        const outFile = path.join(targetDir, `${id}.png`);
        await page.screenshot({
          path: outFile,
          clip: { x: 0, y: 0, width: layoutW, height: layoutH },
          animations: "disabled",
        });
      }

      process.stdout.write(`Wrote ${shotIds.length} PNGs → ${targetDir}\n`);
      await context.close();
    }
  } finally {
    await browser.close();
  }

  process.stdout.write(`Done.\n`);
}

await main();
