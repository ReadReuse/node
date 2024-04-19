const AppInfo = require("../schema/appInfoSchema");
const catchAsyncError = require("../middleware/catchAsyncError");
const statusCode = require("../constant/statusCode");
const ErrorHandler = require("../utils/errorHandler");

exports.getAppInfo = catchAsyncError(async (req, res, next) => {
  const data = await AppInfo.find({});

  res.status(statusCode.SUCCESS).json({
    success: true,
    data,
  });
});

exports.createAndUpdateAppInfo = catchAsyncError(async (req, res, next) => {
  const Id = req.query.Id;
  console.log(Id);
  const payload = req.body;
  let msg, appInfoData;
  if (Id) {
    let appInfo = await AppInfo.find({ _id: Id });

    if (!appInfo.length > 0)
      return next(new ErrorHandler("AppInfo not found", statusCode.NOT_FOUND));
    appInfoData = await AppInfo.findOneAndUpdate({ _id: Id }, payload, {
      new: true,
      runValidators: true,
    });

    msg = "App Info updated successfully.";
  } else {
    appInfoData = await AppInfo.create(payload);

    msg = "App Info created successfully";
  }

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: msg,
    data: appInfoData,
  });
});
