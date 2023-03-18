const mongoose = require("mongoose");

const feedSchema = mongoose.Schema(
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
      default: false,
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
    locationCoords: {
      lantitude: Number,
      longitude: Number,
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    featured: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    soldOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feed", feedSchema);
