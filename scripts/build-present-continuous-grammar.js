const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "Grammar text_Html codes", "Present continuous.txt");
const dest = path.join(
  __dirname,
  "..",
  "docs",
  "modules",
  "verb-tenses",
  "present-continuous",
  "theory",
  "present-continuous-grammar.html"
);

const raw = fs.readFileSync(src, "utf8");
const boxes = raw.match(/<div class="box[\s\S]*?<\/div>/g) || [];
const body = boxes.join("\n\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Present Continuous — Grammar</title>
  <link rel="stylesheet" href="../../../../assets/css/workbook.css?v=site-v6">
</head>
<body>

<div class="sheet sheet--grammar">
  <motion class="nav-bar">
    <div class="nav-links">
      <a href="../../../../contents.html" class="nav-btn">🏠 Site</a>
      <a href="../index.html" class="nav-btn">📖 Module map</a>
      <a href="present-continuous-grammar.html" class="nav-btn active">📚 Grammar</a>
      <a href="../practice/present-continuous-exercises.html" class="nav-btn">✏️ Practice</a>
      <a href="../teacher/present-continuous-teacher-b1.html" class="nav-btn">🎯 B1</a>
      <a href="../teacher/present-continuous-teacher-b2.html" class="nav-btn">🚀 B2</a>
    </div>
    <div class="nav-right">
      <button type="button" class="print-btn" onclick="window.print()">🖨️ Print</button>
    </div>
  </div>

  <div class="top-bar">
    <div class="student-info">
      <motion><strong>Student:</strong></div>
      <div><strong>Date:</strong> <input type="date" class="date-input" aria-label="Worksheet date"></div>
    </div>
    <div class="page-tag">📚 Grammar reference</div>
  </div>

  <h1>Present Continuous</h1>
  <p class="subtitle">Also called Present Progressive — used for actions happening now</p>

  <div class="grammar-pool-callout">
    <strong>Linked to practice:</strong> -ing form, affirmative, negative, and questions match the four exercise blocks.
    <a href="../practice/present-continuous-exercises.html">Practice</a> ·
    <a href="../index.html">Module map</a>
  </div>

  <div class="grammar-body">
    <div class="grid">
${body}
    </div>
  </div>
</div>

<script src="../../../../assets/js/site-paths.js"></script>
<script src="../../../../assets/js/site-breadcrumbs.js?v=3"></script>
</body>
</html>
`;

const tag = "motion";
let out = html.split("<" + tag).join("<div");
out = out.split("</" + tag + ">").join("</div>");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log("wrote", dest, boxes.length, "boxes");
