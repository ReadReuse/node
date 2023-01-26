const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong mongo id errror
  if (err.name == "CastError") {
    const message = "Resource not found. Invalid: " + err.path;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate Error
  if (err.code == 11000) {
    console.log("err", err);
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `JWT token is invalid. try again`;
    err = new Error(message, 400);
  }

  //jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = `JWT token is expired. try again`;
    err = new Error(message, 400);
  }

  console.log("Testing Error", err);
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack_trace: err.stack,
  });
};
