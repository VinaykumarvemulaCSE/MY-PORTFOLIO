import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.getByRole("link", { name: /Certs/i }).click();
await page.waitForTimeout(3000);
const info = await page.evaluate(() => {
  const top = document.querySelector("header");
  const bottom = document.querySelector('nav[aria-label="Mobile Navigation"]');
  return {
    scrollY: window.scrollY,
    top: top?.getBoundingClientRect().toJSON(),
    bottom: bottom?.getBoundingClientRect().toJSON(),
    position: bottom ? getComputedStyle(bottom).position : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "screenshots/mobile-check.png", fullPage: false });
await browser.close();
