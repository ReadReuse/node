const { Router } = require("express");
const {
  loginContract,
  otpVerifyContract,
  userRegisterContract,
} = require("../contracts/user");
const userRoutes = Router();
const {
  userLogin,
  verifyOtp,
  registerUserDetails,
  blockUser,
} = require("../controller/userController");
const { validate } = require("../middleware/validation");

userRoutes.post("/login", validate("body", loginContract), userLogin);
userRoutes.post("/verifyOtp", validate("body", otpVerifyContract), verifyOtp);
userRoutes.post(
  "/registerUser/:userId",
  validate("body", userRegisterContract),
  registerUserDetails
);
userRoutes.post("/blockUser/:userId", blockUser);

module.exports = userRoutes;
