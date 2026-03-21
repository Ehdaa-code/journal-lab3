// imageRoutes.js
const express = require("express");
const router = express.Router();

const { upload } = require("../middleware/uploadMiddleware");
const {
  uploadImage,
  listAllImages,
  listImagesForPatient,
  getImageMetadata,
  getImageAnnotations,
  annotateImage
} = require("../controllers/imageController");

router.post("/upload", upload.single("image"), uploadImage);

router.get("/", listAllImages);
router.get("/patient/:patientId", listImagesForPatient);
router.get("/:imageId", getImageMetadata);
router.get("/:imageId/annotations", getImageAnnotations);
router.put("/:imageId/annotate", annotateImage);

module.exports = router;