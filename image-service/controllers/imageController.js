// imageController.js
const path = require("path");
const {
  createImageRecord,
  getAllImages,
  getImageById,
  getImagesByPatientId,
  getAnnotations,
  saveAnnotations
} = require("../services/imageStorageService");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");

function uploadImage(req, res) {
  try {
    const { patientId, uploadedByUserId } = req.body;

    if (!patientId || !uploadedByUserId) {
      return res.status(400).json({ message: "patientId and uploadedByUserId are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageRecord = createImageRecord({
      patientId,
      uploadedByUserId,
      originalName: req.file.originalname,
      storedFilename: req.file.filename,
      mimeType: req.file.mimetype
    });

    return res.status(201).json({
      ...imageRecord,
      fileUrl: `/files/${imageRecord.storedFilename}`
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

function listAllImages(req, res) {
  try {
    const images = getAllImages().map((img) => ({
      ...img,
      fileUrl: `/files/${img.storedFilename}`
    }));
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

function listImagesForPatient(req, res) {
  try {
    const { patientId } = req.params;
    const images = getImagesByPatientId(patientId).map((img) => ({
      ...img,
      fileUrl: `/files/${img.storedFilename}`
    }));
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

function getImageMetadata(req, res) {
  try {
    const { imageId } = req.params;
    const image = getImageById(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.status(200).json({
      ...image,
      fileUrl: `/files/${image.storedFilename}`
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

function getImageAnnotations(req, res) {
  try {
    const { imageId } = req.params;
    const image = getImageById(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.status(200).json(getAnnotations(imageId));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

function annotateImage(req, res) {
  try {
    const { imageId } = req.params;
    const { actions } = req.body;

    if (!Array.isArray(actions)) {
      return res.status(400).json({ message: "actions must be an array" });
    }

    const image = getImageById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const saved = saveAnnotations(imageId, actions);
    return res.status(200).json(saved);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  uploadImage,
  listAllImages,
  listImagesForPatient,
  getImageMetadata,
  getImageAnnotations,
  annotateImage
};