const statusCode = require("../constant/statusCode");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../schema/userSchema");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource.`,
          statusCode.UNAUTHORIZED
        )
      );
    }
    next();
  };
};

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new ErrorHandler(
        "Please login to access this page",
        statusCode.UNAUTHORIZED
      )
    );
  }

  const decodeData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodeData.id);

  next();
});
