const fs = require("fs");
const path = require("path");
const docsDir = path.join(__dirname, "..", "docs");
const version = "site-v4";

fs.readdirSync(docsDir)
  .filter((f) => f.endsWith(".html"))
  .forEach((file) => {
    const full = path.join(docsDir, file);
    let html = fs.readFileSync(full, "utf8");
    if (!html.includes("workbook.css")) return;
    const next = html.replace(/workbook\.css(\?v=[^"']+)?/g, "workbook.css?v=" + version);
    if (next !== html) {
      fs.writeFileSync(full, next);
      console.log("updated", file);
    }
  });
