// ============================================================
// Bundles a built dist/ into ONE self-contained HTML page.
// Used to publish a shareable, browsable snapshot of a build
// (e.g. the "before" site) with no external requests.
// Nav links become client-side route swaps.
// Usage: node tools/snapshot.js <distDir> <outFile> "<Title>"
// ============================================================

const fs   = require("fs");
const path = require("path");

const DIST  = process.argv[2] || path.join(__dirname, "..", "dist");
const OUT   = process.argv[3] || "/tmp/snapshot.html";
const TITLE = process.argv[4] || "Site Snapshot";

const MIME = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".gif": "image/gif",
  ".webm": "video/webm", ".mp4": "video/mp4",
};

// Assets are emitted ONCE into a lookup table and referenced by token.
// Inlining the data URI at each use point duplicates every shared image
// across all ~35 routes and blows the page size up by an order of magnitude.
const ASSETS = [];
const assetIndex = new Map();

function assetToken(assetPath) {
  const clean = assetPath.split("?")[0].split("#")[0];
  if (assetIndex.has(clean)) return `%%A${assetIndex.get(clean)}%%`;
  const abs = path.join(DIST, clean.replace(/^\//, ""));
  if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) return assetPath;
  const ext = path.extname(abs).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return assetPath;
  const i = ASSETS.length;
  ASSETS.push(`data:${mime};base64,${fs.readFileSync(abs).toString("base64")}`);
  assetIndex.set(clean, i);
  return `%%A${i}%%`;
}

// CSS is emitted once, so it can take the real data URI directly.
function dataUri(assetPath) {
  const t = assetToken(assetPath);
  const m = /^%%A(\d+)%%$/.exec(t);
  return m ? ASSETS[Number(m[1])] : assetPath;
}

// CSS: real data URIs (emitted once).
function inlineCss(str) {
  return str.replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (m, q, p) => `url(${q}${dataUri(p)}${q})`);
}

// HTML: tokens, resolved at runtime from the shared ASSETS table.
function inlineAssets(str) {
  return str
    .replace(/url\((['"]?)(\/(?:images|videos)\/[^)'"]+)\1\)/g, (m, q, p) => `url(${q}${assetToken(p)}${q})`)
    .replace(/(src|href|poster)=("|')(\/(?:images|videos)\/[^"']+)\2/g,
      (m, a, q, p) => `${a}=${q}${assetToken(p)}${q}`);
}

// ── gather pages ─────────────────────────────────────────────

function findPages(dir, base = "") {
  const out = [];
  for (const entry of fs.readdirSync(dir)) {
    const abs = path.join(dir, entry);
    if (fs.statSync(abs).isDirectory()) {
      if (["src", "images", "admin", "videos"].includes(entry)) continue;
      out.push(...findPages(abs, `${base}/${entry}`));
    } else if (entry === "index.html") {
      out.push({ route: `${base}/` || "/", file: abs });
    }
  }
  return out;
}

const pages = findPages(DIST).sort((a, b) =>
  a.route === "/" ? -1 : b.route === "/" ? 1 : a.route.localeCompare(b.route));

function extract(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = html.match(re);
  return m ? m[1] : "";
}
function extractWithTag(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "i");
  const m = html.match(re);
  return m ? m[0] : "";
}
function titleOf(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : TITLE;
}

const first = fs.readFileSync(pages[0].file, "utf8");

// Shared chrome comes from the first page (header/footer are identical
// across the build, so we render them once and swap only <main>).
const headerHtml = extractWithTag(first, "header");
const footerHtml = extractWithTag(first, "footer");

const routes = pages.map(p => {
  const html = fs.readFileSync(p.file, "utf8");
  return {
    route: p.route,
    title: titleOf(html),
    // everything the page renders except the shared header/footer
    main: extractWithTag(html, "main"),
  };
});

// ── assets ───────────────────────────────────────────────────

const cssFiles = ["src/css/style.css", "src/css/showcase.css"];
const css = cssFiles
  .map(f => path.join(DIST, f))
  .filter(fs.existsSync)
  .map(f => inlineCss(fs.readFileSync(f, "utf8")))
  .join("\n\n");

const jsFiles = ["src/js/main.js", "src/js/widgets.js"];
const js = jsFiles
  .map(f => path.join(DIST, f))
  .filter(fs.existsSync)
  .map(f => fs.readFileSync(f, "utf8"))
  .join("\n\n");

// Utility bar / announcement live outside <header> in this build
const utilBar = (first.match(/<div id="utility-bar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i) || [""])[0];

// Everything between </footer> and the first <script src> is the floating
// furniture: WhatsApp widget, design menu, exit intent, sticky bar, lightbox.
const afterFooter = (() => {
  const start = first.indexOf("</footer>");
  const end = first.indexOf('<script src=', start);
  if (start < 0 || end < 0) return "";
  return first.slice(start + "</footer>".length, end);
})();

const payload = routes.map(r => ({
  route: r.route,
  title: r.title,
  html: inlineAssets(r.main),
}));

const out = `<title>${TITLE}</title>
<style>
${css}

/* ---- snapshot chrome (not part of the original site) ---- */
#snapbar{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;gap:.5rem;
  align-items:center;justify-content:center;flex-wrap:wrap;
  padding:.5rem .75rem;background:#12211c;color:#fff;
  font:500 12px/1.3 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  box-shadow:0 -2px 14px rgba(0,0,0,.3)}
#snapbar b{color:#d9b036;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:11px}
#snapbar button{appearance:none;border:1px solid rgba(255,255,255,.22);background:transparent;
  color:#fff;border-radius:999px;padding:.3rem .7rem;font:inherit;cursor:pointer}
#snapbar button:hover{background:rgba(255,255,255,.12)}
#snapbar button[aria-current="true"]{background:#d9b036;border-color:#d9b036;color:#12211c;font-weight:700}
body{padding-bottom:56px}
</style>

<div id="snapshot-root">
  ${inlineAssets(utilBar)}
  ${inlineAssets(headerHtml)}
  <div id="route-outlet"></div>
  ${inlineAssets(footerHtml)}
  ${inlineAssets(afterFooter)}
</div>

<nav id="snapbar" aria-label="Snapshot page switcher">
  <b>Archived build</b>
</nav>

<script>
const ASSETS = ${JSON.stringify(ASSETS)};
const deref = s => s.replace(/%%A(\\d+)%%/g, (m, i) => ASSETS[+i] || "");
const ROUTES = ${JSON.stringify(payload)};
const outlet = document.getElementById("route-outlet");
const bar = document.getElementById("snapbar");

// resolve tokens in the static chrome that shipped outside the route payload
document.querySelectorAll("#snapshot-root [src],#snapshot-root [poster],#snapshot-root [style]")
  .forEach(el => {
    ["src", "poster", "style"].forEach(a => {
      const v = el.getAttribute(a);
      if (v && v.indexOf("%%A") > -1) el.setAttribute(a, deref(v));
    });
  });

function label(route){
  if(route === "/") return "Home";
  return route.replace(/^\\/|\\/$/g,"").split("/").pop()
    .replace(/-/g," ").replace(/\\b\\w/g, m => m.toUpperCase());
}

function show(route){
  const r = ROUTES.find(x => x.route === route) || ROUTES[0];
  outlet.innerHTML = deref(r.html);
  bar.querySelectorAll("button").forEach(b =>
    b.setAttribute("aria-current", String(b.dataset.route === r.route)));
  window.scrollTo(0,0);
  wire();
}

ROUTES.forEach(r => {
  const b = document.createElement("button");
  b.textContent = label(r.route);
  b.dataset.route = r.route;
  b.addEventListener("click", () => show(r.route));
  bar.appendChild(b);
});

// Intercept in-site links so the snapshot stays self-contained
function wire(){
  document.querySelectorAll('a[href^="/"]').forEach(a => {
    if (a.dataset.wired) return;
    a.dataset.wired = "1";
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (ROUTES.some(r => r.route === href)) { e.preventDefault(); show(href); }
    });
  });
  try { initSite(); } catch(e){}
}

// original site behaviour, scoped so it can re-run after a route swap
function initSite(){
${js.replace(/^/gm, "  ")}
}

show("/");
</script>
`;

fs.writeFileSync(OUT, out, "utf8");
const mb = (Buffer.byteLength(out) / 1048576).toFixed(2);
console.log(`✅ snapshot → ${OUT}`);
console.log(`   routes: ${routes.map(r => r.route).join(", ")}`);
console.log(`   size:   ${mb} MB`);
