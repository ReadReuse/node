const { Router } = require("express");
const { appInfoContract } = require("../contracts/appInfo");
const {
  createAndUpdateAppInfo,
  getAppInfo,
} = require("../controller/appInfoController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const appInfoRoute = Router();
const { validate } = require("../middleware/validation");

appInfoRoute.post(
  "/",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  validate("body", appInfoContract),
  createAndUpdateAppInfo
);

appInfoRoute.get("/", getAppInfo);

module.exports = appInfoRoute;
