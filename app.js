const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./libs/router");
const ErrorConstants = require("./constant/errorConstants");
const ErrorHandler = require("./utils/errorHandler");
const ErrorMiddleware = require("./middleware/error");
const app = express();
const fs = require("fs");
//added cors policy
app.use(cors());
//added morgan for logging api hits
app.use(morgan("combined"));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//checking for a upload folder
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

app.use(function (req, res, next) {
  return next(new ErrorHandler(ErrorConstants.API_ENDPOINT_NOT_FOUND, 404));
});
app.use(ErrorMiddleware);

module.exports = app;
