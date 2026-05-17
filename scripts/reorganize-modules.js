const fs = require("fs");
const path = require("path");

const docs = path.join(__dirname, "..", "docs");

const MOVES = [
  ["present-simple-contents.html", "modules/verb-tenses/present-simple/index.html"],
  ["present-simple-grammar.html", "modules/verb-tenses/present-simple/theory/present-simple-grammar.html"],
  ["present-simple-exercises.html", "modules/verb-tenses/present-simple/practice/present-simple-exercises.html"],
  ["present-simple-exercises-protected.html", "modules/verb-tenses/present-simple/practice/present-simple-exercises-protected.html"],
  ["present-simple-b1.html", "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b1.html"],
  ["present-simple-b2.html", "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b2.html"],
  ["present-simple-c1.html", "modules/verb-tenses/present-simple/teacher/present-simple-teacher-c1.html"],
  ["present-continuous-contents.html", "modules/verb-tenses/present-continuous/index.html"],
  ["grammar-appendix-passive.html", "modules/grammar-appendix/passive-voice/theory/passive-voice-grammar-b1.html"]
];

const LINK_MAP = {
  "contents.html": "contents.html",
  "present-simple-contents.html": "modules/verb-tenses/present-simple/index.html",
  "present-simple-grammar.html": "modules/verb-tenses/present-simple/theory/present-simple-grammar.html",
  "present-simple-exercises.html": "modules/verb-tenses/present-simple/practice/present-simple-exercises.html",
  "present-simple-exercises-protected.html": "modules/verb-tenses/present-simple/practice/present-simple-exercises-protected.html",
  "present-simple-exercises-b2.html": "modules/verb-tenses/present-simple/practice/present-simple-exercises.html?level=b2",
  "present-simple-exercises-c1.html": "modules/verb-tenses/present-simple/practice/present-simple-exercises.html?level=c1",
  "present-simple-exercises-v2.html": "modules/verb-tenses/present-simple/practice/present-simple-exercises.html",
  "present-simple-b1.html": "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b1.html",
  "present-simple-b2.html": "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b2.html",
  "present-simple-c1.html": "modules/verb-tenses/present-simple/teacher/present-simple-teacher-c1.html",
  "grammar-appendix-passive.html": "modules/grammar-appendix/passive-voice/theory/passive-voice-grammar-b1.html",
  "present-continuous-contents.html": "modules/verb-tenses/present-continuous/index.html"
};

function depthPrefix(relDir) {
  const parts = relDir.split("/").filter(Boolean);
  return parts.length ? "../".repeat(parts.length) : "";
}

function rewriteHtml(html, relDir) {
  const prefix = depthPrefix(relDir);

  html = html.replace(/href="assets\//g, 'href="' + prefix + "assets/");
  html = html.replace(/src="assets\//g, 'src="' + prefix + "assets/");

  Object.keys(LINK_MAP).forEach((oldName) => {
    const target = LINK_MAP[oldName];
    const relTarget = prefix + target;
    html = html.split('href="' + oldName).join('href="' + relTarget);
    html = html.split("href='" + oldName).join("href='" + relTarget);
  });

  html = html.replace(
    /href="modules\/verb-tenses\/present-simple\/practice\/present-simple-exercises\.html\?level=b2"/g,
  'href="../practice/present-simple-exercises.html?level=b2"'
  );
  html = html.replace(
    /href="modules\/verb-tenses\/present-simple\/practice\/present-simple-exercises\.html\?level=c1"/g,
  'href="../practice/present-simple-exercises.html?level=c1"'
  );

  const psIndex = prefix + "modules/verb-tenses/present-simple/index.html";
  html = html.replace(
    /href="modules\/verb-tenses\/present-simple\/index\.html"/g,
    'href="' + (relDir === "modules/verb-tenses/present-simple" ? "index.html" : psIndex) + '"'
  );

  if (relDir.startsWith("modules/verb-tenses/present-simple/theory")) {
    html = html.replace(
      /href="[^"]*present-simple-exercises\.html/g,
      'href="../practice/present-simple-exercises.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-b1\.html/g,
      'href="../teacher/present-simple-teacher-b1.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-b2\.html/g,
      'href="../teacher/present-simple-teacher-b2.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-c1\.html/g,
      'href="../teacher/present-simple-teacher-c1.html'
    );
  }

  if (relDir.startsWith("modules/verb-tenses/present-simple/practice")) {
    html = html.replace(
      /href="[^"]*present-simple-grammar\.html/g,
      'href="../theory/present-simple-grammar.html'
    );
    html = html.replace(
      /href="[^"]*present-simple\/index\.html/g,
      'href="../index.html'
    );
  }

  if (relDir.startsWith("modules/verb-tenses/present-simple/teacher")) {
    html = html.replace(
      /href="[^"]*present-simple-grammar\.html/g,
      'href="../theory/present-simple-grammar.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-exercises\.html/g,
      'href="../practice/present-simple-exercises.html'
    );
    html = html.replace(
      /href="[^"]*present-simple\/index\.html/g,
      'href="../index.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-b1\.html/g,
      'href="present-simple-teacher-b1.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-b2\.html/g,
      'href="present-simple-teacher-b2.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-c1\.html/g,
      'href="present-simple-teacher-c1.html'
    );
  }

  if (relDir === "modules/verb-tenses/present-simple") {
    html = html.replace(
      /href="[^"]*present-simple-grammar\.html/g,
      'href="theory/present-simple-grammar.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-exercises\.html/g,
      'href="practice/present-simple-exercises.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-b1\.html/g,
      'href="teacher/present-simple-teacher-b1.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-b2\.html/g,
      'href="teacher/present-simple-teacher-b2.html'
    );
    html = html.replace(
      /href="[^"]*present-simple-teacher-c1\.html/g,
      'href="teacher/present-simple-teacher-c1.html'
    );
    html = html.replace(
      /href="[^"]*passive-voice-grammar-b1\.html/g,
      'href="../../grammar-appendix/passive-voice/theory/passive-voice-grammar-b1.html'
    );
    html = html.replace(
      /href="[^"]*grammar-appendix-passive\.html/g,
      'href="../../grammar-appendix/passive-voice/theory/passive-voice-grammar-b1.html'
    );
  }

  return html;
}

function writeRedirect(oldRel, newRel) {
  const oldPath = path.join(docs, oldRel);
  const depth = oldRel.split("/").length - 1;
  const prefix = depth ? "../".repeat(depth) : "";
  const target = prefix + newRel;
  const title = "Redirect";
  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${target}">
  <link rel="canonical" href="${target}">
  <title>${title}</title>
</head>
<body>
  <p><a href="${target}">Continue</a></p>
</body>
</html>
`;
  fs.mkdirSync(path.dirname(oldPath), { recursive: true });
  fs.writeFileSync(oldPath, body);
}

MOVES.forEach(([from, to]) => {
  const src = path.join(docs, from);
  const dest = path.join(docs, to);
  if (!fs.existsSync(src)) {
    console.warn("skip missing:", from);
    return;
  }
  let html = fs.readFileSync(src, "utf8");
  const relDir = path.dirname(to).replace(/\\/g, "/");
  html = rewriteHtml(html, relDir);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  writeRedirect(from, to);
  console.log("moved", from, "->", to);
});

["present-simple-exercises-b2.html", "present-simple-exercises-c1.html", "present-simple-exercises-v2.html"].forEach((f) => {
  const map = LINK_MAP[f];
  if (map) writeRedirect(f, map.split("?")[0] + (map.includes("?") ? "?" + map.split("?")[1] : ""));
});

console.log("Done. Update contents.html and JS configs manually or re-run site sync.");
