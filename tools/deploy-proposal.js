// ============================================================
// Wraps an Artifact-style proposal fragment (<title>/<style>/body
// content, no <html> shell) into a standalone page and publishes
// it to the gh-pages branch under proposals/<slug>/index.html,
// live at https://portal.groundworkstudios.co.uk/proposals/<slug>/
//
// Usage: node tools/deploy-proposal.js <fragment.html> <slug>
// Example: node tools/deploy-proposal.js /tmp/acme-proposal.html acme-ltd
// ============================================================

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const [, , fragmentPath, slug] = process.argv;

if (!fragmentPath || !slug) {
  console.error("Usage: node tools/deploy-proposal.js <fragment.html> <slug>");
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error("Slug must be lowercase letters, digits and hyphens only (e.g. acme-ltd).");
  process.exit(1);
}
if (!fs.existsSync(fragmentPath)) {
  console.error(`Not found: ${fragmentPath}`);
  process.exit(1);
}

const fragment = fs.readFileSync(fragmentPath, "utf8");

const titleMatch = fragment.match(/<title>([\s\S]*?)<\/title>/i);
const title = titleMatch ? titleMatch[1].trim() : slug;

const styleCloseIdx = fragment.indexOf("</style>");
if (styleCloseIdx === -1) {
  console.error("Expected a <style>...</style> block in the fragment — none found.");
  process.exit(1);
}
const splitAt = styleCloseIdx + "</style>".length;
const head = fragment.slice(0, splitAt);
const body = fragment.slice(splitAt);

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
${head}
</head>
<body>
${body}
</body>
</html>
`;

const ROOT = path.join(__dirname, "..");
const worktree = fs.mkdtempSync("/tmp/gh-pages-proposal-");

function git(args, opts = {}) {
  return execFileSync("git", args, { cwd: ROOT, stdio: "inherit", ...opts });
}

console.log(`Publishing "${title}" -> proposals/${slug}/`);

git(["fetch", "origin", "gh-pages"]);
git(["worktree", "add", "--detach", worktree, "origin/gh-pages"]);

const destDir = path.join(worktree, "proposals", slug);
fs.mkdirSync(destDir, { recursive: true });
fs.writeFileSync(path.join(destDir, "index.html"), page, "utf8");

git(["add", `proposals/${slug}/index.html`], { cwd: worktree });
try {
  git(["commit", "-m", `Add proposal: ${title}`], { cwd: worktree });
} catch {
  console.log("Nothing changed — content identical to what's already deployed.");
  git(["worktree", "remove", "--force", worktree]);
  process.exit(0);
}
git(["push", "origin", "HEAD:gh-pages"], { cwd: worktree });
git(["worktree", "remove", "--force", worktree]);

console.log(`\n✅ Live at https://portal.groundworkstudios.co.uk/proposals/${slug}/`);
