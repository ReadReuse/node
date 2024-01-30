const QuestionPaper = require("../schema/questionPaperSchema");
const catchAsyncError = require("../middleware/catchAsyncError");
const statusCode = require("../constant/statusCode");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../schema/userSchema");

exports.createQuestionPaper = catchAsyncError(async (req, res, next) => {
  let payload = req.body;
  if (req.user.role === "ADMIN") {
    payload = { ...payload, verified: true };
  }

  payload = { ...payload, user: req.user._id };

  const questionPaper = await QuestionPaper.create(payload);

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "Question paper added successfully.",
    questionPaper,
  });
});

exports.updateQuestionPaper = catchAsyncError(async (req, res, next) => {
  const questionPaperId = req.params.questionPaperId;

  let questionPaper = await QuestionPaper.find({
    _id: questionPaperId,
    user: req.user._id,
  });

  if (!questionPaper.length > 0)
    return next(
      new ErrorHandler("Question Paper not found", statusCode.NOT_FOUND)
    );

  questionPaper = await QuestionPaper.findOneAndUpdate(
    { _id: questionPaperId, user: req.user._id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "Question Paper updated successfully",
    questionPaper,
  });
});

exports.listAllQuestionPaper = catchAsyncError(async (req, res, next) => {
  const questionPaper = await QuestionPaper.find({
    blocked: false,
    verified: true,
  })
    .sort({ _id: -1 })
    .limit(req.query.limit || 20);

  let finalArray = questionPaper.map((e, i) => {
    if (req.user.savedQuestionPaper.includes(e._doc._id)) {
      return { ...e._doc, bookmarked: true };
    } else {
      return { ...e._doc, bookmarked: false };
    }
  });

  console.log(finalArray);
  res.status(statusCode.SUCCESS).json({
    success: true,
    questionPaper: finalArray,
  });
});

// delete questionPaper by admin
exports.deleteQuestionPaperByAdmin = catchAsyncError(async (req, res, next) => {
  const deletedQuestionPaper = await QuestionPaper.fidndByIdAndDelete(
    req.params.questionPaperId
  );

  if (deletedQuestionPaper == null)
    return next(
      new ErrorHandler("Question Paper not found.", statusCode.NOT_FOUND)
    );

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "Question Paper Deleted Successfully.",
  });
});

exports.searchQuestionPaperController = catchAsyncError(
  async (req, res, next) => {
    const search = await QuestionPaper.find({
      $or: [
        { title: { $regex: req.query.searchString, $options: "i" } },
        { tags: { $in: [req.query.searchString] } },
      ],
    });

    if (!search.length > 0)
      return next(
        new ErrorHandler("Question Paper not found", statusCode.NOT_FOUND)
      );

    let finalArray = search.map((e, i) => {
      if (req.user.savedQuestionPaper.includes(e._doc._id)) {
        return { ...e._doc, bookmarked: true };
      } else {
        return { ...e._doc, bookmarked: false };
      }
    });

    res.status(statusCode.SUCCESS).json({
      success: true,
      questionPaper: finalArray,
    });
  }
);

exports.getQuestionPaperBasedOnGraduation = catchAsyncError(
  async (req, res, next) => {
    const { graduationYear, graduationSemester, course, branch } = req.query;
    const search = await QuestionPaper.find({
      $and: [
        { graduationYear: graduationYear },
        { graduationSemester: graduationSemester },
        { course: { $regex: course, $options: "i" } },
        { branch: { $regex: branch, $options: "i" } },
      ],
    });

    if (!search.length > 0)
      return next(
        new ErrorHandler("Question Paper not found", statusCode.NOT_FOUND)
      );

    let finalQuestionPaperArray = search.map((e, i) => {
      if (req.user.savedQuestionPaper.includes(e._doc._id)) {
        return { ...e._doc, bookmarked: true };
      } else {
        return { ...e._doc, bookmarked: false };
      }
    });

    res.status(statusCode.SUCCESS).json({
      success: true,
      questionPaper: finalQuestionPaperArray,
    });
  }
);
