import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const base = "http://localhost:3114";
const out = "screenshots";
mkdirSync(out, { recursive: true });

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath: chrome, headless: true });

async function makePage(theme, viewport, mobile = false) {
  const context = await browser.newContext({
    viewport,
    colorScheme: theme,
    ...(mobile ? { isMobile: true, hasTouch: true } : {}),
  });
  await context.addInitScript((value) => {
    window.localStorage.setItem("theme", value);
  }, theme);
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return { context, page, errors };
}

const { context, page, errors } = await makePage("light", {
  width: 1440,
  height: 1000,
});

await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1600);

const heroStyles = await page.evaluate(() => {
  const body = getComputedStyle(document.body);
  return {
    htmlClass: document.documentElement.className,
    background: body.backgroundColor,
    color: body.color,
    overflowX:
      document.documentElement.scrollWidth > window.innerWidth
        ? document.documentElement.scrollWidth
        : null,
  };
});
console.log("hero", JSON.stringify(heroStyles));

await page.screenshot({ path: `${out}/home-light-hero.png` });

for (const [id, file] of [
  ["about", "home-light-about.png"],
  ["skills", "home-light-skills.png"],
  ["projects", "home-light-projects.png"],
  ["certificates", "home-light-certificates.png"],
  ["contact", "home-light-contact.png"],
]) {
  const section = page.locator(`#${id}`);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${file}` });
}

await page.locator("#certificates button").first().click();
await page.waitForTimeout(2600);
await page.screenshot({ path: `${out}/certificate-modal-light.png` });
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

await page.goto(`${base}/projects`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/projects-light.png` });

await page.goto(`${base}/work/aroma-cafe`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/case-study-light.png` });

const details = page.locator("details").first();
if (await details.count()) {
  await details.locator("summary").click();
  await page.waitForTimeout(500);
  await details.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/case-study-notes-light.png` });
}

await page.goto(`${base}/certificates/nptel-introduction-to-programming-in-c`, {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/certificate-detail-light.png` });

console.log("desktop errors", errors);

const mobile = await makePage("light", { width: 390, height: 844 }, true);
await mobile.page.goto(`${base}/`, { waitUntil: "networkidle" });
await mobile.page.waitForTimeout(1400);
await mobile.page.screenshot({ path: `${out}/home-light-mobile.png` });
const mobileMetrics = await mobile.page.evaluate(() => ({
  overflowX:
    document.documentElement.scrollWidth > window.innerWidth
      ? document.documentElement.scrollWidth
      : null,
  nav: document
    .querySelector('nav[aria-label="Mobile Navigation"]')
    ?.getBoundingClientRect()
    .toJSON(),
}));
console.log("mobile", JSON.stringify(mobileMetrics));
console.log("mobile errors", mobile.errors);

await mobile.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await mobile.page.waitForTimeout(900);
await mobile.page.screenshot({ path: `${out}/home-light-mobile-footer.png` });

const dark = await makePage("dark", { width: 1440, height: 1000 });
await dark.page.goto(`${base}/`, { waitUntil: "networkidle" });
await dark.page.waitForTimeout(1400);
await dark.page.screenshot({ path: `${out}/home-dark-hero.png` });
console.log("dark errors", dark.errors);

await browser.close();
console.log("screenshots written");
