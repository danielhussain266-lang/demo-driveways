// ============================================================
// GROUNDWORK STUDIOS — SCENE IMAGE GENERATOR
// Renders matched before/after driveway scenes to JPEG.
// Both variants share identical geometry so the before/after
// slider lines up exactly.
//   node tools/gen-scenes.js          # all scenes
//   node tools/gen-scenes.js test     # one pair only
// ============================================================

const fs   = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { scene, W, H } = require("./scene.js");

const ROOT   = path.join(__dirname, "..");
const IMAGES = path.join(ROOT, "images");
const OUT    = path.join(IMAGES, "scenes");

// Worn/cracked surfaces available on disk — reused as "before" fills.
const WORN = {
  cracked:  "/images/proj-resin1-before.jpg",
  crazed:   "/images/proj-resin2-before.jpg",
  greyslab: "/images/proj-tarmac1-before.jpg",
  bare:     "/images/proj-block1-before.jpg",
};

// name → the finished material photo used as the drive surface
const SCENES = [
  { name: "tarmac1",  surface: "/images/svc-tarmac.jpg",        surfaceSize: 190, before: WORN.cracked,
    houseStyle: "redbrick",  edging: "/images/svc-block.jpg",   houseOpts: { garage: false, bay: true } },
  { name: "block1",   surface: "/images/svc-block.jpg",         surfaceSize: 170, before: WORN.bare,
    houseStyle: "buffbrick", edging: "/images/svc-stone.jpg",   houseOpts: { garage: true,  bay: false } },
  { name: "resin1",   surface: "/images/svc-resin.jpg",         surfaceSize: 120, before: WORN.crazed,
    houseStyle: "render",    edging: "/images/svc-block.jpg",   houseOpts: { garage: false, bay: true } },
  { name: "patio1",   surface: "/images/proj-stone1-after.jpg", surfaceSize: 240, before: WORN.greyslab,
    houseStyle: "redbrick",  edging: null,                      houseOpts: { garage: false, bay: true } },
  { name: "tarmac2",  surface: "/images/svc-tarmac.jpg",        surfaceSize: 190, before: WORN.greyslab,
    houseStyle: "greybrick", edging: "/images/svc-block.jpg",   houseOpts: { garage: false, bay: false } },
  { name: "block2",   surface: "/images/svc-block.jpg",         surfaceSize: 170, before: WORN.cracked,
    houseStyle: "render",    edging: "/images/svc-stone.jpg",   houseOpts: { garage: true,  bay: true } },
  { name: "stone1",   surface: "/images/svc-stone.jpg",         surfaceSize: 190, before: WORN.crazed,
    houseStyle: "buffbrick", edging: null,                      houseOpts: { garage: false, bay: true } },
  { name: "patio2",   surface: "/images/proj-stone1-before.jpg",surfaceSize: 260, before: WORN.bare,
    houseStyle: "render",    edging: null,                      houseOpts: { garage: false, bay: false } },
  { name: "resin2",   surface: "/images/proj-resin2-after.jpg", surfaceSize: 150, before: WORN.greyslab,
    houseStyle: "redbrick",  edging: "/images/svc-block.jpg",   houseOpts: { garage: true,  bay: true } },
  { name: "stone2",   surface: "/images/proj-stone1-after.jpg", surfaceSize: 240, before: WORN.cracked,
    houseStyle: "greybrick", edging: "/images/svc-stone.jpg",   houseOpts: { garage: false, bay: true } },
];

// The hero gets its own pair — bay-fronted semi, block paving.
const HERO = {
  name: "hero", surface: "/images/svc-block.jpg", surfaceSize: 170, before: WORN.cracked,
  houseStyle: "redbrick", edging: "/images/svc-stone.jpg", houseOpts: { garage: false, bay: true },
};

// Chromium blocks file:// subresources on a setContent() document, so the
// scene is written into the repo root and loaded over file:// with the
// texture paths made relative. Then the images resolve normally.
const TMP = path.join(ROOT, ".scene-tmp.html");

async function render(page, spec, variant, outFile) {
  const html = scene({
    surface: spec.surface,
    surfaceSize: spec.surfaceSize,
    beforeSurface: spec.before,
    edging: spec.edging,
    houseStyle: spec.houseStyle,
    houseOpts: spec.houseOpts,
    variant,
  }).replace(/url\('\/images\//g, "url('images/");

  fs.writeFileSync(TMP, html, "utf8");
  await page.goto(`file://${TMP}`, { waitUntil: "load" });
  // make sure every texture has actually decoded before we shoot
  await page.evaluate(() => Promise.all(
    Array.from(document.querySelectorAll("*"))
      .map(el => getComputedStyle(el).backgroundImage)
      .filter(v => v && v.startsWith("url("))
      .map(v => new Promise(res => {
        const im = new Image();
        im.onload = im.onerror = res;
        im.src = v.slice(5, -2);
      }))
  ));
  await page.waitForTimeout(120);
  await page.screenshot({ path: outFile, type: "jpeg", quality: 88 });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const testOnly = process.argv[2] === "test";
  const list = testOnly ? [SCENES[1]] : [HERO, ...SCENES];

  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

  for (const spec of list) {
    for (const variant of ["before", "after"]) {
      const file = path.join(OUT, `${spec.name}-${variant}.jpg`);
      await render(page, spec, variant, file);
      console.log(`  ✓ ${path.relative(ROOT, file)}`);
    }
  }

  await browser.close();
  console.log(`\n✅ ${list.length * 2} scene images → images/scenes/`);
})();
