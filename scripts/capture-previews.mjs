import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/Admin/.gemini/antigravity/brain/443aaf06-07b0-4cd3-a4b8-5dbbf6982886";
const DOCS_DIR = path.resolve("docs/previews");

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  console.log("Navigating to http://127.0.0.1:3000/ ...");
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // 1. Hero 3D Book Stage
  console.log("Capturing Hero section...");
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_hero.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_hero.png"),
    path.join(ARTIFACT_DIR, "preview_hero.png")
  );

  // 2. Spatial Deep-Dive Portal
  console.log("Capturing Deep Dive section...");
  const deepDiveSection = page.locator("#deep-dive");
  await deepDiveSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Trigger the manual dive button so we see the inside liquid glass cards
  const diveTrigger = page.locator(".portal-dive-trigger");
  if (await diveTrigger.isVisible()) {
    await diveTrigger.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_deep_dive.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_deep_dive.png"),
    path.join(ARTIFACT_DIR, "preview_deep_dive.png")
  );

  // 3. Interactive Timeline
  console.log("Capturing Timeline section...");
  const timelineSection = page.locator("#timeline");
  await timelineSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_timeline.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_timeline.png"),
    path.join(ARTIFACT_DIR, "preview_timeline.png")
  );

  // 4. Spotlight Cards Memories Gallery
  console.log("Capturing Memories gallery...");
  const memoriesSection = page.locator("#memories");
  await memoriesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_memories.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_memories.png"),
    path.join(ARTIFACT_DIR, "preview_memories.png")
  );

  // 5. 3D Living Magazine Flipbook Modal
  console.log("Capturing Living Flipbook Modal...");
  const flipTrigger = page.getByRole("button", { name: "Flip through a sample" });
  await flipTrigger.scrollIntoViewIfNeeded();
  await flipTrigger.click();
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_flipbook.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_flipbook.png"),
    path.join(ARTIFACT_DIR, "preview_flipbook.png")
  );

  await browser.close();
  console.log("All previews successfully captured and copied to artifact directory!");
}

run().catch((err) => {
  console.error("Error capturing previews:", err);
  process.exit(1);
});
