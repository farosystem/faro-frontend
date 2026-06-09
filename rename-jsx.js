const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "src");

function scanAndRename(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanAndRename(fullPath);
    } else if (file.endsWith(".js")) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (content.match(/return\s*\(.*<[\w]/s) || content.includes("React")) {
        const newPath = fullPath.replace(/\.js$/, ".jsx");
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed: ${file} → ${path.basename(newPath)}`);
      }
    }
  });
}

scanAndRename(root);
