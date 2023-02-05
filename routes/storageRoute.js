const { Router } = require("express");
const { uploadAssets } = require("../controller/storageController");
const { validate } = require("../middleware/validation");
const uploadFile = require("../utils/multerConfig");

const storageRoutes = Router();

storageRoutes.post("/upload/assets", uploadFile.single("file"), uploadAssets);

module.exports = storageRoutes;
