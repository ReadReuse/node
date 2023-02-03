const catchAsyncError = require("../middleware/catchAsyncError");
const uploadToCloudinary = require("../utils/cloudinary");
const ErrorHandler = require("../utils/errorHandler");

exports.uploadAvatar = catchAsyncError(async (req, res, next) => {
  if (!req.file) return new ErrorHandler("Please add file.", 400);

  const localFilePath = req.file.path;

  const result = await uploadToCloudinary(localFilePath);
  console.log(result);
  return res.status(200).json({
    success: result.success,
    url: result.fileData.secure_url,
  });
});
