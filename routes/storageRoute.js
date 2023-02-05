const { Router } = require("express");
const {
  uploadAssets,
  deleteAssets,
} = require("../controller/storageController");
const { validate } = require("../middleware/validation");
const uploadFile = require("../utils/multerConfig");

const storageRoutes = Router();

storageRoutes.post("/upload/assets", uploadFile.single("file"), uploadAssets);
storageRoutes.delete("/delete/assets", deleteAssets);

module.exports = storageRoutes;
