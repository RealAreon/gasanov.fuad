import { chromium } from "playwright";

const projects = [
  {
    id: "abc-car-wash",
    url: "http://localhost:3456/ABC%20Car%20Wash%20portfolio/ABC%20Car%20Wash%20_%20Luxury%20Touchless%20Car%20Wash%20%26%20Detailing.html",
  },
  {
    id: "agenciy",
    url: "http://localhost:3456/Agenciy%20portfolio/Agenciy%20%E2%80%93%20Modern%20Template%20for%20Creative%20Agencies.html",
  },
  {
    id: "clipcut",
    url: "http://localhost:3456/ClipCut/Video%20Editing%20Agency%20Template.html",
  },
  {
    id: "grovia",
    url: "http://localhost:3456/Grovia%20portfolio/Grovia.html",
  },
  {
    id: "halo",
    url: "http://localhost:3456/HaloTM%20portfolio/Halo%20Studio%20%E2%80%93%20Modern%20Creative%20Portfolio%20Template.html",
  },
  {
    id: "portfolite",
    url: "http://localhost:3456/Portfolite%20portfolio/Portfolite%20%E2%80%93%20Framer%20Portfolio%20Template.html",
  },
  {
    id: "xtract",
    url: "http://localhost:3456/xTract/Xtract%20-%20AI%20automation%20agency%20framer%20template.html",
  },
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const p of projects) {
  await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const mid = Math.max(0, Math.floor(height / 2 - 450));
  await page.evaluate((y) => window.scrollTo(0, y), mid);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `public/works/${p.id}-2.png` });
  const bottom = Math.max(0, height - 900);
  await page.evaluate((y) => window.scrollTo(0, y), bottom);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `public/works/${p.id}-3.png` });
  console.log("OK", p.id, height);
}

await browser.close();
