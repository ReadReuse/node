const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    moreDetails: [String],
    city: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
    },
    state: {
      type: String,
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    avatar: [
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
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);