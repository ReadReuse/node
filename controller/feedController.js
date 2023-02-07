const { json } = require("body-parser");
const statusCode = require("../constant/statusCode");
const catchAsyncError = require("../middleware/catchAsyncError");
const Feed = require("../schema/feedSchema");
const ErrorHandler = require("../utils/errorHandler");
const { distance } = require("../utils/location");

exports.createFeedController = catchAsyncError(async (req, res, next) => {
  const feed = await Feed.create({ ...req.body });

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "feed created successfully.",
    feed,
  });
});

exports.listAllFeed = catchAsyncError(async (req, res, next) => {
  const feed = await Feed.find({ blocked: false }).populate(
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

exports.blockedFeed = catchAsyncError(async (req, res, next) => {
  const feedId = req.params.feedId;

  if (!feedId)
    return next(
      new ErrorHandler("Please add feed id in params", statusCode.BAD_REQUEST)
    );

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

exports.verifyFeed = catchAsyncError(async (req, res, next) => {
  const feedId = req.params.feedId;

  if (!feedId)
    return next(
      new ErrorHandler("Please add feed id in params", statusCode.BAD_REQUEST)
    );

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

exports.getUnverifiedFeedList = catchAsyncError(async (req, res, next) => {
  const feed = await Feed.where({ verified: false });

  res.status(statusCode.SUCCESS).json({
    success: true,
    feed,
  });
});

// var data = [{
//     "code": "0001",
//     "lat": "1.28210155945393",
//     "lng": "103.81722480263163",
//     "location": "Stop 1"
// }, {
//     "code": "0003",
//     "lat": "1.2777380589964",
//     "lng": "103.83749709165197",
//     "location": "Stop 2"
// }, {
//     "code": "0002",
//     "lat": "1.27832046633393",
//     "lng": "103.83762574759974",
//     "location": "Stop 3"
// }];

// var html = "";
// var poslat = 1.28210155945393;
// var poslng = 103.81722480263163;

// for (var i = 0; i < data.length; i++) {
//     // if this location is within 0.1KM of the user, add it to the list
//     if (distance(poslat, poslng, data[i].lat, data[i].lng, "K") <= 0.1) {
//         html += '<p>' + data[i].location + ' - ' + data[i].code + '</p>';
//     }
// }

// $('#nearbystops').append(html);
