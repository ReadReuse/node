const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../schema/userSchema");
let sendMsg = require("aws-sns-sms");
const axios = require("axios");
const min = 10000;
const max = 99999;
exports.generateOtp = () => Math.floor(Math.random() * (max - min + 1)) + min;

exports.consumeOtp = async (userId) =>
  User.findOneAndUpdate({ _id: userId }, { $set: { "otp.consumed": true } });

exports.sendMobileSms = async (otp, phoneNo) => {
  const endpoint = `https://www.fast2sms.com/dev/bulkV2?authorization=${
    process.env.SMS_KEY
  }&variables_values=${String(otp)}&route=otp&numbers=${phoneNo}`;
  await axios
    .get(endpoint, { headers: { "Access-Control-Allow-Origin": "*" } })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
