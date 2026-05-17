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

const modulesDir = path.join(__dirname, "..", "docs", "modules");

walk(modulesDir).forEach((file) => {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = html.replace(
    /href="[^"]*\/modules\/verb-tenses\/present-simple\/practice\/present-simple-exercises\.html/g,
    'href="present-simple-exercises.html'
  );
  html = html.replace(
    /href="[^"]*\/modules\/verb-tenses\/present-simple\/theory\/present-simple-grammar\.html/g,
    'href="present-simple-grammar.html'
  );
  html = html.replace(
    /href="[^"]*\/modules\/verb-tenses\/present-simple\/index\.html/g,
    'href="index.html'
  );
  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log("fixed", path.relative(modulesDir, file));
  }
});
