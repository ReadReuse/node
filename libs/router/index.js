const { Router } = require("express");
const feedRoutes = require("../../routes/feedRoutes");
const storageRoutes = require("../../routes/storageRoute");
const userRoutes = require("../../routes/userRoute");

const router = Router();

router.use("/user", userRoutes);
router.use("/storage", storageRoutes);
router.use("/feed", feedRoutes);

module.exports = router;
