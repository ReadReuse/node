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
  getAllDetailsCount,
  getUserList,
  getUserDetails,
  searchUser,
} = require("../controller/userController");
const { validate } = require("../middleware/validation");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

userRoutes.post("/login", validate("body", loginContract), userLogin);
userRoutes.post("/verifyOtp", validate("body", otpVerifyContract), verifyOtp);
userRoutes.post(
  "/registerUser/:userId",
  validate("body", userRegisterContract),
  registerUserDetails
);

userRoutes.get("/userDetails", isAuthenticatedUser, getUserDetailFromToken);

userRoutes.post(
  "/updateCurrentLocation",
  isAuthenticatedUser,
  updateCurrentLocation
);

// admin routes

userRoutes.get(
  "/getAllCounts",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  getAllDetailsCount
);

userRoutes.get(
  "/usersList",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  getUserList
);

userRoutes.get(
  "/userDetails/:userId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  getUserDetails
);

userRoutes.get(
  "/searchUser",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  searchUser
);
userRoutes.post(
  "/blockUser/:userId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  blockUser
);

module.exports = userRoutes;
