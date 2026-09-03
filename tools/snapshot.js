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
/* Preview-only chrome. Not part of the website — it exists so all the
   pages are reachable from a single-page artifact. */
#snapbar{position:fixed;left:0;right:0;bottom:0;z-index:9999;
  display:flex;gap:.75rem;align-items:center;justify-content:center;flex-wrap:wrap;
  padding:.55rem .9rem;background:#12211c;color:#fff;
  font:500 12px/1.3 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  box-shadow:0 -2px 14px rgba(0,0,0,.35)}
#snapbar .sb-mark{display:inline-flex;align-items:center;gap:.45rem;
  color:#d9b036;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:10.5px}
#snapbar .sb-mark i{width:20px;height:20px;border-radius:5px;background:#d9b036;color:#12211c;
  display:grid;place-items:center;font-style:normal;font-weight:800;font-size:9px;letter-spacing:0}
#snapbar .sb-note{opacity:.55;font-size:11px}
#snapbar select{appearance:none;background:rgba(255,255,255,.08);color:#fff;
  border:1px solid rgba(255,255,255,.28);border-radius:6px;padding:.34rem 1.9rem .34rem .6rem;
  font:inherit;cursor:pointer;max-width:min(46vw,300px);
  background-image:linear-gradient(45deg,transparent 50%,#d9b036 50%),
    linear-gradient(135deg,#d9b036 50%,transparent 50%);
  background-position:calc(100% - 15px) 52%,calc(100% - 10px) 52%;
  background-size:5px 5px,5px 5px;background-repeat:no-repeat}
#snapbar select:focus-visible{outline:2px solid #d9b036;outline-offset:1px}
#snapbar option{background:#12211c;color:#fff}
#snapbar .sb-nav{appearance:none;border:1px solid rgba(255,255,255,.28);background:transparent;
  color:#fff;border-radius:6px;width:28px;height:28px;cursor:pointer;font:inherit;line-height:1}
#snapbar .sb-nav:hover{background:rgba(255,255,255,.14)}
@media (max-width:620px){#snapbar .sb-note{display:none}}
body{padding-bottom:56px}
</style>

<div id="snapshot-root">
  ${inlineAssets(utilBar)}
  ${inlineAssets(headerHtml)}
  <div id="route-outlet"></div>
  ${inlineAssets(footerHtml)}
  ${inlineAssets(afterFooter)}
</div>

<nav id="snapbar" aria-label="Preview page switcher">
  <span class="sb-mark"><i>GS</i> Preview</span>
  <button class="sb-nav" id="sb-prev" aria-label="Previous page" title="Previous page">&#8249;</button>
  <label class="sr-only" for="sb-select">Jump to page</label>
  <select id="sb-select"></select>
  <button class="sb-nav" id="sb-next" aria-label="Next page" title="Next page">&#8250;</button>
  <span class="sb-note">Page switcher for this preview only — not part of the site</span>
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

const sel = document.getElementById("sb-select");

function titleCase(s){
  return s.replace(/-/g," ").replace(/\\b\\w/g, m => m.toUpperCase());
}
function label(route){
  if(route === "/") return "Home";
  const parts = route.replace(/^\\/|\\/$/g,"").split("/");
  return titleCase(parts[parts.length - 1]);
}
// group by top-level section so 35 routes stay navigable
function section(route){
  if(route === "/") return "";
  const parts = route.replace(/^\\/|\\/$/g,"").split("/");
  return parts.length > 1 ? titleCase(parts[0]) : "";
}

const groups = new Map();
ROUTES.forEach(r => {
  const g = section(r.route) || "Main pages";
  if(!groups.has(g)) groups.set(g, []);
  groups.get(g).push(r);
});
groups.forEach((rs, name) => {
  const og = document.createElement("optgroup");
  og.label = name;
  rs.forEach(r => {
    const o = document.createElement("option");
    o.value = r.route;
    o.textContent = label(r.route);
    og.appendChild(o);
  });
  sel.appendChild(og);
});

function show(route){
  const r = ROUTES.find(x => x.route === route) || ROUTES[0];
  outlet.innerHTML = deref(r.html);
  if(sel.value !== r.route) sel.value = r.route;
  window.scrollTo(0,0);
  wire();
}

sel.addEventListener("change", () => show(sel.value));

function step(delta){
  const i = ROUTES.findIndex(x => x.route === sel.value);
  const next = ROUTES[(i + delta + ROUTES.length) % ROUTES.length];
  show(next.route);
}
document.getElementById("sb-prev").addEventListener("click", () => step(-1));
document.getElementById("sb-next").addEventListener("click", () => step(1));

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
