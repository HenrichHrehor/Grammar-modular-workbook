const fs = require("fs");
const path = require("path");

const gateNav = {
  "present-simple": {
    partLabel: "Present Simple",
    practiceFile: "present-simple-exercises.html"
  },
  "present-continuous": {
    partLabel: "Present Continuous",
    practiceFile: "present-continuous-exercises.html"
  }
};

function gateBlock(part, level, unlockLabel) {
  const g = gateNav[part];
  return `  <nav class="teacher-gate-nav teacher-gate-nav--static" aria-label="Back to workbook">
    <p class="teacher-gate-nav-title">Leave this page</p>
    <div class="teacher-gate-nav-links">
      <a class="teacher-gate-nav-link" href="../../../../contents.html">Home</a>
      <a class="teacher-gate-nav-link" href="../../index.html">Verb Tenses — Module map</a>
      <a class="teacher-gate-nav-link" href="../index.html">${g.partLabel} — Module map</a>
      <a class="teacher-gate-nav-link" href="../practice/${g.practiceFile}?level=${level}">${level.toUpperCase()} Practice</a>
    </div>
    <p class="teacher-gate-nav-hint">Students: use <strong>Practice</strong> or <strong>Home</strong>. Teachers only: unlock with your password.</p>
  </nav>`;
}

const tag = "mo" + "tion";
function fixMotion(s) {
  return s.split("<" + tag).join("<div").split("</" + tag + ">").join("</div>");
}

function patchFile(file) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("teacher-gate-nav--static")) {
    console.log("skip (already has nav)", file);
    return;
  }

  const part = file.includes("present-continuous") ? "present-continuous" : "present-simple";
  const levelMatch = file.match(/data-teacher-level="([^"]+)"/);
  const level = levelMatch ? levelMatch[1] : "b1";
  const unlockMatch = html.match(/Unlock (B\d|C\d)/i);
  const unlockLabel = unlockMatch ? unlockMatch[1] : level.toUpperCase();

  const nav = gateBlock(part, level, unlockLabel);

  html = html.replace(
    /<p id="gateError" class="gate-error" aria-live="polite"><\/p>\s*<\/div>/,
    '<p id="gateError" class="gate-error" aria-live="polite"></p>\n' + nav + "\n</div>"
  );

  html = html.replace(/autocomplete="off"/g, 'autocomplete="current-password"');
  html = html.replace(/teacher-worksheet\.js\?v=teacher-v\d+/g, "teacher-worksheet.js?v=teacher-v15");

  fs.writeFileSync(file, html);
  console.log("patched", file);
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.includes("teacher") && name.endsWith(".html")) patchFile(p);
  }
}

walk(path.join(__dirname, "..", "docs", "modules", "verb-tenses"));
