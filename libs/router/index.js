const { Router } = require("express");
const storageRoutes = require("../../routes/storageRoute");
const userRoutes = require("../../routes/userRoute");

const router = Router();

router.use("/user", userRoutes);
router.use("/storage", storageRoutes);

module.exports = router;
