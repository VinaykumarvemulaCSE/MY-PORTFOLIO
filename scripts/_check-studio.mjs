import { chromium } from "playwright-core";

const executablePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];

page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto("http://localhost:3333", {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  await page.waitForTimeout(4_000);
  console.log(
    JSON.stringify(
      {
        title: await page.title(),
        body: (await page.locator("body").innerText()).slice(0, 2000),
        errors,
      },
      null,
      2,
    ),
  );
  await page.screenshot({ path: "screenshots/studio.png", fullPage: false });
} finally {
  await browser.close();
}
