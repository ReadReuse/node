const { json } = require("body-parser");
const statusCode = require("../constant/statusCode");
const catchAsyncError = require("../middleware/catchAsyncError");
const Feed = require("../schema/feedSchema");
const User = require("../schema/userSchema");
const ErrorHandler = require("../utils/errorHandler");
const { distance } = require("../utils/location");

// create feed controller
exports.createFeedController = catchAsyncError(async (req, res, next) => {
  let payload = req.body;

  payload = { ...payload, user: req.user._id };

  const feed = await Feed.create(payload);

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "feed created successfully.",
    feed,
  });
});

//edit feed controller
exports.editFeedController = catchAsyncError(async (req, res, next) => {
  let feed;

  feed = await Feed.find({ _id: req.params.feedId, user: req.user._id });

  if (!feed.length > 0)
    return next(new ErrorHandler("Feed not found", statusCode.NOT_FOUND));

  feed = await Feed.findOneAndUpdate(
    { user: req.user._id, _id: req.params.feedId },
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "Feed updated successfully.",
    feed,
  });
});

// list all feed based on nearest location
exports.listAllFeed = catchAsyncError(async (req, res, next) => {
  const feed = await Feed.find({ blocked: false, soldOut: false }).populate(
    "user",
    "name avatar"
  );

  let tempData = [];

  for (var i = 0; i < feed.length; i++) {
    if (
      distance(
        req.user.currentLocation.lantitude,
        req.user.currentLocation.longitude,
        feed[i].locationCoords.lantitude,
        feed[i].locationCoords.longitude,
        "K"
      ) <= 100
    ) {
      tempData.push({
        ...feed[i]._doc,
        distance: distance(
          req.user.currentLocation.lantitude,
          req.user.currentLocation.longitude,
          feed[i].locationCoords.lantitude,
          feed[i].locationCoords.longitude,
          "K"
        ),
      });
    }
  }

  const sortedFilterData = tempData.sort((a, b) => a.distance - b.distance);

  if (!(sortedFilterData.length > 0))
    return next(
      new ErrorHandler(
        "No feed found in your location.",
        statusCode.BAD_REQUEST
      )
    );

  res.status(statusCode.SUCCESS).json({
    success: true,
    feed: sortedFilterData,
  });
});

// blocked feed admin access
exports.blockedFeed = catchAsyncError(async (req, res, next) => {
  const feedId = req.params.feedId;

  const checkFeed = await Feed.findById(feedId);

  if (checkFeed === null)
    return next(new ErrorHandler("Feed not found.", statusCode.NOT_FOUND));

  const feed = await Feed.findByIdAndUpdate(
    feedId,
    { blocked: true },
    {
      new: true,
      runValidator: true,
    }
  );

  res.status(statusCode.SUCCESS).json({
    success: true,
    feed,
  });
});

// verify feed admin access
exports.verifyFeed = catchAsyncError(async (req, res, next) => {
  const feedId = req.params.feedId;

  const checkFeed = await Feed.findById(feedId);

  if (checkFeed === null)
    return next(new ErrorHandler("Feed not found.", statusCode.NOT_FOUND));

  const feed = await Feed.findByIdAndUpdate(
    feedId,
    { verified: true, blocked: false },
    {
      new: true,
      runValidator: true,
    }
  );

  res.status(statusCode.SUCCESS).json({
    success: true,
    feed,
  });
});

// get all unverified list (admin access)
exports.getUnverifiedFeedList = catchAsyncError(async (req, res, next) => {
  const feed = await Feed.where({ verified: false });

  res.status(statusCode.SUCCESS).json({
    success: true,
    feed,
  });
});

// get all user created feed
exports.getAllUserCreatedFeed = catchAsyncError(async (req, res, next) => {
  const userFeed = await Feed.find({ user: req.user._id });

  if (!userFeed.length > 0)
    return next(
      new ErrorHandler("You haven't created any feed.", statusCode.BAD_REQUEST)
    );

  res.status(statusCode.SUCCESS).json({
    success: true,
    feed: userFeed,
  });
});

// delete feed by user
exports.deleteFeedByUser = catchAsyncError(async (req, res, next) => {
  const userFeed = await Feed.deleteOne({
    user: req.user._id,
    _id: req.params.feedId,
  });

  if (!userFeed.deletedCount > 0) {
    return next(new ErrorHandler("Feed not found.", statusCode.BAD_REQUEST));
  }

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "Feed Deleted Successfully.",
    feed: userFeed,
  });
});

// delete feed by admin
exports.deleteFeedByAdmin = catchAsyncError(async (req, res, next) => {
  const deletedFeed = await Feed.findByIdAndDelete(req.params.feedId);

  if (deletedFeed == null)
    return next(new ErrorHandler("Feed not found.", statusCode.NOT_FOUND));

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "Feed Deleted Successfully.",
    feed: deletedFeed,
  });
});

// saved and unsaved feed
exports.bookmarkFeed = catchAsyncError(async (req, res, next) => {
  const checkForSaved = await User.find({
    _id: req.user._id,
    savedFeed: { $elemMatch: { $eq: req.params.feedId } },
  });
  let isSaved;
  let feed;
  if (!checkForSaved.length > 0) {
    feed = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { savedFeed: req.params.feedId },
      },
      { new: true, runValidators: true }
    );
    isSaved = true;
  } else {
    feed = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { savedFeed: req.params.feedId },
      },
      { new: true, runValidators: true }
    );
    isSaved = false;
  }

  res.status(statusCode.SUCCESS).json({
    success: true,
    isSaved,
  });
});

exports.searchFeedController = catchAsyncError(async (req, res, next) => {
  const search = await Feed.find({
    $or: [
      { title: { $regex: req.query.searchString, $options: "i" } },
      { description: { $regex: req.query.searchString, $options: "i" } },
      { tags: { $in: [req.query.searchString] } },
    ],
  });

  if (!search.length > 0)
    return next(new ErrorHandler("Feed not found", statusCode.NOT_FOUND));

  res.status(statusCode.SUCCESS).json({
    success: true,
    feed: search,
  });
});
