const http = require("http");
const fs   = require("fs");
const path = require("path");
const port = 3333;
const ROOT = path.join(__dirname, "dist");
const mime = {
  ".html":"text/html",".css":"text/css",".js":"application/javascript",
  ".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",
  ".webp":"image/webp",".ico":"image/x-icon",".json":"application/json",
  ".yml":"text/yaml",".woff2":"font/woff2",
};
http.createServer((req, res) => {
  let p = req.url.split("?")[0];
  if (p === "/" || p === "") p = "/index.html";
  const file = path.join(ROOT, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "text/plain" });
    res.end(data);
  });
}).listen(port, () => console.log("Preview: http://localhost:" + port));
