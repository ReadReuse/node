const catchAsyncError = require("../middleware/catchAsyncError");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  checkCloudinaryAsset,
} = require("../utils/cloudinary");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");
const statusCode = require("../constant/statusCode");

exports.uploadAssets = catchAsyncError(async (req, res, next) => {
  if (!req.file)
    return new ErrorHandler("Please add file.", statusCode.BAD_REQUEST);

  const localFilePath = req.file.path;
  const fileName = req.file.filename;

  const result = await uploadToCloudinary(
    localFilePath,
    path.parse(fileName).name
  );
  console.log(result);

  return res.status(200).json({
    success: result.success,
    data: {
      format: result.fileData.format,
      location: result.fileData.secure_url,
      original_filename: result.fileData.original_filename,
      folder: result.fileData.folder,
    },
  });
});

exports.deleteAssets = catchAsyncError(async (req, res, next) => {
  console.log(!req.query.original_filename && !req.query.folder);
  if (!req.query.original_filename && !req.query.folder)
    return next(
      new ErrorHandler(
        "Please add original_filename and folder in query.",
        statusCode.BAD_REQUEST
      )
    );

  const publicId = req.query.folder + "/" + req.query.original_filename;
  const result = await deleteFromCloudinary(publicId);

  console.log(result);
  return res.status(200).json({
    success: result.success,
    data: result.result,
    err: result.err,
  });
});
