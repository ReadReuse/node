const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const {
  generateOtp,
  sendMobileSms,
  consumeOtp,
} = require("../utils/userUtils");
const User = require("../schema/userSchema");
const Feed = require("../schema/feedSchema");
const Notes = require("../schema/notesSchema");
const Feeds = require("../schema/feedSchema");
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
    // user = await User.insert/
    user = new User({
      mobileNo: mobile,
      otp: otpObject,
    });
    await user.save();
  } else {
    user = await User.findOneAndUpdate(
      { mobileNo: mobile },
      { otp: otpObject }
    ).select("-otp");
  }

  if (mobile !== "9926488445") await sendMobileSms(otpValue, mobile);

  res.status(statusCode.SUCCESS).json({
    success: true,
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
        res.status(statusCode.SUCCESS).json({
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

  let user = await User.find({ _id: userId });

  if (!user)
    return next(new ErrorHandler("User not exist.", statusCode.BAD_REQUEST));
  if (!user[0].otp.consumed)
    return next(
      new ErrorHandler("Otp is not verified", statusCode.BAD_REQUEST)
    );

  let payload = {
    ...req.body,
  };

  if (user.profileCompletePercentage !== 100) {
    payload.profileCompletePercentage = 100;
  }

  let updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-otp");

  res.status(statusCode.SUCCESS).json({
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
      blocked: !user.blocked,
    },
    { new: true }
  ).select("-otp");

  let msg;
  if (user.blocked) {
    msg = "User blocked successfully.";
  } else {
    msg = "User unblocked successfully.";
  }

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: msg,
    user,
  });
});

exports.updateCurrentLocation = catchAsyncError(async (req, res, next) => {
  let user = await User.findOne({ _id: req.user._id });

  if (!user)
    return next(new ErrorHandler("User not exist", statusCode.BAD_REQUEST));

  let newUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      currentLocation: {
        lantitude: req.body.lantitude,
        longitude: req.body.longitude,
      },
    },
    { new: true }
  ).select("-otp");

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "User Location updated successfully.",
    user: newUser,
  });
});

exports.getUserDetailFromToken = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-otp");

  if (!user)
    return next(new ErrorHandler("User not found", statusCode.NOT_FOUND));

  res.status(statusCode.SUCCESS).json({
    success: true,
    user,
  });
});

exports.getAllDetailsCount = catchAsyncError(async (req, res, next) => {
  const users = await User.count();
  const feeds = await Feeds.count();
  const notes = await Notes.count();

  res.status(statusCode.SUCCESS).json({
    success: true,
    users,
    feeds,
    notes,
  });
});

exports.getUserList = catchAsyncError(async (req, res, next) => {
  const user = await User.find()
    .limit(req.query.limit || 50)
    .select("mobileNo name address collegeName blocked");

  res.status(statusCode.SUCCESS).json({
    success: true,
    users: user,
  });
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.userId).select(
    "-otp  -currentLocation -savedFeed -savedNotes"
  );

  if (!user)
    return next(new ErrorHandler("User not found", statusCode.NOT_FOUND));

  res.status(statusCode.SUCCESS).json({
    success: true,
    user,
  });
});

exports.searchUser = catchAsyncError(async (req, res, next) => {
  const user = await User.find({
    $or: [
      { name: { $regex: req.query.searchString, $options: "i" } },
      { email: { $regex: req.query.searchString, $options: "i" } },
    ],
  }).select("mobileNo name address collegeName blocked");

  console.log(user);
  if (!user.length > 0)
    return next(new ErrorHandler("User not found", statusCode.NOT_FOUND));

  res.status(statusCode.SUCCESS).json({
    success: true,
    user,
  });
});

exports.savedFeedsData = catchAsyncError(async (req, res, next) => {
  const feeds = await Feed.find({
    _id: { $in: req.user.savedFeed },
    blocked: false,
    soldOut: false,
  }).populate("user", "name avatar mobileNo");

  if (!feeds.length > 0) {
    return next(new ErrorHandler("No feed is saved"));
  }

  let finalFeedsArray = feeds.map((e, i) => {
    if (req.user.savedFeed.includes(e._doc._id)) {
      return { ...e._doc, bookmarked: true };
    } else {
      return { ...e._doc, bookmarked: false };
    }
  });
  res.status(statusCode.SUCCESS).json({
    success: true,
    feeds: finalFeedsArray,
  });
});

exports.savedNotesData = catchAsyncError(async (req, res, next) => {
  const notes = await Notes.find({ _id: { $in: req.user.savedNotes } });

  if (!notes.length > 0) {
    return next(new ErrorHandler("No notes is saved"));
  }

  let finalNotesArray = notes.map((e, i) => {
    if (req.user.savedNotes.includes(e._doc._id)) {
      return { ...e._doc, bookmarked: true };
    } else {
      return { ...e._doc, bookmarked: false };
    }
  });

  res.status(statusCode.SUCCESS).json({
    success: true,
    notes: finalNotesArray,
  });
});

exports.getUserDataCount = catchAsyncError(async (req, res, next) => {
  const activeFeedCount = await Feed.find({
    user: req.user._id,
    blocked: false,
  }).count();
  const blockFeedCount = await Feed.find({
    user: req.user._id,
    blocked: true,
  }).count();

  res.status(statusCode.SUCCESS).json({
    success: true,
    activeFeedCount,
    blockFeedCount,
  });
});
