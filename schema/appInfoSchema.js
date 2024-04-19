const mongoose = require("mongoose");

const appInfoSchema = new mongoose.Schema(
  {
    versionName: String,
    forceDownload: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppInfo", appInfoSchema);
