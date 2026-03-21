// imageStorageService.js
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const INDEX_FILE = path.join(DATA_DIR, "index.json");
const ANNOTATIONS_DIR = path.join(DATA_DIR, "annotations");

function readIndex() {
  if (!fs.existsSync(INDEX_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(INDEX_FILE, "utf8");
  return raw ? JSON.parse(raw) : [];
}

function writeIndex(data) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(data, null, 2), "utf8");
}

function createImageRecord({ patientId, uploadedByUserId, originalName, storedFilename, mimeType }) {
  const index = readIndex();

  const imageRecord = {
    id: uuidv4(),
    patientId: Number(patientId),
    uploadedByUserId: Number(uploadedByUserId),
    originalName,
    storedFilename,
    mimeType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  index.push(imageRecord);
  writeIndex(index);

  const annotationFile = path.join(ANNOTATIONS_DIR, `${imageRecord.id}.json`);
  fs.writeFileSync(annotationFile, JSON.stringify({ imageId: imageRecord.id, actions: [] }, null, 2), "utf8");

  return imageRecord;
}

function getAllImages() {
  return readIndex();
}

function getImageById(imageId) {
  const index = readIndex();
  return index.find((img) => img.id === imageId) || null;
}

function getImagesByPatientId(patientId) {
  const index = readIndex();
  return index
    .filter((img) => Number(img.patientId) === Number(patientId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getAnnotationFilePath(imageId) {
  return path.join(ANNOTATIONS_DIR, `${imageId}.json`);
}

function getAnnotations(imageId) {
  const filePath = getAnnotationFilePath(imageId);
  if (!fs.existsSync(filePath)) {
    return { imageId, actions: [] };
  }
  const raw = fs.readFileSync(filePath, "utf8");
  return raw ? JSON.parse(raw) : { imageId, actions: [] };
}

function saveAnnotations(imageId, actions) {
  const image = getImageById(imageId);
  if (!image) {
    return null;
  }

  const filePath = getAnnotationFilePath(imageId);
  const annotationData = {
    imageId,
    actions: Array.isArray(actions) ? actions : []
  };
  fs.writeFileSync(filePath, JSON.stringify(annotationData, null, 2), "utf8");

  const index = readIndex();
  const updated = index.map((img) => {
    if (img.id === imageId) {
      return {
        ...img,
        updatedAt: new Date().toISOString()
      };
    }
    return img;
  });
  writeIndex(updated);

  return annotationData;
}

module.exports = {
  createImageRecord,
  getAllImages,
  getImageById,
  getImagesByPatientId,
  getAnnotations,
  saveAnnotations
};