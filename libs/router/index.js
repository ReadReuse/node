const { Router } = require("express");
const userRoutes = require("../../routes/userRoute");

const router = Router();

router.use("/user", userRoutes);

module.exports = router;
