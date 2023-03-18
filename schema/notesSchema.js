const mongoose = require("mongoose");

const notesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    unitsData: [
      {
        unitTitle: {
          type: String,
          required: true,
        },
        unitDescription: {
          type: String,
          required: true,
        },
        pdfData: {
          format: String,
          original_filename: String,
          folder: {
            type: String,
            default: "readreuse",
          },
          location: String,
        },
      },
    ],
    thumbnailImages: [
      {
        format: String,
        original_filename: String,
        folder: {
          type: String,
          default: "readreuse",
        },
        location: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notes", notesSchema);
