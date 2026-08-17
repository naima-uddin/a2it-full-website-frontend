import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.goto("http://localhost:3000/hrm/administration-login", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r=>setTimeout(r,3500));
const col = await p.evaluate(() => {
  const src = document.querySelector(".teddy-wrap canvas");
  const t=document.createElement("canvas"); t.width=src.width;t.height=src.height;
  const ctx=t.getContext("2d"); ctx.drawImage(src,0,0);
  const W=src.width,H=src.height;
  const px=(x,y)=>{const d=ctx.getImageData(Math.round(x),Math.round(y),1,1).data;return `${d[0]},${d[1]},${d[2]} a${d[3]}`;};
  // scan a vertical line and horizontal line to map where light card is (non-transparent, light)
  const out={};
  for(let y=0;y<=H;y+=Math.round(H/12)) out['left_y'+y]=px(W*0.14,y);
  for(let x=0;x<=W;x+=Math.round(W/12)) out['bot_x'+x]=px(x,H*0.86);
  return {size:`${W}x${H}`,...out};
});
console.log(JSON.stringify(col,null,2));
await b.close();
