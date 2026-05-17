const fs = require("fs");
const path = process.argv[2];
if (!path) {
  console.error("Usage: node fix-motion-tags.js <file>");
  process.exit(1);
}
let c = fs.readFileSync(path, "utf8");
const tag = "motion";
c = c.split("<" + tag).join("<div");
c = c.split("</" + tag + ">").join("</div>");
fs.writeFileSync(path, c);
const left = (c.match(/motion/g) || []).length;
console.log("fixed", path, "motion left:", left);
