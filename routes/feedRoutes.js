const { Router } = require("express");
const {
  createFeedContract,
  updateFeedContract,
  searchQueryContract,
} = require("../contracts/feeed");
const {
  createFeedController,
  listAllFeed,
  blockedFeed,
  getUnverifiedFeedList,
  verifyFeed,
  getAllUserCreatedFeed,
  deleteFeedByUser,
  deleteFeedByAdmin,
  editFeedController,
  bookmarkFeed,
  searchFeedController,
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

feedRoutes.put(
  "/:feedId",
  isAuthenticatedUser,
  validate("body", updateFeedContract),
  editFeedController
);

feedRoutes.get("/getFeeds", isAuthenticatedUser, listAllFeed);

feedRoutes.get(
  "/search",
  isAuthenticatedUser,
  validate("query", searchQueryContract),
  searchFeedController
);

// particular user feed
feedRoutes.get("/userFeeds", isAuthenticatedUser, getAllUserCreatedFeed);

feedRoutes.delete(
  "/userFeedDelete/:feedId",
  isAuthenticatedUser,
  deleteFeedByUser
);

feedRoutes.get("/save/:feedId", isAuthenticatedUser, bookmarkFeed);

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

feedRoutes.delete(
  "/adminFeedDelete/:feedId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  deleteFeedByAdmin
);

module.exports = feedRoutes;
