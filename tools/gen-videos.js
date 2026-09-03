// ============================================================
// GROUNDWORK STUDIOS — VIDEO GENERATOR
// Real .webm files, produced by animating a page in Chromium
// and recording it with Playwright. No ffmpeg required.
//   node tools/gen-videos.js
// ============================================================

const fs   = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT   = path.join(__dirname, "..");
const IMAGES = path.join(ROOT, "images");
const OUT    = path.join(ROOT, "videos");
const TMPDIR = path.join(ROOT, ".video-tmp");

const SIZE = { width: 1280, height: 720 };

const img = p => `file://${IMAGES}/${p}`;

// ── 1. Hero loop: slow push-in, reversing so it loops seamlessly ──
const heroHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0}
html,body{width:${SIZE.width}px;height:${SIZE.height}px;overflow:hidden;background:#0d1512}
.frame{position:absolute;inset:0;overflow:hidden}
img{position:absolute;inset:-8%;width:116%;height:116%;object-fit:cover;
  animation:push 16s ease-in-out infinite alternate;transform-origin:52% 62%}
@keyframes push{from{transform:scale(1.0) translate3d(0,0,0)}
                to{transform:scale(1.13) translate3d(0,-1.5%,0)}}
.grade{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(10,18,14,.30),rgba(10,18,14,.05) 42%,rgba(10,18,14,.42))}
</style></head><body>
<div class="frame">
  <img src="${img("scenes/hero-after.jpg")}" alt="" />
  <div class="grade"></div>
</div>
</body></html>`;

// ── 2. Transformation reel: the finished surface wipes across ──
const STAGES = [
  { at: 0.00, label: "Day 1", text: "The original drive — cracked, sunken and ponding" },
  { at: 0.26, label: "Day 1", text: "Broken out and excavated to 300mm" },
  { at: 0.50, label: "Day 2", text: "Membrane down, MOT Type 1 compacted in layers" },
  { at: 0.72, label: "Day 3", text: "Edge restraints haunched, herringbone laid" },
  { at: 0.90, label: "Done", text: "58m² of block paving — three days, no subcontractors" },
];

const reelHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${SIZE.width}px;height:${SIZE.height}px;overflow:hidden;background:#000;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.frame{position:absolute;inset:0;overflow:hidden}
.frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#after{clip-path:inset(0 0 0 var(--wipe,100%))}
.line{position:absolute;top:0;bottom:0;left:var(--wipe,0%);width:4px;
  background:linear-gradient(180deg,rgba(255,255,255,.2),#fff 22%,#fff 78%,rgba(255,255,255,.2));
  box-shadow:0 0 22px rgba(255,255,255,.7);transform:translateX(-2px)}
.grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,14,11,.15),transparent 38%,rgba(8,14,11,.72))}
.cap{position:absolute;left:52px;bottom:56px;right:52px;color:#fff}
.cap-label{display:inline-block;background:#C9A227;color:#12211C;font-weight:800;
  font-size:15px;letter-spacing:.09em;text-transform:uppercase;padding:5px 13px;border-radius:999px}
.cap-text{font-size:33px;font-weight:700;line-height:1.22;margin-top:13px;max-width:20ch;
  text-shadow:0 2px 18px rgba(0,0,0,.6)}
.cap{opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s ease}
.cap.on{opacity:1;transform:none}
.brand{position:absolute;top:34px;left:52px;color:#fff;font-weight:800;font-size:20px;
  letter-spacing:-.01em;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.brand i{color:#C9A227;font-style:normal}
.bar{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.18)}
.bar span{display:block;height:100%;width:var(--wipe,0%);background:#C9A227}
</style></head><body>
<div class="frame">
  <img id="before" src="${img("scenes/block1-before.jpg")}" alt="" />
  <img id="after"  src="${img("scenes/block1-after.jpg")}" alt="" />
  <div class="line" id="line"></div>
  <div class="grade"></div>
  <div class="brand">Rugby Driveways<i>.</i></div>
  <div class="cap" id="cap">
    <span class="cap-label" id="cap-label"></span>
    <div class="cap-text" id="cap-text"></div>
  </div>
  <div class="bar"><span id="bar"></span></div>
</div>
<script>
const STAGES = ${JSON.stringify(STAGES)};
const DUR = 20000;
const root = document.documentElement;
const cap = document.getElementById('cap');
const capLabel = document.getElementById('cap-label');
const capText = document.getElementById('cap-text');
let shown = -1;
const t0 = performance.now();

function frame(now){
  const k = Math.min(1, (now - t0) / DUR);
  // ease so it settles on the finished surface rather than racing past it
  const eased = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2)/2;
  const wipe = (eased * 100).toFixed(2) + '%';
  root.style.setProperty('--wipe', wipe);

  let idx = 0;
  for (let i = 0; i < STAGES.length; i++) if (k >= STAGES[i].at) idx = i;
  if (idx !== shown) {
    shown = idx;
    cap.classList.remove('on');
    setTimeout(() => {
      capLabel.textContent = STAGES[idx].label;
      capText.textContent = STAGES[idx].text;
      cap.classList.add('on');
    }, 220);
  }
  if (k < 1) requestAnimationFrame(frame);
  else window.__done = true;
}
requestAnimationFrame(frame);
</script>
</body></html>`;

async function record(name, html, ms) {
  fs.mkdirSync(TMPDIR, { recursive: true });
  const tmpPage = path.join(ROOT, `.video-page-${name}.html`);
  fs.writeFileSync(tmpPage, html, "utf8");

  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const context = await browser.newContext({
    viewport: SIZE,
    recordVideo: { dir: TMPDIR, size: SIZE },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto(`file://${tmpPage}`, { waitUntil: "load" });
  await page.waitForTimeout(ms);

  const video = page.video();
  await context.close();
  await browser.close();

  const src = await video.path();
  fs.mkdirSync(OUT, { recursive: true });
  const dest = path.join(OUT, `${name}.webm`);
  fs.copyFileSync(src, dest);
  fs.unlinkSync(src);
  fs.unlinkSync(tmpPage);

  const kb = (fs.statSync(dest).size / 1024).toFixed(0);
  console.log(`  ✓ videos/${name}.webm  (${kb} KB)`);
}

(async () => {
  // one full 16s cycle of the push-in, so the loop point matches
  await record("hero-loop", heroHtml, 16200);
  await record("transformation", reelHtml, 21000);
  fs.rmSync(TMPDIR, { recursive: true, force: true });
  console.log("\n✅ videos generated → videos/");
})();
