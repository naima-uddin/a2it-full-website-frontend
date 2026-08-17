import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 800 });
await page.goto("http://localhost:3000/hrm/administration-login", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 3000));
const m = await page.evaluate(() => {
  const box = (el) => el ? `${Math.round(el.offsetWidth)}x${Math.round(el.offsetHeight)} (computed ${getComputedStyle(el).width} x ${getComputedStyle(el).height}, disp ${getComputedStyle(el).display})` : "MISSING";
  const wrap = document.querySelector(".teddy-wrap");
  const art = document.querySelector(".teddy-art");
  const canvas = document.querySelector(".teddy-wrap canvas");
  return { wrap: box(wrap), art: box(art), canvas: box(canvas), artIsCanvasParent: art && canvas && art.contains(canvas) };
});
console.log(JSON.stringify(m, null, 2));
await browser.close();
