// ensureDataDirs.js
const fs = require("fs");
const path = require("path");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureFile(filePath, defaultContent) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, "utf8");
  }
}

function ensureDataDirs(dataDir) {
  const imagesDir = path.join(dataDir, "images");
  const annotationsDir = path.join(dataDir, "annotations");
  const indexFile = path.join(dataDir, "index.json");

  ensureDir(dataDir);
  ensureDir(imagesDir);
  ensureDir(annotationsDir);
  ensureFile(indexFile, JSON.stringify([], null, 2));
}

module.exports = { ensureDataDirs };