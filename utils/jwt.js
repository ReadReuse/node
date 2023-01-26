const jwt = require("jsonwebtoken");

exports.getJWTtoken = async (userId, mobile) => {
  return jwt.sign({ _id: userId, mobile }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.verifyJWTtoken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
