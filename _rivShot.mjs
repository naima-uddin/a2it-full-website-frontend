import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 850, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000/hrm/administration-login", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 4000));
// check if canvas actually has non-blank pixels
const nonBlank = await page.evaluate(() => {
  const c = document.querySelector(".teddy-wrap canvas");
  if (!c) return "no canvas";
  const ctx = c.getContext("webgl2") || c.getContext("webgl");
  // can't easily read webgl; instead sample via toDataURL length heuristic
  try { const d = c.toDataURL(); return "dataURL len=" + d.length; } catch(e){ return "err "+e.message; }
});
console.log("canvas pixels:", nonBlank);
await page.screenshot({ path: "_teddy.png" });
console.log("shot saved");
await browser.close();
