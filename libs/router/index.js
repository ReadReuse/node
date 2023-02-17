const { Router } = require("express");
const feedRoutes = require("../../routes/feedRoutes");
const notesRoute = require("../../routes/notesRoutes");
const storageRoutes = require("../../routes/storageRoute");
const userRoutes = require("../../routes/userRoute");

const router = Router();

router.use("/user", userRoutes);
router.use("/storage", storageRoutes);
router.use("/feed", feedRoutes);
router.use("/notes", notesRoute);

module.exports = router;
