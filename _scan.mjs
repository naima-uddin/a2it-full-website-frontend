import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.goto("http://localhost:3000/hrm/administration-login", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise(r=>setTimeout(r,3500));
const scan = await p.evaluate(() => {
  const src = document.querySelector(".teddy-slot canvas");
  const t=document.createElement("canvas"); t.width=src.width;t.height=src.height;
  const ctx=t.getContext("2d"); ctx.drawImage(src,0,0);
  const W=src.width,H=src.height, cx=Math.round(W/2);
  const rows=[];
  for(let y=0;y<H;y+=Math.round(H/26)){
    const d=ctx.getImageData(cx,y,1,1).data;
    let kind="transparent";
    if(d[3]>40){
      // panel ~214,226,234 ; bear white ~>=235 ; scarf red high R low G
      if(d[0]>232&&d[1]>232&&d[2]>232) kind="BEAR(white)";
      else if(d[0]>150&&d[1]<130) kind="scarf(red)";
      else if(Math.abs(d[0]-214)<14&&Math.abs(d[1]-226)<14) kind="panel";
      else kind=`other ${d[0]},${d[1]},${d[2]}`;
    }
    rows.push(`y=${y} (${Math.round(y/H*100)}%) : ${kind}`);
  }
  return {size:`${W}x${H}`, rows};
});
console.log(scan.size); console.log(scan.rows.join("\n"));
await b.close();
