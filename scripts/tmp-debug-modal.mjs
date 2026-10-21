import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: "light",
});
await context.addInitScript(() => window.localStorage.setItem("theme", "light"));
const page = await context.newPage();

page.on("requestfailed", (req) => console.log("FAILED", req.url(), req.failure()?.errorText));
page.on("response", async (res) => {
  if (res.url().includes("sanity") || res.url().includes("certificate")) {
    console.log("RESP", res.status(), res.url().slice(0, 140));
  }
});
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE", msg.text());
});

await page.goto("http://localhost:3114/", { waitUntil: "networkidle" });
await page.locator("#certificates").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.locator("#certificates button").first().click();
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const dialog = document.querySelector('[role="dialog"]');
  const img = dialog?.querySelector("img");
  const box = img?.parentElement;
  return {
    html: dialog?.querySelector("img")?.outerHTML?.slice(0, 500) ?? null,
    complete: img?.complete,
    naturalWidth: img?.naturalWidth,
    naturalHeight: img?.naturalHeight,
    currentSrc: img?.currentSrc,
    imgRect: img ? img.getBoundingClientRect().toJSON() : null,
    boxRect: box ? box.getBoundingClientRect().toJSON() : null,
    dialogScrollHeight: dialog?.querySelector(".overflow-y-auto")?.scrollHeight ?? null,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "screenshots/certificate-modal-light-2.png" });
await browser.close();
