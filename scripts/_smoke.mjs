import { chromium } from "playwright-core";

const base = "http://localhost:3000";
const executablePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({ executablePath, headless: true });
const failures = [];

function watch(page, label) {
  page.on("pageerror", (error) => failures.push(`${label}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`${label}: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    failures.push(`${label}: request failed ${request.url()} ${request.failure()?.errorText ?? ""}`);
  });
}

async function openPage(context, path, label) {
  const page = await context.newPage();
  watch(page, label);
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(2_000);
  return page;
}

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const home = await openPage(context, "/", "home");
const homeText = (await home.locator("body").innerText()).toLowerCase();

for (const expected of ["aroma-cafe", "blood-line", "cs fundamentals", "b.tech", "education"]) {
  if (!homeText.includes(expected)) failures.push(`home: missing text ${expected}`);
}
if (homeText.includes("vinaykumar.eu.cc")) failures.push("home: old domain still rendered");
await home.screenshot({ path: "screenshots/home-desktop.png", fullPage: false });

await home.keyboard.press("Control+K");
await home.waitForTimeout(500);
const commandText = await home.locator("body").innerText();
if (!commandText.includes("Certificates")) failures.push("command menu: missing Certificates");
await home.screenshot({ path: "screenshots/command-menu.png", fullPage: false });
await home.keyboard.press("Escape");

await home.getByRole("button", { name: /Open AROMA-CAFE screenshots/i }).click();
await home.waitForTimeout(700);
await home.screenshot({ path: "screenshots/project-modal.png", fullPage: false });
const modalText = (await home.locator('[role="dialog"]').innerText()).toLowerCase();
if (!modalText.includes("case study")) failures.push("project modal: missing Case study tab");

await home.getByRole("button", { name: /^Details/i }).click();
await home.waitForTimeout(500);
const detailsText = (await home.locator('[role="dialog"]').innerText()).toLowerCase();
for (const expected of ["project overview", "tech stack"]) {
  if (!detailsText.includes(expected)) failures.push(`project details: missing ${expected}`);
}
await home.screenshot({ path: "screenshots/project-modal-details.png", fullPage: false });

await home.getByRole("button", { name: /^Case study/i }).click();
await home.waitForTimeout(500);
const caseStudyText = (await home.locator('[role="dialog"]').innerText()).toLowerCase();
for (const expected of ["problem", "architecture"]) {
  if (!caseStudyText.includes(expected)) failures.push(`project case study: missing ${expected}`);
}
await home.screenshot({ path: "screenshots/project-modal-case-study.png", fullPage: false });
await home.getByRole("button", { name: /Close project details/i }).click();

await home.locator("#certificates").scrollIntoViewIfNeeded();
await home.waitForTimeout(500);
await home.getByRole("button", { name: /Preview /i }).first().click();
await home.waitForTimeout(700);
await home.screenshot({ path: "screenshots/certificate-modal.png", fullPage: false });
const certText = (await home.locator('[role="dialog"]').innerText()).toLowerCase();
if (certText.includes("open full page")) failures.push("certificate modal: still has Open full page");
if (!certText.includes("credential id")) failures.push("certificate modal: missing Credential ID");

const projects = await openPage(context, "/projects", "projects");
await projects.screenshot({ path: "screenshots/projects.png", fullPage: false });
const projectsText = await projects.locator("body").innerText();
if (!projectsText.includes("Project Archive")) failures.push("projects: missing heading");

const work = await openPage(context, "/work/aroma-cafe", "work");
await work.screenshot({ path: "screenshots/work-aroma.png", fullPage: false });

await context.close();

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
const mobile = await openPage(mobileContext, "/", "mobile");
await mobile.screenshot({ path: "screenshots/home-mobile.png", fullPage: false });
const mobileText = await mobile.locator("body").innerText();
if (!mobileText.includes("Certs")) failures.push("mobile: bottom nav missing Certs");
await mobile.getByRole("link", { name: /Certs/i }).click();
await mobile.waitForTimeout(800);
await mobile.screenshot({ path: "screenshots/home-mobile-certs.png", fullPage: false });
await mobileContext.close();

const lightContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: "light",
});
await lightContext.addInitScript(() => {
  localStorage.setItem("theme", "light");
});
const light = await openPage(lightContext, "/", "light");
await light.screenshot({ path: "screenshots/home-light.png", fullPage: false });
const lightClass = await light.locator("html").getAttribute("class");
if (lightClass?.includes("dark")) failures.push("light mode: html still has dark class");
await lightContext.close();

await browser.close();

console.log(JSON.stringify({ failures, count: failures.length }, null, 2));
if (failures.length > 0) process.exitCode = 1;
