const fs = require("fs");
const path = require("path");

const contentsPath = path.join(__dirname, "..", "docs", "contents.html");
let html = fs.readFileSync(contentsPath, "utf8");

const markerStart = '<section class="home-section home-section--modules"';
const markerEnd = '<section class="home-section home-section--scheme"';
const start = html.indexOf(markerStart);
const end = html.indexOf(markerEnd);

if (start >= 0 && end > start) {
  html = html.slice(0, start) + html.slice(end);
  fs.writeFileSync(contentsPath, html);
  console.log("Removed duplicate Tense modules section");
} else {
  console.log("Section not found", start, end);
}

const docsDir = path.join(__dirname, "..", "docs");
fs.readdirSync(docsDir)
  .filter((f) => f.endsWith(".html"))
  .forEach((file) => {
    const full = path.join(docsDir, file);
    let page = fs.readFileSync(full, "utf8");
    const next = page.replace(/📖 Module<\/a>/g, "📖 Module map</a>");
    if (next !== page) {
      fs.writeFileSync(full, next);
      console.log("nav label:", file);
    }
  });
