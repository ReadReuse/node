const mongoose = require("mongoose");
const { isEmail } = require("validator");

// const geoCodeSchema

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      validate: [isEmail, "Invalid Email Address {VALUE}"],
    },
    dob: {
      type: Date,
      trim: true,
    },
    address: {
      type: String,
    },
    collegeName: {
      type: String,
    },
    addressLocation: {
      lantitude: Number,
      longitude: Number,
    },
    currentLocation: {
      lantitude: Number,
      longitude: Number,
    },
    enrollmentNo: {
      type: String,
    },
    graduationYear: {
      type: Number,
    },
    graduationSemester: {
      type: Number,
    },
    course: {
      type: String,
    },
    branch: {
      type: String,
    },
    mobileNo: {
      type: Number,
      unique: true,
      minlength: [10, "Should not be less than 10 number."],
    },
    avatar: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    otp: {
      expiry: Date,
      value: Number,
      consumed: Boolean,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        user: "USER",
        admin: "ADMIN",
      },
      default: "USER",
    },
    city: {
      type: String,
    },
    locality: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
