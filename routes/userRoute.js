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
  updateCurrentLocation,
  getUserDetailFromToken,
} = require("../controller/userController");
const { validate } = require("../middleware/validation");
const { isAuthenticatedUser } = require("../middleware/auth");

userRoutes.post("/login", validate("body", loginContract), userLogin);
userRoutes.post("/verifyOtp", validate("body", otpVerifyContract), verifyOtp);
userRoutes.post(
  "/registerUser/:userId",
  validate("body", userRegisterContract),
  registerUserDetails
);

userRoutes.get("/userDetails", isAuthenticatedUser, getUserDetailFromToken);
userRoutes.post("/blockUser/:userId", blockUser);

userRoutes.post(
  "/updateCurrentLocation",
  isAuthenticatedUser,
  updateCurrentLocation
);

module.exports = userRoutes;
