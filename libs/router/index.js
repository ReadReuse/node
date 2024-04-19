const { Router } = require("express");
const notesRoute = require("../../routes/notesRoutes");
const storageRoutes = require("../../routes/storageRoute");
const userRoutes = require("../../routes/userRoute");
const questionPaperRoute = require("../../routes/questionPaperRoutes");
const appInfoRoute = require("../../routes/appInfoRoutes");

const router = Router();

router.use("/user", userRoutes);
router.use("/storage", storageRoutes);
router.use("/notes", notesRoute);
router.use("/question-paper", questionPaperRoute);
router.use("/appInfo", appInfoRoute);

module.exports = router;
