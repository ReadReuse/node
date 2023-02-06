const { Router } = require("express");
const { createFeedContract } = require("../contracts/feeed");
const {
  createFeedController,
  listAllFeed,
  blockedFeed,
  getUnverifiedFeedList,
  verifyFeed,
} = require("../controller/feedController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const { validate } = require("../middleware/validation");

const feedRoutes = Router();

feedRoutes.post(
  "/create",
  isAuthenticatedUser,
  validate("body", createFeedContract),
  createFeedController
);

feedRoutes.get("/getFeeds", isAuthenticatedUser, listAllFeed);

// admin routes
feedRoutes.get(
  "/blocked/:feedId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  blockedFeed
);

feedRoutes.get(
  "/verify/:feedId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  verifyFeed
);

feedRoutes.get(
  "/unVerifiedFeed",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  getUnverifiedFeedList
);

module.exports = feedRoutes;
