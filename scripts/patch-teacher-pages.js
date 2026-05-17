const fs = require("fs");
const path = require("path");

const teacherDir = path.join(__dirname, "..", "docs", "modules", "verb-tenses");

function patchFile(file) {
  let html = fs.readFileSync(file, "utf8");
  let changed = false;

  if (html.includes("teacher-worksheet.js") && !html.includes("teacher-v14")) {
    html = html.replace(/teacher-worksheet\.js\?v=teacher-v\d+/g, "teacher-worksheet.js?v=teacher-v14");
    html = html.replace(
      /<script src="([^"]*teacher-worksheet\.js)"><\/script>/,
      '<script src="$1?v=teacher-v14"></script>'
    );
    changed = true;
  }

  if (html.includes("teacher-panel.css") && !html.includes("teacher-v14")) {
    html = html.replace(/teacher-panel\.css\?v=teacher-v\d+/g, "teacher-panel.css?v=teacher-v14");
    changed = true;
  }

  const pathsBlock =
    '<script src="../../../../assets/js/site-paths.js?v=2"></script>\n';
  if (html.includes("teacher-worksheet.js") && html.indexOf(pathsBlock) > html.indexOf("teacher-worksheet.js")) {
    html = html.replace(pathsBlock, "");
    html = html.replace(
      /(<script src="[^"]*exercise-pools[^"]*\.js"><\/script>\n)/,
      pathsBlock + "$1"
    );
    if (!html.includes(pathsBlock.trim())) {
      html = html.replace(
        /(<script src="[^"]*exercise-pool-present-continuous-b1[^"]*"><\/script>\n)/,
        pathsBlock + "$1"
      );
      html = html.replace(
        /(<script src="[^"]*exercise-pool-present-simple[^"]*"><\/script>\n)/,
        pathsBlock + "$1"
      );
    }
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, html);
    console.log("patched", file);
  }
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.includes("teacher") && name.endsWith(".html")) patchFile(p);
  }
}

walk(teacherDir);
