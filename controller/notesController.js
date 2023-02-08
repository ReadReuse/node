const Notes = require("../schema/notesSchema");
const catchAsyncError = require("../middleware/catchAsyncError");
const statusCode = require("../constant/statusCode");

exports.createNotes = catchAsyncError(async (req, res, next) => {
  let payload = req.body;

  if (req.user.role === "ADMIN") {
    payload = { ...payload, verified: true };
  }

  const note = await Notes.create(payload);

  res.status(statusCode.SUCCESS).json({
    success: true,
    message: "Notes created successfully.",
    note,
  });
});
