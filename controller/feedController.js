const statusCode = require("../constant/statusCode");
const catchAsyncError = require("../middleware/catchAsyncError");
const Feed = require("../schema/feedSchema");
const ErrorHandler = require("../utils/errorHandler");

exports.createFeedController = catchAsyncError(async (req, res, next) => {
  const feed = await Feed.create({ ...req.body });

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "feed created successfully.",
    feed,
  });
});

exports.listAllFeed = catchAsyncError(async (req, res, next) => {
  const feed = await Feed.where({ blocked: false }).populate(
    "user",
    "name avatar"
  );

  res.status(statusCode.SUCCESS).json({
    success: true,
    feed,
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

// function distance(lat1, lon1, lat2, lon2, unit) {
//   var radlat1 = Math.PI * lat1/180
//   var radlat2 = Math.PI * lat2/180
//   var theta = lon1-lon2
//   var radtheta = Math.PI * theta/180
//   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//   if (dist > 1) {
//     dist = 1;
//   }
//   dist = Math.acos(dist)
//   dist = dist * 180/Math.PI
//   dist = dist * 60 * 1.1515
//   if (unit=="K") { dist = dist * 1.609344 }
//   if (unit=="N") { dist = dist * 0.8684 }
//   return dist
// }

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
