const fs = require("fs");
const path = require("path");

function walk(dir, files = []) {
  fs.readdirSync(dir).forEach((name) => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith(".html")) files.push(full);
  });
  return files;
}

const docs = path.join(__dirname, "..", "docs");
const modulesDir = path.join(docs, "modules");

walk(modulesDir).forEach((file) => {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("site-paths.js")) return;
  const rel = path.relative(docs, file).replace(/\\/g, "/");
  const depth = rel.split("/").length - 1;
  const prefix = "../".repeat(depth);
  const block =
    '<script src="' + prefix + 'assets/js/site-paths.js"></script>\n' +
    '<script src="' + prefix + 'assets/js/site-breadcrumbs.js?v=3"></script>\n';
  if (html.includes("</body>")) {
    html = html.replace("</body>", block + "</body>");
    fs.writeFileSync(file, html);
    console.log("scripts:", rel);
  }
});
