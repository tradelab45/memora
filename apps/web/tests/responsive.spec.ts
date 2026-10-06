import { test, expect } from "@playwright/test";

test("phones reach sign-in after a short hero and open samples only on request", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Phone-specific layout");
  await page.goto("/");
  const hero = page.locator("#experience");
  await expect(hero).toHaveAttribute("data-enhanced", "false");
  expect((await hero.boundingBox())!.height).toBeLessThan(700);
  await expect(page.locator("#experience-app")).toBeHidden();
  await expect(page.locator(".landing-details")).not.toHaveAttribute("open");

  await page
    .getByRole("link", { name: "Start your story", exact: true })
    .first()
    .click();
  await expect(page.locator("#sign-in")).toBeInViewport();

  await page
    .getByRole("button", { name: "Explore a sample", exact: true })
    .click();
  await expect(page.locator("#experience-app")).toBeVisible();
  await page
    .getByRole("button", { name: "Close the sample", exact: true })
    .click();
  await expect(page.locator("#experience-app")).toBeHidden();

  await page.getByText("Discover more about MEMORA", { exact: true }).click();
  await expect(page.locator(".landing-details")).toHaveAttribute("open", "");
  await expect(page.locator("#idea")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("phone navigation has usable destinations and touch targets", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Phone-specific navigation");
  await page.goto("/");
  const nav = page.getByRole("navigation", {
    name: "Mobile quick navigation",
    exact: true,
  });
  for (const [name, href] of [
    ["Home", "/"],
    ["Memories", "/studio?view=memories"],
    ["People", "/studio?view=people"],
    ["Book", "/studio?view=book"],
  ]) {
    const link = nav.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("href", href);
    const bounds = await link.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(
    nav.getByRole("link", { name: "Home", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "Memories", exact: true }).click();
  await expect(page).toHaveURL(/\/signin\?next=/);
});

test("editorial fonts load locally and desktop retains its cinematic sequence", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      body: getComputedStyle(document.body).fontFamily,
      title: getComputedStyle(document.querySelector("h1")!).fontFamily,
      loaded: [...document.fonts]
        .filter((font) => font.status === "loaded")
        .map((font) => font.family),
    };
  });
  expect(fonts.body).toContain("Plus Jakarta Sans");
  expect(fonts.title).toContain("Newsreader");
  expect(fonts.loaded).toContain("Newsreader");
  expect(fonts.loaded).toContain("Plus Jakarta Sans");
  if (testInfo.project.name === "desktop") {
    await expect(page.locator("#experience")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    await expect(page.locator(".landing-details")).toHaveAttribute("open", "");
  }
});
