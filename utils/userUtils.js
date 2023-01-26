const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../schema/userSchema");
let sendMsg = require("aws-sns-sms");

const min = 10000;
const max = 99999;
exports.generateOtp = () => Math.floor(Math.random() * (max - min + 1)) + min;

exports.consumeOtp = async (userId) =>
  User.findOneAndUpdate({ _id: userId }, { $set: { "otp.consumed": true } });

exports.sendMobileSms = async (msg, phoneNo) => {
  let awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  };
  let message = {
    message: msg,
    sender: "ReadReuse",
    phoneNumber: "+91" + phoneNo, // phoneNumber along with country code
  };
  sendMsg(awsConfig, message)
    .then((data) => {
      console.log("Message sent");
    })
    .catch((err) => {
      consolr.log(err);
    });
};
