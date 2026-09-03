// ============================================================
// GROUNDWORK STUDIOS — SOCIAL GRAPHIC GENERATOR
// Designed 4:5 Instagram cards, rendered in Chromium.
// A real feed mixes plain job photos with designed cards, so
// these sit alongside the raw scene shots on the social wall.
//   node tools/gen-social.js
// ============================================================

const fs   = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT   = path.join(__dirname, "..");
const IMAGES = path.join(ROOT, "images");
const OUT    = path.join(IMAGES, "social");
const W = 1080, H = 1350;

const BRAND   = "#1E3A2F";
const BRANDDK = "#12211C";
const GOLD    = "#C9A227";

const base = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Inter:wght@400;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden;
    font-family:Inter,system-ui,sans-serif;background:${BRANDDK};color:#fff}
  .card{position:relative;width:${W}px;height:${H}px;overflow:hidden;display:flex;flex-direction:column}
  .logo{position:absolute;top:44px;left:52px;z-index:5;font-family:Fraunces,Georgia,serif;
    font-weight:900;font-size:38px;letter-spacing:-.02em;text-shadow:0 2px 16px rgba(0,0,0,.5)}
  .logo i{color:${GOLD};font-style:normal}
  .handle{position:absolute;bottom:44px;left:52px;z-index:5;font-size:22px;font-weight:600;opacity:.72}
  .badge{position:absolute;top:48px;right:52px;z-index:5;background:${GOLD};color:${BRANDDK};
    font-weight:800;font-size:21px;letter-spacing:.1em;text-transform:uppercase;
    padding:11px 22px;border-radius:999px}
`;

const cards = {
  // ── Before / after split reveal ──────────────────────────
  "ba-reveal": `<style>${base}
    .split{position:absolute;inset:0}
    .split img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    .split .b{clip-path:polygon(0 0, 47% 0, 39% 100%, 0 100%)}
    .rule{position:absolute;top:0;bottom:0;left:0;width:100%;
      background:linear-gradient(101.5deg,transparent calc(47% - 5px),#fff calc(47% - 5px),
        #fff calc(47% + 1px),transparent calc(47% + 1px))}
    .tag{position:absolute;z-index:6;font-size:23px;font-weight:800;letter-spacing:.14em;
      text-transform:uppercase;padding:10px 20px;border-radius:8px}
    .tag-b{top:50%;left:56px;background:rgba(10,16,13,.82)}
    .tag-a{top:50%;right:56px;background:${GOLD};color:${BRANDDK}}
    .foot{position:absolute;left:0;right:0;bottom:0;padding:150px 52px 120px;z-index:5;
      background:linear-gradient(transparent,rgba(9,15,12,.93) 46%)}
    .foot h2{font-family:Fraunces,Georgia,serif;font-size:64px;line-height:1.06;font-weight:900}
    .foot p{font-size:26px;opacity:.82;margin-top:16px}
    </style>
    <div class="card">
      <div class="split">
        <img src="file://${IMAGES}/scenes/block1-after.jpg" alt="" />
        <img class="b" src="file://${IMAGES}/scenes/block1-before.jpg" alt="" />
        <div class="rule"></div>
      </div>
      <div class="logo">Rugby Driveways<i>.</i></div>
      <div class="badge">3 days</div>
      <span class="tag tag-b">Before</span>
      <span class="tag tag-a">After</span>
      <div class="foot">
        <h2>Same driveway.<br/>Three days apart.</h2>
        <p>58m² herringbone block — Brownsover, Rugby</p>
      </div>
      <div class="handle">@rugbydriveways</div>
    </div>`,

  // ── Five-star review card ────────────────────────────────
  "review": `<style>${base}
    .card{background:linear-gradient(158deg,${BRAND},${BRANDDK});justify-content:center;padding:96px 72px}
    .stars{color:${GOLD};font-size:60px;letter-spacing:9px;margin-bottom:38px}
    blockquote{font-family:Fraunces,Georgia,serif;font-size:53px;line-height:1.28;font-weight:700}
    .who{margin-top:48px;display:flex;align-items:center;gap:20px}
    .av{width:70px;height:70px;border-radius:50%;background:${GOLD};color:${BRANDDK};
      display:grid;place-items:center;font-weight:800;font-size:29px}
    .who strong{display:block;font-size:26px}
    .who span{font-size:21px;opacity:.66}
    .qm{position:absolute;top:150px;right:60px;font-family:Fraunces,Georgia,serif;
      font-size:280px;color:${GOLD};opacity:.13;line-height:1}
    </style>
    <div class="card">
      <div class="qm">&rdquo;</div>
      <div class="logo">Rugby Driveways<i>.</i></div>
      <div class="stars">★★★★★</div>
      <blockquote>“Nathan was straight with us from the start on price and materials. Two days, no mess, and it still looks great.”</blockquote>
      <div class="who">
        <span class="av">MT</span>
        <div><strong>Mark T.</strong><span>Hillmorton, Rugby · Google Review</span></div>
      </div>
      <div class="handle">@rugbydriveways</div>
    </div>`,

  // ── Seasonal offer ───────────────────────────────────────
  "offer": `<style>${base}
    .card{background:${BRANDDK}}
    .bg{position:absolute;inset:0}
    .bg img{width:100%;height:100%;object-fit:cover;opacity:.34}
    .bg::after{content:"";position:absolute;inset:0;
      background:linear-gradient(180deg,rgba(18,33,28,.72),rgba(18,33,28,.94))}
    .mid{position:relative;z-index:4;margin:auto;padding:0 72px;text-align:center}
    .kicker{color:${GOLD};font-size:23px;font-weight:800;letter-spacing:.18em;text-transform:uppercase}
    .mid h2{font-family:Fraunces,Georgia,serif;font-size:96px;line-height:1.0;font-weight:900;margin:26px 0}
    .mid h2 em{color:${GOLD};font-style:normal}
    .mid p{font-size:28px;opacity:.85;line-height:1.5;max-width:19ch;margin:0 auto}
    .pill{display:inline-block;margin-top:44px;background:${GOLD};color:${BRANDDK};
      font-weight:800;font-size:26px;padding:20px 40px;border-radius:999px}
    </style>
    <div class="card">
      <div class="bg"><img src="file://${IMAGES}/scenes/resin1-after.jpg" alt="" /></div>
      <div class="logo">Rugby Driveways<i>.</i></div>
      <div class="mid">
        <div class="kicker">Autumn 2026 · Booking now</div>
        <h2>Two install<br/>slots left in<br/><em>September</em></h2>
        <p>Free survey, written quote, and no deposit to hold your date.</p>
        <span class="pill">01632 960118</span>
      </div>
      <div class="handle">@rugbydriveways</div>
    </div>`,

  // ── Stat / credibility card ──────────────────────────────
  "stat": `<style>${base}
    .card{background:linear-gradient(152deg,${BRAND},${BRANDDK});padding:96px 72px;justify-content:center}
    .big{font-family:Fraunces,Georgia,serif;font-size:250px;line-height:.86;font-weight:900;color:${GOLD}}
    .card h2{font-family:Fraunces,Georgia,serif;font-size:62px;line-height:1.1;margin:26px 0 34px;font-weight:900}
    .card p{font-size:27px;opacity:.8;line-height:1.5;max-width:22ch}
    .rows{margin-top:56px;display:grid;gap:20px}
    .row{display:flex;align-items:center;gap:18px;font-size:25px;font-weight:600}
    .tick{width:38px;height:38px;flex:0 0 38px;border-radius:50%;background:${GOLD};color:${BRANDDK};
      display:grid;place-items:center;font-weight:900;font-size:21px}
    </style>
    <div class="card">
      <div class="logo">Rugby Driveways<i>.</i></div>
      <div class="big">80</div>
      <h2>driveways laid<br/>across Rugby</h2>
      <p>Five years, one crew, and not a single job subcontracted.</p>
      <div class="rows">
        <div class="row"><span class="tick">✓</span> No deposit, ever</div>
        <div class="row"><span class="tick">✓</span> 10-year workmanship guarantee</div>
        <div class="row"><span class="tick">✓</span> Fully insured &amp; TrustMark registered</div>
      </div>
      <div class="handle">@rugbydriveways</div>
    </div>`,
};

// ── Open Graph share card (1200×630, written straight to images/) ──
const OG_W = 1200, OG_H = 630;
const ogHtml = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,900&family=Inter:wght@600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${OG_W}px;height:${OG_H}px;overflow:hidden;font-family:Inter,system-ui,sans-serif;color:#fff}
  .og{position:relative;width:${OG_W}px;height:${OG_H}px;overflow:hidden;background:${BRANDDK}}
  .og img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .og::after{content:"";position:absolute;inset:0;
    background:linear-gradient(100deg,rgba(18,33,28,.96) 34%,rgba(18,33,28,.52) 74%,rgba(18,33,28,.30))}
  .in{position:absolute;inset:0;z-index:3;padding:70px;display:flex;flex-direction:column;justify-content:center}
  .brand{font-family:Fraunces,Georgia,serif;font-weight:900;font-size:30px;letter-spacing:-.01em}
  .brand i{color:${GOLD};font-style:normal}
  h1{font-family:Fraunces,Georgia,serif;font-weight:900;font-size:62px;line-height:1.06;margin:22px 0 18px;max-width:15ch}
  p{font-size:24px;opacity:.86;max-width:30ch;line-height:1.45}
  .chips{display:flex;gap:12px;margin-top:32px;flex-wrap:wrap}
  .chips span{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);
    padding:9px 18px;border-radius:999px;font-size:18px;font-weight:600}
  </style>
  <div class="og">
    <img src="file://${IMAGES}/scenes/hero-after.jpg" alt="" />
    <div class="in">
      <div class="brand">Rugby Driveways<i>.</i></div>
      <h1>Rugby's trusted driveway specialists</h1>
      <p>Tarmac, block paving, resin and natural stone — laid by our own team.</p>
      <div class="chips"><span>No deposits</span><span>No subcontractors</span><span>10-year guarantee</span></div>
    </div>
  </div>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  // OG card first, at its own aspect ratio
  const ogPage = await browser.newPage({ viewport: { width: OG_W, height: OG_H } });
  const ogTmp = path.join(ROOT, ".social-og.html");
  fs.writeFileSync(ogTmp, `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${ogHtml}</body></html>`, "utf8");
  await ogPage.goto(`file://${ogTmp}`, { waitUntil: "load" });
  await ogPage.evaluate(() => document.fonts.ready);
  await ogPage.waitForTimeout(450);
  await ogPage.screenshot({ path: path.join(IMAGES, "og-image.jpg"), type: "jpeg", quality: 90 });
  fs.unlinkSync(ogTmp);
  await ogPage.close();
  console.log("  ✓ images/og-image.jpg");

  const page = await browser.newPage({ viewport: { width: W, height: H } });

  for (const [name, html] of Object.entries(cards)) {
    const tmp = path.join(ROOT, `.social-${name}.html`);
    fs.writeFileSync(tmp, `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`, "utf8");
    await page.goto(`file://${tmp}`, { waitUntil: "load" });
    // let the webfonts land before shooting, or Fraunces silently falls back
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(450);
    const file = path.join(OUT, `${name}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 90 });
    fs.unlinkSync(tmp);
    console.log(`  ✓ images/social/${name}.jpg`);
  }

  await browser.close();
  console.log(`\n✅ ${Object.keys(cards).length} social cards → images/social/`);
})();
