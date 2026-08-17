import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.goto("http://localhost:3000/hrm/administration-login", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r=>setTimeout(r,3500));
const col = await p.evaluate(() => {
  const src = document.querySelector(".teddy-wrap canvas");
  const t = document.createElement("canvas"); t.width=src.width; t.height=src.height;
  const ctx = t.getContext("2d"); ctx.drawImage(src,0,0);
  const px = (x,y)=>{const d=ctx.getImageData(x,y,1,1).data; return `rgba(${d[0]},${d[1]},${d[2]},${d[3]})`;};
  return { size:`${src.width}x${src.height}`, topleft:px(6,6), topright:px(src.width-6,6), botleft:px(6,src.height-6), center_top:px(src.width/2,10) };
});
console.log(JSON.stringify(col,null,2));
await b.close();
