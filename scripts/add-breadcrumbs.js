const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname, "..", "docs");
const skip = new Set([
  "index.html",
  "present-simple-exercises-b2.html",
  "present-simple-exercises-c1.html",
  "present-simple-exercises-v2.html"
]);
const tag = '<script src="assets/js/site-breadcrumbs.js?v=1"></script>';

const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".html"));
let updated = 0;

files.forEach((file) => {
  if (skip.has(file)) return;
  const full = path.join(docsDir, file);
  let html = fs.readFileSync(full, "utf8");
  if (html.includes("site-breadcrumbs.js")) return;
  if (!html.includes("</body>")) return;
  html = html.replace("</body>", tag + "\n</body>");
  fs.writeFileSync(full, html);
  updated += 1;
  console.log("added breadcrumbs:", file);
});

console.log("done, updated", updated, "files");
