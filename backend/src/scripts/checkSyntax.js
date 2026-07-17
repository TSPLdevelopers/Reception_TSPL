const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../..");
const files = [];

const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (["node_modules", ".git"].includes(entry.name)) continue;
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) walk(absolute);
        else if (entry.name.endsWith(".js")) files.push(absolute);
    }
};

walk(root);

for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", file], {
        encoding: "utf8"
    });

    if (result.status !== 0) {
        console.error(result.stderr || result.stdout);
        process.exit(1);
    }
}

console.log(`Syntax check passed for ${files.length} JavaScript files.`);
