const fs = require("fs");
const path = require("path");

const docs = path.join(__dirname, "..", "docs");
const registryLine =
  '<script src="../../../../assets/js/modules-registry.js"></script>';
const registryLine3 =
  '<script src="../../../assets/js/modules-registry.js"></script>';
const pathsLine = '<script src="../../../../assets/js/site-paths.js"></script>';
const pathsLine2 = '<script src="../../../assets/js/site-paths.js"></script>';
const crumbsV5 = '<script src="../../../../assets/js/site-breadcrumbs.js?v=5"></script>';
const crumbsV5rel3 = '<script src="../../../assets/js/site-breadcrumbs.js?v=5"></script>';

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (name.endsWith(".html")) files.push(p);
  }
  return files;
}

function depthToRoot(file) {
  const rel = path.relative(docs, file).replace(/\\/g, "/");
  return rel.split("/").length - 1;
}

function assetPrefix(depth) {
  return "../".repeat(depth);
}

function patchFile(file) {
  let c = fs.readFileSync(file, "utf8");
  const rel = path.relative(docs, file).replace(/\\/g, "/");
  if (!rel.startsWith("modules/")) return false;
  if (rel.endsWith("/index.html")) {
    if (!c.includes("modules-registry.js")) {
      c = c.replace(
        /(<script src="[^"]*site-paths\.js"><\/script>)/,
        "$1\n<script src=\"" +
          assetPrefix(depthToRoot(file)) +
          'assets/js/modules-registry.js"></script>'
      );
    }
    c = c.replace(/site-breadcrumbs\.js\?v=\d+/g, "site-breadcrumbs.js?v=5");
    fs.writeFileSync(file, c);
    return true;
  }

  if (!/\/(theory|practice|teacher)\//.test(rel)) return false;

  const depth = depthToRoot(file);
  const prefix = assetPrefix(depth);
  const regScript =
    '<script src="' + prefix + 'assets/js/modules-registry.js"></script>';
  const pathsScript =
    '<script src="' + prefix + 'assets/js/site-paths.js"></script>';
  const crumbsScript =
    '<script src="' + prefix + 'assets/js/site-breadcrumbs.js?v=5"></script>';

  c = c.replace(/<script src="[^"]*site-breadcrumbs\.js[^"]*"><\/script>\s*/g, "");
  c = c.replace(/<script src="[^"]*modules-registry\.js"><\/script>\s*/g, "");
  c = c.replace(/<script src="[^"]*site-paths\.js"><\/script>\s*/g, "");

  if (rel.includes("present-simple/practice/")) {
    c = c.replace(
      /<body([^>]*)>/,
      '<body$1 data-exercise-module="present-simple">'
    );
  }

  const insert = "\n" + pathsScript + "\n" + regScript + "\n" + crumbsScript + "\n";
  if (c.includes("site-breadcrumbs.js?v=5")) {
    fs.writeFileSync(file, c);
    return true;
  }
  c = c.replace(/<\/body>/i, insert + "</body>");
  fs.writeFileSync(file, c);
  return true;
}

let n = 0;
for (const f of walk(docs)) {
  if (patchFile(f)) n++;
}
console.log("patched", n, "files");
