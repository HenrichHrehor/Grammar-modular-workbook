const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "Grammar text_Html codes", "Past Simple.txt");
const dest = path.join(
  __dirname,
  "..",
  "docs",
  "modules",
  "verb-tenses",
  "past-simple",
  "theory",
  "past-simple-grammar.html"
);

const raw = fs.readFileSync(src, "utf8");
const gridMatch = raw.match(/<div class="grid">\s*([\s\S]*?)\s*<\/div>\s*<\/div>\s*<\/body>/i);
if (!gridMatch) {
  console.error("Could not extract grid content from source");
  process.exit(1);
}
const body = gridMatch[1].trim();

const D = "div";

const parts = [
  "<!DOCTYPE html>",
  '<html lang="en">',
  "<head>",
  '  <meta charset="UTF-8">',
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
  "  <title>Past Simple — Grammar</title>",
  '  <link rel="stylesheet" href="../../../../assets/css/workbook.css?v=site-v7">',
  "</head>",
  "<body>",
  "",
  '<div class="sheet sheet--grammar">',
  `  <${D} class="nav-bar">`,
  `    <${D} class="nav-links">`,
  '      <a href="../../../../contents.html" class="nav-btn">🏠 Home</a>',
  '      <a href="../index.html" class="nav-btn">📖 Module map</a>',
  '      <a href="past-simple-grammar.html" class="nav-btn active">📚 Grammar</a>',
  "    </div>",
  '    <div class="nav-right">',
  '      <button type="button" class="print-btn" onclick="window.print()">🖨️ Print</button>',
  "    </div>",
  "  </div>",
  "",
  '  <div class="top-bar">',
  '    <div class="student-info">',
  "      <div><strong>Student:</strong></div>",
  '      <div><strong>Date:</strong> <input type="date" class="date-input" aria-label="Worksheet date"></div>',
  `    </${D}>`,
  '    <div class="page-tag">📚 Grammar reference</div>',
  "  </div>",
  "",
  "  <h1>Past Simple</h1>",
  '  <p class="subtitle">Also called Present Progressive — used for actions happening now</p>',
  "",
  '  <div class="grammar-pool-callout">',
  "    <strong>Linked to practice:</strong> past form, affirmative, negative \(didn't\), and questions \(Did\) match the four exercise blocks.",
  '    <a href="../practice/past-simple-exercises.html?level=b1">B1 Past Simple Exercises</a> ·',
  '    <a href="../index.html">Module map</a>',
  "  </div>",
  "",
  '  <div class="grammar-body">',
  '    <div class="grid">',
  body,
  "    </div>",
  "  </div>",
  "</div>",
  "",
  '<script src="../../../../assets/js/site-paths.js"></script>',
  '<script src="../../../../assets/js/modules-registry.js"></script>',
  '<script src="../../../../assets/js/site-breadcrumbs.js?v=5"></script>',
  "</body>",
  "</html>",
];

let out = parts.join("\n");
const t = "mo" + "tion";
out = out.split("<" + t).join("<div");
out = out.split("</" + t + ">").join("</div>");

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);

const openDiv = (out.match(/<div/g) || []).length;
const closeDiv = (out.match(/<\/div>/g) || []).length;
console.log("wrote", dest, "motion balance:", openDiv, closeDiv, openDiv === closeDiv ? "OK" : "MISMATCH");
