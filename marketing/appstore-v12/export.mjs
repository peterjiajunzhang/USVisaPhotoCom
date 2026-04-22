import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WIDTH = 1284;
const HEIGHT = 2778;
const SLIDE_COUNT = 5;
const OUT_DIR = path.resolve(__dirname, "..", "..", "dist", "appstore-v12", "iphone_6_5");

/** Wait until every <img> in the visible slide has decoded (fixes empty grid cells on slide 2). */
async function waitSlideImagesReady(page, slideNum) {
  await page.waitForFunction(
    (n) => {
      const slide = document.querySelector(`[data-slide="${n}"]`);
      if (!slide) return true;
      const imgs = Array.from(slide.querySelectorAll("img"));
      if (imgs.length === 0) return true;
      return imgs.every((img) => img.complete && img.naturalWidth > 0);
    },
    slideNum,
    { timeout: 25000 },
  );
}

async function main() {
  const htmlPath = path.join(__dirname, "campaign.html");
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

  /* Decode images for every slide once (some browsers defer off-screen images). */
  for (let pre = 1; pre <= SLIDE_COUNT; pre++) {
    await page.evaluate((n) => {
      document.querySelectorAll("[data-slide]").forEach((el) => {
        el.style.display = el.getAttribute("data-slide") === String(n) ? "block" : "none";
      });
    }, pre);
    await waitSlideImagesReady(page, pre);
    await new Promise((r) => setTimeout(r, 200));
  }

  for (let i = 1; i <= SLIDE_COUNT; i++) {
    await page.evaluate((n) => {
      document.querySelectorAll("[data-slide]").forEach((el) => {
        el.style.display = el.getAttribute("data-slide") === String(n) ? "block" : "none";
      });
    }, i);
    await waitSlideImagesReady(page, i);
    await new Promise((r) => setTimeout(r, 350));

    const outFile = path.join(OUT_DIR, `slide-${i}.png`);
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
