import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1100, height: 850 });
await p.goto("http://localhost:3000/hrm/administration-login", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r=>setTimeout(r,4000));
await p.screenshot({ path: "_shot.png" });
console.log("shot saved");
await b.close();
