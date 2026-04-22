import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = { config: "screenshots.json", targets: "targets.json", out: "../../dist/appstore" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config") args.config = argv[++i];
    else if (a === "--targets") args.targets = argv[++i];
    else if (a === "--out") args.out = argv[++i];
  }
  return args;
}

function deepMerge(base, override) {
  const b = base === undefined ? {} : structuredClone(base);
  if (!override) return b;
  const out = b;
  for (const [k, v] of Object.entries(override)) {
    if (v && typeof v === "object" && !Array.isArray(v) && typeof out[k] === "object" && out[k] && !Array.isArray(out[k])) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function mergeCopy(cfg, screen) {
  return deepMerge(cfg.defaults?.copy ?? {}, screen.copy ?? {});
}

async function readJson(p) {
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function mimeForPath(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/png";
}

async function toDataUrl(absPath) {
  const buf = await fs.readFile(absPath);
  const mime = mimeForPath(absPath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function downscalePngToDataUrlSync(absPath, maxSide) {
  // Pillow is already available in this environment; keeps HTML small for Playwright.
  const py = `
import sys
from PIL import Image
p = sys.argv[1]
max_side = int(sys.argv[2])
im = Image.open(p).convert('RGB')
w, h = im.size
m = max(w, h)
if m > max_side:
    s = max_side / m
    im = im.resize((max(1,int(w*s)), max(1,int(h*s))), Image.Resampling.LANCZOS)
buf = __import__('io').BytesIO()
im.save(buf, format='JPEG', quality=88, optimize=True)
import base64
print('data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode('ascii'))
`.trim();

  const res = spawnSync("python3", ["-c", py, absPath, String(maxSide)], { encoding: "utf8" });
  if (res.status !== 0) {
    throw new Error(`downscale failed for ${absPath}: ${res.stderr || res.stdout}`);
  }
  return res.stdout.trim();
}

async function assetToDataUrl(absPath) {
  const mime = mimeForPath(absPath);
  if (mime === "image/png") {
    try {
      return downscalePngToDataUrlSync(absPath, 1600);
    } catch {
      // fall back
    }
  }
  return toDataUrl(absPath);
}

async function main() {
  const { config, targets, out } = parseArgs(process.argv);

  const cfgPath = path.resolve(__dirname, config);
  const targetsPath = path.resolve(__dirname, targets);
  const outRoot = path.resolve(__dirname, out);

  const [cfg, targetList] = await Promise.all([readJson(cfgPath), readJson(targetsPath)]);

  const templatePath = path.resolve(__dirname, "template.html");
  const templateHtml = await fs.readFile(templatePath, "utf8");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const t of targetList) {
    const tw = t.width;
    const th = t.height;
    if (!tw || !th) throw new Error(`Invalid target: ${JSON.stringify(t)}`);

    const targetDir = path.join(outRoot, t.name);
    await ensureDir(targetDir);

    for (const screen of cfg.screens) {
      const background = deepMerge(cfg.defaults?.background ?? {}, screen.background ?? {});
      const card = deepMerge(cfg.defaults?.card ?? {}, screen.card ?? {});
      const deviceFrame = deepMerge(cfg.defaults?.deviceFrame ?? {}, screen.deviceFrame ?? {});
      const copy = mergeCopy(cfg, screen);

      const assetAbs = path.resolve(path.dirname(cfgPath), screen.asset.path);
      const assetDataUrl = await assetToDataUrl(assetAbs);

      const shotCfg = {
        width: tw,
        height: th,
        background,
        card,
        copy,
        deviceFrame,
        assetUrl: assetDataUrl,
      };

      // Inject config before template scripts run: append a script right after <head>
      const injected = `<script>window.__SHOT__=${JSON.stringify(shotCfg)};<\/script>`;
      const html = templateHtml.replace("<head>", `<head>\n    ${injected}\n`);

      await page.setViewportSize({ width: tw, height: th });
      await page.setContent(html, { waitUntil: "load" });
      await page.waitForFunction(() => {
        const img = document.getElementById("img");
        return Boolean(img && img.src && img.src.startsWith("data:"));
      });

      const outPng = path.join(targetDir, `${screen.id}.png`);
      await page.screenshot({
        path: outPng,
        type: "png",
        clip: { x: 0, y: 0, width: tw, height: th },
        timeout: 120000,
      });

      // eslint-disable-next-line no-console
      console.log("wrote", outPng);
    }
  }

  await browser.close();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
