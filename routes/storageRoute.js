const { Router } = require("express");
const { uploadAvatar } = require("../controller/storageController");
const { validate } = require("../middleware/validation");
const uploadFile = require("../utils/multerConfig");

const storageRoutes = Router();

storageRoutes.post("/upload/avatar", uploadFile.single("file"), uploadAvatar);

module.exports = storageRoutes;
