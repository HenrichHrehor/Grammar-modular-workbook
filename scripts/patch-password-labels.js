const fs = require("fs");
const path = require("path");

const docs = path.join(__dirname, "..", "docs");

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html") && p.includes("teacher")) {
      let c = fs.readFileSync(p, "utf8");
      const n2 = c
        .replace(/Enter the teacher password/g, "Password needed to unlock")
        .replace(/placeholder="Password"/g, 'placeholder="Password needed"');
      if (n2 !== c) {
        fs.writeFileSync(p, n2);
        console.log("updated", p);
      }
    }
  }
}

walk(docs);
