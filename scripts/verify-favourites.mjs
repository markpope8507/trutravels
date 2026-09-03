import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../.verify-screenshots");
mkdirSync(outDir, { recursive: true });

const MOCK_USER = {
  name: "Alex Traveller",
  email: "alex@trutravels.com",
  avatar: "AT",
  memberSince: "2025",
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

const report = [];

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.evaluate((user) => {
  localStorage.setItem("trutravels-user", JSON.stringify(user));
  localStorage.setItem("trutravels-favourites", JSON.stringify([]));
}, MOCK_USER);
await page.reload({ waitUntil: "domcontentloaded" });

await page.locator("section").filter({ hasText: "Find Your" }).scrollIntoViewIfNeeded();
const hearts = page.locator('button[aria-label^="Save "], button[aria-label^="Remove "]');
await hearts.first().waitFor({ timeout: 15000 });
const heartCount = await hearts.count();
report.push(`homepage hearts visible: ${heartCount}`);

const firstLabel = await hearts.nth(0).getAttribute("aria-label");
const secondLabel = await hearts.nth(1).getAttribute("aria-label");
report.push(`first heart: ${firstLabel}`);
report.push(`second heart: ${secondLabel}`);

const urlBefore = page.url();
await hearts.nth(0).click();
await page.waitForTimeout(400);
const urlAfter = page.url();
const firstPressed = await hearts.nth(0).getAttribute("aria-pressed");
const firstLabelAfter = await hearts.nth(0).getAttribute("aria-label");
report.push(`click-doesn't-navigate: ${urlBefore === urlAfter && !urlAfter.includes("/destinations/")} (before=${urlBefore} after=${urlAfter})`);
report.push(`first heart after click: pressed=${firstPressed} label=${firstLabelAfter}`);

const secondPressed = await hearts.nth(1).getAttribute("aria-pressed");
report.push(`second heart remains unsaved: pressed=${secondPressed}`);

const carousel = page.locator(".experience-carousel");
await carousel.screenshot({ path: join(outDir, "homepage-carousel-desktop.png") });

await page.setViewportSize({ width: 390, height: 844 });
await page.locator(".experience-carousel").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.locator(".experience-carousel").screenshot({ path: join(outDir, "homepage-carousel-mobile-390.png") });

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto("http://localhost:3000/member/saved", { waitUntil: "domcontentloaded" });
const savedHeading = await page.locator("h1").innerText();
const savedCardTitles = await page.locator("h3").allInnerTexts();
const savedCountText = await page.locator("text=/You have \\d+ trip/").first().innerText().catch(() => "(none)");
report.push(`saved page heading: ${savedHeading}`);
report.push(`saved count copy: ${savedCountText}`);
report.push(`saved card titles: ${JSON.stringify(savedCardTitles.slice(0, 8))}`);
await page.screenshot({ path: join(outDir, "member-saved-desktop.png"), fullPage: false });

await page.goto("http://localhost:3000/destinations/asia/thailand", { waitUntil: "domcontentloaded" });
const countryHearts = page.locator(".country-trips-carousel button[aria-label^='Save '], .country-trips-carousel button[aria-label^='Remove ']");
const countryHeartCount = await countryHearts.count().catch(() => 0);
report.push(`thailand country carousel hearts: ${countryHeartCount}`);

await page.goto("http://localhost:3000/deals", { waitUntil: "domcontentloaded" });
const dealHearts = page.locator("button[aria-label^='Save '], button[aria-label^='Remove ']");
await dealHearts.first().waitFor({ timeout: 15000 }).catch(() => {});
report.push(`deals page hearts: ${await dealHearts.count()}`);

await browser.close();
console.log(report.join("\n"));
console.log(`screenshots: ${outDir}`);
