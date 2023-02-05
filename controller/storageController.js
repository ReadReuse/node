const catchAsyncError = require("../middleware/catchAsyncError");
const uploadToCloudinary = require("../utils/cloudinary");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");

exports.uploadAssets = catchAsyncError(async (req, res, next) => {
  if (!req.file) return new ErrorHandler("Please add file.", 400);

  const localFilePath = req.file.path;
  const fileName = req.file.filename;
  console.log(fileName);
  const result = await uploadToCloudinary(
    localFilePath,
    path.parse(fileName).name
  );
  console.log(result);
  return res.status(200).json({
    success: result.success,
    format: result.fileData.format,
    location: result.fileData.secure_url,
    original_filename: result.fileData.original_filename,
    folder: result.fileData.folder,
  });
});
