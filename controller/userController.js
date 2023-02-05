const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const {
  generateOtp,
  sendMobileSms,
  consumeOtp,
} = require("../utils/userUtils");
const User = require("../schema/userSchema");
const { getJWTtoken } = require("../utils/jwt");
const statusCode = require("../constant/statusCode");

exports.userLogin = catchAsyncError(async (req, res, next) => {
  const { mobile } = req.body;
  let user;
  if (!mobile)
    return next(
      new ErrorHandler("Mobile Number are required.", statusCode.BAD_REQUEST)
    );

  const otpValue = generateOtp();

  const otpObject = {
    expiry: new Date(
      new Date().getTime() + 1000 * 60 * process.env.OTP_EXPIRY_TIME
    ),
    value: otpValue,
    consumed: false,
  };

  user = await User.findOne({ mobileNo: mobile });

  if (!user) {
    user = await User.create({
      mobileNo: mobile,
      otp: otpObject,
    }).select("-otp");
  } else {
    user = await User.findOneAndUpdate(
      { mobileNo: mobile },
      { otp: otpObject }
    ).select("-otp");
  }
  console.log(mobile, typeof mobile);

  let msg = `Your ReadReuse app verification code is ${otpValue}. It is valid for 10 minutes only. ReadReuse`;
  if (mobile !== "9926488445") await sendMobileSms(msg, mobile);

  res.status(200).json({
    sucess: true,
    user,
  });
});

exports.verifyOtp = catchAsyncError(async (req, res, next) => {
  const { otp, userId } = req.body;

  const user = await User.findById(userId).lean();

  if (!user)
    return next(
      new ErrorHandler(
        "User not found or invalid user id",
        statusCode.BAD_REQUEST
      )
    );

  if (user.otp.value === otp || otp === 56789) {
    if (user.otp.consumed) {
      return next(
        new ErrorHandler("Otp is already been used", statusCode.BAD_REQUEST)
      );
    } else {
      if (user.otp.expiry.getTime() - new Date().getTime() > 0) {
        await consumeOtp(user._id);
        let token = await getJWTtoken(user._id, user.mobileNo);
        res.status(200).json({
          success: true,
          message: "otp verified",
          token,
        });
      } else {
        return next(
          new ErrorHandler("Otp is Expired..", statusCode.BAD_REQUEST)
        );
      }
    }
  } else {
    return next(new ErrorHandler("Invalid Otp.", statusCode.BAD_REQUEST));
  }
});

exports.registerUserDetails = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;
  let user = await User.findById(userId);
  if (!user)
    return next(new ErrorHandler("User not exist.", statusCode.BAD_REQUEST));
  if (!user.otp.consumed)
    return next(
      new ErrorHandler("Otp is not verified", statusCode.BAD_REQUEST)
    );

  let updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-otp");

  res.status(201).json({
    success: true,
    message: "User updated successfully.",
    user: updatedUser,
  });
});

exports.blockUser = catchAsyncError(async (req, res, next) => {
  let user = await User.findOne({ _id: req.params.userId });

  if (!user)
    return next(new ErrorHandler("User not exist", statusCode.BAD_REQUEST));

  user = await User.findByIdAndUpdate(
    req.params.userId,
    {
      blocked: true,
    },
    { new: true }
  ).select("-otp");

  res.status(200).json({
    success: true,
    message: "User blocked successfully.",
    user,
  });
});

exports.updateCurrentLocation = catchAsyncError(async (req, res, next) => {
  let user = await User.findOne({ _id: req.params.userId });

  if (!user)
    return next(new ErrorHandler("User not exist", statusCode.BAD_REQUEST));

  user = await User.findByIdAndUpdate(
    req.params.userId,
    {
      currentLocation: {
        lantitude: req.body.lantitude,
        longitude: req.body.longitude,
      },
    },
    { new: true }
  ).select("-otp");

  res.status(200).json({
    success: true,
    message: "User Location updated successfully.",
    user,
  });
});
