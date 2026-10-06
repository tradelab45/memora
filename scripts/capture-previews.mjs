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
  await page.waitForTimeout(2000);

  // 1. Hero 3D Book Stage
  console.log("Capturing Hero section...");
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_hero.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_hero.png"),
    path.join(ARTIFACT_DIR, "preview_hero.png")
  );



  // 2. Auth & Story Vault Card
  console.log("Capturing Auth & Vault section...");
  const authSection = page.locator("#account");
  if (await authSection.isVisible()) {
    await authSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(DOCS_DIR, "preview_auth_vault.png"),
    });
    fs.copyFileSync(
      path.join(DOCS_DIR, "preview_auth_vault.png"),
      path.join(ARTIFACT_DIR, "preview_auth_vault.png")
    );
  }

  // 3. Spatial Deep-Dive Portal
  console.log("Capturing Deep Dive section...");
  const deepDiveSection = page.locator("#deep-dive");
  if (await deepDiveSection.isVisible()) {
    await deepDiveSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const diveTrigger = page.locator(".portal-dive-trigger");
    if (await diveTrigger.isVisible()) {
      await diveTrigger.click();
      await page.waitForTimeout(800);
    }
    await page.screenshot({
      path: path.join(DOCS_DIR, "preview_deep_dive.png"),
    });
    fs.copyFileSync(
      path.join(DOCS_DIR, "preview_deep_dive.png"),
      path.join(ARTIFACT_DIR, "preview_deep_dive.png")
    );
  }

  // 4. Interactive Timeline
  console.log("Capturing Timeline section...");
  const timelineSection = page.locator("#timeline");
  await timelineSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_timeline.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_timeline.png"),
    path.join(ARTIFACT_DIR, "preview_timeline.png")
  );

  // 5. Spotlight Cards Memories Gallery
  console.log("Capturing Memories gallery...");
  const memoriesSection = page.locator("#memories");
  await memoriesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_memories.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_memories.png"),
    path.join(ARTIFACT_DIR, "preview_memories.png")
  );

  // 6. 3D Living Magazine Flipbook Modal
  console.log("Capturing Living Flipbook Modal...");
  const flipTrigger = page.getByRole("button", { name: "Flip through a sample" });
  await flipTrigger.scrollIntoViewIfNeeded();
  await flipTrigger.click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(DOCS_DIR, "preview_flipbook.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_flipbook.png"),
    path.join(ARTIFACT_DIR, "preview_flipbook.png")
  );

  // 6a. AR QuickLook 1:1 Scale Modal
  console.log("Capturing AR QuickLook 1:1 modal...");
  const arButton = page.locator(".reader-ar-btn").first();
  if (await arButton.isVisible()) {
    await arButton.click();
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(DOCS_DIR, "preview_ar_modal.png"),
    });
    fs.copyFileSync(
      path.join(DOCS_DIR, "preview_ar_modal.png"),
      path.join(ARTIFACT_DIR, "preview_ar_modal.png")
    );
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }

  // 6a-2. Archival Order & Checkout Modal
  console.log("Capturing Archival Order & Checkout modal...");
  const orderButton = page.locator(".reader-order-btn").first();
  if (await orderButton.isVisible()) {
    await orderButton.click();
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(DOCS_DIR, "preview_order_modal.png"),
    });
    fs.copyFileSync(
      path.join(DOCS_DIR, "preview_order_modal.png"),
      path.join(ARTIFACT_DIR, "preview_order_modal.png")
    );
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }

  // 6b. Archival Print Specifications & Spine Inspector Drawer
  console.log("Capturing Print Specs Drawer with Live Spine Thickness & CMYK Soft-Proofing...");
  const printSpecsBtn = page.getByRole("button", { name: "View fine-art print specifications" });
  if (await printSpecsBtn.isVisible()) {
    await printSpecsBtn.click();
    await page.waitForTimeout(600);
    // Also toggle CMYK soft-proofing to demonstrate authentic eggshell paper absorption
    const cmykBtn = page.locator(".cmyk-toggle-btn").first();
    if (await cmykBtn.isVisible()) {
      await cmykBtn.click();
      await page.waitForTimeout(400);
    }
    await page.screenshot({
      path: path.join(DOCS_DIR, "preview_print_specs.png"),
    });
    fs.copyFileSync(
      path.join(DOCS_DIR, "preview_print_specs.png"),
      path.join(ARTIFACT_DIR, "preview_print_specs.png")
    );
  }

  // Close flipbook modal
  const closeBtn = page.getByRole("button", { name: "Close book preview" });
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 7. Soundtrack & Streaming Services Sheet
  console.log("Capturing Soundtrack Sheet...");
  const soundtrackBtn = page.locator(".soundtrack-header-btn").first();
  if (await soundtrackBtn.isVisible()) {
    await soundtrackBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(DOCS_DIR, "preview_soundtrack.png"),
    });
    fs.copyFileSync(
      path.join(DOCS_DIR, "preview_soundtrack.png"),
      path.join(ARTIFACT_DIR, "preview_soundtrack.png")
    );
  }

  await context.close();

  // 8. Mobile Viewport (iPhone 13) with Bottom Navigation Dock
  console.log("Capturing Mobile Viewport with Navigation Dock...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1200);
  await mobilePage.screenshot({
    path: path.join(DOCS_DIR, "preview_mobile.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_mobile.png"),
    path.join(ARTIFACT_DIR, "preview_mobile.png")
  );

  // 9. Story Studio with Google Vault & AI Caption Helper
  console.log("Capturing Story Studio...");
  await mobilePage.goto("http://127.0.0.1:3000/studio", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(DOCS_DIR, "preview_studio_vault.png"),
  });
  fs.copyFileSync(
    path.join(DOCS_DIR, "preview_studio_vault.png"),
    path.join(ARTIFACT_DIR, "preview_studio_vault.png")
  );

  await mobileContext.close();
  await browser.close();
  console.log("All previews successfully captured and copied to artifact directory!");
}

run().catch((err) => {
  console.error("Error capturing previews:", err);
  process.exit(1);
});
