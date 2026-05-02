// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const { authenticateToken } = require("./middleware/authMiddleware");
const imageRoutes = require("./routes/imageRoutes");
const { ensureDataDirs } = require("./utils/ensureDataDirs");

const app = express();
const PORT = process.env.PORT || 8084;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");

ensureDataDirs(DATA_DIR);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/images", authenticateToken, imageRoutes);

app.use("/files", express.static(path.join(DATA_DIR, "images")));

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "image-service",
    status: "UP"
  });
});

app.listen(PORT, () => {
  console.log(`image-service running on port ${PORT}`);
  console.log(`DATA_DIR=${DATA_DIR}`);
});
