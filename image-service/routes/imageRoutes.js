// imageRoutes.js
const express = require("express");
const router = express.Router();

const { authorizeRoles } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  uploadImage,
  listAllImages,
  listImagesForPatient,
  getImageMetadata,
  getImageAnnotations,
  annotateImage
} = require("../controllers/imageController");

router.post("/upload", authorizeRoles("DOCTOR", "STAFF", "ADMIN"), upload.single("image"), uploadImage);

router.get("/", listAllImages);
router.get("/patient/:patientId", listImagesForPatient);
router.get("/:imageId", getImageMetadata);
router.get("/:imageId/annotations", getImageAnnotations);
router.put("/:imageId/annotate", authorizeRoles("DOCTOR", "ADMIN"), annotateImage);

module.exports = router;
