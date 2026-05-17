const fs = require("fs");
const path = require("path");

const pcTeacher = path.join(__dirname, "..", "docs", "modules", "verb-tenses", "present-continuous", "teacher");
["b1", "b2", "c1"].forEach((lvl) => {
  const file = path.join(pcTeacher, "present-continuous-teacher-" + lvl + ".html");
  let html = fs.readFileSync(file, "utf8");
  html = html
    .replace(/Present Simple/g, "Present Continuous")
    .replace(/present-simple/g, "present-continuous")
    .replace(/data-teacher-level="/, 'data-teacher-module="present-continuous" data-teacher-level="')
    .replace(/exercise-pool-present-simple\.js/g, "exercise-pool-present-continuous-b1.js")
    .replace(/exercise-pool-b2\.js/g, "exercise-pool-present-continuous-b2.js")
    .replace(/exercise-pool-c1\.js/g, "exercise-pool-present-continuous-c1.js")
    .replace(/exercise-pools-init\.js/g, "exercise-pools-present-continuous-init.js")
    .replace(/site-breadcrumbs\.js\?v=1"><\/script>\s*<script src="[^"]*site-paths\.js"><\/script>/, "")
    .replace(/teacher-worksheet\.js\?v=[^"]+"/, 'teacher-worksheet.js?v=teacher-v12"');
  if (!html.includes("site-paths.js")) {
    html = html.replace(
      "</body>",
      '<script src="../../../../assets/js/site-paths.js"></script>\n<script src="../../../../assets/js/site-breadcrumbs.js?v=3"></script>\n</body>'
    );
  }
  fs.writeFileSync(file, html);
  console.log("adapted teacher", lvl);
});
