import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WIDTH = 1080;
const HEIGHT = 1440;
const POST_COUNT = 7;
const OUT_DIR = path.resolve(__dirname, "..", "..", "dist", "xiaohongshu-us");

function postListFromArgv() {
  const raw = process.argv[2];
  if (raw === undefined) {
    return Array.from({ length: POST_COUNT }, (_, k) => k + 1);
  }
  const s = String(raw).trim().toLowerCase();
  const m = /^(?:post)?-?([1-7])$/.exec(s);
  if (!m) {
    throw new Error(`Usage: node export.mjs [1-${POST_COUNT}]  (e.g. node export.mjs 3)`);
  }
  return [Number(m[1])];
}

async function waitPostImagesReady(page, postNum) {
  await page.waitForFunction(
    (n) => {
      const post = document.querySelector(`[data-post="${n}"]`);
      if (!post) return true;
      const imgs = Array.from(post.querySelectorAll("img"));
      if (imgs.length === 0) return true;
      return imgs.every((img) => img.complete && img.naturalWidth > 0);
    },
    postNum,
    { timeout: 25000 },
  );
}

async function main() {
  const htmlPath = path.join(__dirname, "posts.html");
  if (!fs.existsSync(htmlPath)) throw new Error(`Missing ${htmlPath}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const url = pathToFileURL(htmlPath).href;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 400));

  const posts = postListFromArgv();

  for (const n of posts) {
    await page.evaluate((num) => {
      document.querySelectorAll("[data-post]").forEach((el) => {
        el.style.display = el.getAttribute("data-post") === String(num) ? "block" : "none";
      });
    }, n);
    await waitPostImagesReady(page, n);
    const waitMs = n === 1 ? 800 : n >= 3 ? 600 : 350;
    await new Promise((r) => setTimeout(r, waitMs));

    const outFile = path.join(OUT_DIR, `post-${n}.png`);
    await page.screenshot({
      path: outFile,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
      animations: "disabled",
    });
    process.stdout.write(`Wrote ${outFile}\n`);
  }

  await browser.close();
  process.stdout.write("Done.\n");
}

await main();
