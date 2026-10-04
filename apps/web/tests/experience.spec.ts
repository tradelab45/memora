import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("landing is responsive and all concept sections are reachable", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Life happens. Keep the feeling." }),
  ).toBeVisible();
  await expect(
    page.getByRole("group", {
      name: "The Days Between: a sample MEMORA memory book",
    }),
  ).toBeVisible();
  if (process.env.MEMORA_CAPTURE)
    await page.screenshot({
      path: "../../docs/previews/" + testInfo.project.name + ".png",
      fullPage: false,
    });
  for (const id of [
    "experience",
    "timeline",
    "people",
    "memories",
    "books",
    "privacy",
    "faq",
  ]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded();
    await expect(page.locator("#" + id)).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test("cinematic chapters reveal a usable app with accessible library controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const experience = page.locator("#experience");
  const appLayer = experience.locator("#experience-app");
  const app = experience.getByTestId("app-preview");
  const enhanced = await page.evaluate(
    () =>
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.innerHeight >= 600,
  );
  await expect(experience).toHaveAttribute("data-enhanced", String(enhanced));

  const scrollChapter = async (progress: number) => {
    await experience.evaluate((section, fraction) => {
      const top = window.scrollY + section.getBoundingClientRect().top;
      const distance = section.clientHeight - window.innerHeight + 72;
      window.scrollTo({
        top: top - 72 + distance * fraction,
        behavior: "instant",
      });
    }, progress);
  };

  if (enhanced) {
    await expect(experience).toHaveAttribute("data-chapter", "0");
    await expect(appLayer).toHaveAttribute("inert", "");
    await expect(app.getByRole("tab")).toHaveCount(0);
    await scrollChapter(0.56);
    await expect(experience).toHaveAttribute("data-chapter", "1");
    await expect(experience.locator(".cinema-memory")).toBeVisible();
    await expect(appLayer).toHaveAttribute("inert", "");
    // A late photograph load refreshes geometry without resetting the chapter.
    await experience.locator(".cinema-memory-photo img").evaluate((image) => {
      image.dispatchEvent(new Event("load"));
    });
    await expect
      .poll(() =>
        experience.evaluate((section) =>
          Number(section.style.getPropertyValue("--chapter-progress")),
        ),
      )
      .toBeGreaterThan(0.5);
    await expect(experience).toHaveAttribute("data-chapter", "1");
    await scrollChapter(0.97);
  }
  await expect(experience).toHaveAttribute("data-chapter", "2");
  await expect(appLayer).not.toHaveAttribute("inert", "");
  await expect(app).toBeVisible();

  const memoriesTab = app.getByRole("tab", { name: "Memories", exact: true });
  const peopleTab = app.getByRole("tab", { name: "People", exact: true });
  const booksTab = app.getByRole("tab", { name: "Books", exact: true });
  await expect(memoriesTab).toHaveAttribute("aria-selected", "true");
  await memoriesTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(peopleTab).toBeFocused();
  await expect(peopleTab).toHaveAttribute("aria-selected", "true");
  await expect(
    app.getByRole("tabpanel", { name: "People", exact: true }),
  ).toContainText("Ordinary, wonderful.");
  await page.keyboard.press("ArrowRight");
  await expect(booksTab).toBeFocused();
  await expect(booksTab).toHaveAttribute("aria-selected", "true");
  await expect(
    app.getByRole("tabpanel", { name: "Books", exact: true }),
  ).toContainText("All together.");
  await page.keyboard.press("Home");
  await expect(memoriesTab).toBeFocused();
  await expect(memoriesTab).toHaveAttribute("aria-selected", "true");
  const memory = app.getByRole("button", {
    name: "View memory: Ordinary, wonderful.",
    exact: true,
  });
  await memory.click();
  await expect(memory).toHaveAttribute("aria-pressed", "true");
  await expect(
    app
      .getByRole("tabpanel", { name: "Memories", exact: true })
      .getByRole("heading", { name: "Ordinary, wonderful.", exact: true }),
  ).toBeVisible();
  await expect(
    app.getByRole("link", { name: "Open the studio", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(
    await app.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1,
    ),
  ).toBeTruthy();
  const results = await new AxeBuilder({ page })
    .include("#experience-app")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  if (enhanced) {
    await scrollChapter(0);
    await expect(experience).toHaveAttribute("data-chapter", "0");
    await expect(appLayer).toHaveAttribute("inert", "");
    await experience
      .getByRole("button", { name: "Skip to the app", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await expect(experience).toHaveAttribute("data-chapter", "2");
    await expect(appLayer).not.toHaveAttribute("inert", "");
    await expect(
      app.getByRole("link", { name: "Open the studio", exact: true }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("sample story keeps a caption and book preview supports keyboard navigation", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Find the little moments" }).click();
  await page
    .getByLabel("One line you’ll want to remember.")
    .fill("Dad took the scenic route. I am glad we did.");
  await page.getByRole("button", { name: "Keep this memory" }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.getByRole("button", { name: "See your book" }).click();
  await page.getByRole("button", { name: "Flip through a sample" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Dad took the scenic route. I am glad we did.",
  );
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("dialog")).toContainText("Page 2 of 3");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog")).toContainText("Page 1 of 3");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Flip through a sample" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Reset sample" }).click();
  await expect(
    page.getByRole("heading", { name: "Who makes your world?" }),
  ).toBeVisible();
});

test("timeline years support keyboard navigation and announce the selected memory", async ({
  page,
}) => {
  await page.goto("/");
  const timeline = page.locator("#timeline");
  const lastYear = timeline.getByRole("tab", { name: "2026", exact: true });
  await lastYear.focus();
  await expect(lastYear).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("Home");
  const firstYear = timeline.getByRole("tab", { name: "2020", exact: true });
  await expect(firstYear).toBeFocused();
  await expect(firstYear).toHaveAttribute("aria-selected", "true");
  await expect(
    timeline.getByRole("tabpanel", { name: "2020", exact: true }),
  ).toContainText("The long way home.");

  await page.keyboard.press("ArrowRight");
  const secondYear = timeline.getByRole("tab", { name: "2022", exact: true });
  await expect(secondYear).toBeFocused();
  await expect(secondYear).toHaveAttribute("aria-selected", "true");
  await expect(
    timeline.getByRole("tabpanel", { name: "2022", exact: true }),
  ).toContainText("A little further.");

  await page.keyboard.press("End");
  await expect(lastYear).toBeFocused();
  await expect(lastYear).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await expect(firstYear).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(lastYear).toBeFocused();
  await expect(timeline.getByRole("tabpanel")).toHaveCount(1);
});

test("frequently asked questions can be expanded and closed with a keyboard", async ({
  page,
}) => {
  await page.goto("/");
  for (const question of [
    "Can I try MEMORA without an account?",
    "Are my photos uploaded?",
    "Can I print my book?",
    "Is face recognition available yet?",
  ]) {
    const summary = page.locator("#faq summary").filter({ hasText: question });
    const disclosure = summary.locator("..");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(disclosure.locator("p")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(disclosure).not.toHaveAttribute("open", "");
  }
});

test("motion can be paused while the story remains usable", async ({
  page,
}) => {
  await page.goto("/");
  const reduced = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  if (reduced) {
    const deviceMotion = page.getByRole("button", {
      name: "Motion reduced by device",
      exact: true,
    });
    await expect(deviceMotion).toHaveAttribute("aria-pressed", "true");
    await expect(deviceMotion).toBeDisabled();
    await expect(page.locator(".book-stage canvas")).toHaveCount(0);
  } else {
    const pause = page.getByRole("button", {
      name: "Pause motion",
      exact: true,
    });
    await expect(pause).toHaveAttribute("aria-pressed", "false");
    await pause.click();
  }

  if (!reduced) {
    await expect(
      page.getByRole("button", { name: "Enable motion", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".book-stage canvas")).toHaveCount(0);
  }
  const experience = page.locator("#experience");
  const app = experience.getByTestId("app-preview");
  await expect(experience).toHaveAttribute("data-enhanced", "false");
  await expect(experience.locator("#experience-app")).not.toHaveAttribute(
    "inert",
    "",
  );
  await app.getByRole("tab", { name: "People", exact: true }).click();
  await expect(
    app.getByRole("tabpanel", { name: "People", exact: true }),
  ).toContainText("Ordinary, wonderful.");
  await app.getByRole("link", { name: "Open the studio", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Who makes your world?" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "MEMORA home", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Life happens. Keep the feeling." }),
  ).toBeVisible();
  await expect(page.locator(".book-stage canvas")).toHaveCount(0);
  await expect(experience).toHaveAttribute("data-enhanced", "false");
  await expect(experience.locator("#experience-app")).not.toHaveAttribute(
    "inert",
    "",
  );
  if (!reduced) {
    await page
      .getByRole("button", { name: "Enable motion", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Pause motion", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
  }
});

test("book preview stays silent until enabled and respects page boundaries", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const OriginalAudioContext = window.AudioContext;
    if (!OriginalAudioContext) return;
    const tracked = window as unknown as { __memoraAudioStarts: number };
    tracked.__memoraAudioStarts = 0;
    window.AudioContext = new Proxy(OriginalAudioContext, {
      construct(target, args) {
        tracked.__memoraAudioStarts += 1;
        return Reflect.construct(target, args);
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const trigger = page
    .locator("#books")
    .getByRole("button", { name: "Flip through a sample" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Previous page", exact: true }),
  ).toBeDisabled();
  const enableSound = dialog.getByRole("button", {
    name: "Enable paper turn sounds",
    exact: true,
  });
  await expect(enableSound).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("Page 2 of 3");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("Page 3 of 3");
  await expect(
    dialog.getByRole("button", { name: "Next page", exact: true }),
  ).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("Page 3 of 3");
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __memoraAudioStarts?: number })
          .__memoraAudioStarts ?? 0,
    ),
  ).toBe(0);

  await enableSound.click();
  const muteSound = dialog.getByRole("button", {
    name: "Mute paper turn sounds",
    exact: true,
  });
  await expect(muteSound).toHaveAttribute("aria-pressed", "true");
  await muteSound.click();
  await expect(
    dialog.getByRole("button", {
      name: "Enable paper turn sounds",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "false");
  await dialog
    .getByRole("button", { name: "Jump to page 1", exact: true })
    .click();
  await expect(dialog).toContainText("Page 1 of 3");
  await expect(
    dialog.getByRole("button", { name: "Previous page", exact: true }),
  ).toBeDisabled();
  expect(
    await dialog.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1,
    ),
  ).toBeTruthy();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});
test("empty people selection blocks progression", async ({ page }) => {
  await page.goto("/studio");
  for (const name of ["Mom", "Dad", "Arjun"])
    await page.getByRole("button", { name: new RegExp(name) }).click();
  await expect(
    page.getByRole("button", { name: "Find the little moments" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "02 Your memories" }),
  ).toBeDisabled();
});
test("sample data resets on reload and makes no third-party requests", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
      external.push(request.url());
  });
  await page.goto("/studio");
  await page.getByRole("button", { name: "Find the little moments" }).click();
  await page
    .getByLabel("One line you’ll want to remember.")
    .fill("Temporary private text");
  await page.getByRole("button", { name: "Keep this memory" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Who makes your world?" }),
  ).toBeVisible();
  expect(external).toEqual([]);
});

test("book includes only the chosen people", async ({ page }) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: /Mom/ }).click();
  await page.getByRole("button", { name: /Arjun/ }).click();
  await page.getByRole("button", { name: "Find the little moments" }).click();
  await page.getByRole("button", { name: "See your book" }).click();
  await page.getByRole("button", { name: "Flip through a sample" }).click();
  await expect(page.getByRole("dialog")).toContainText("With Dad.");
  await expect(page.getByRole("dialog")).toContainText("Page 1 of 1");
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
});

test("landing and sample studio pass accessibility scans", async ({ page }) => {
  for (const route of ["/", "/studio", "/privacy"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
