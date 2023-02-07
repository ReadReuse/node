const Joi = require("joi");

exports.loginContract = Joi.object({
  mobile: Joi.number()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required(),
});

exports.otpVerifyContract = Joi.object({
  otp: Joi.number().min(10000).max(99999).required(),
  userId: Joi.string().length(24).hex().required(),
});

exports.userRegisterContract = Joi.object({
  avatar: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  dob: Joi.date()
    .max("01-01-2010")
    .iso()
    .messages({ "date.format": `Date format is YYYY-MM-DD` })
    .required(),
  address: Joi.string().required(),
  collegeName: Joi.string().required(),
  location: Joi.object({
    lantitude: Joi.number(),
    longitude: Joi.number(),
  }).optional(),
  enrollmentNo: Joi.string().required(),
  graduationYear: Joi.number().required(),
  graduationSemester: Joi.number().required(),
  course: Joi.string().required(),
  branch: Joi.string().required(),
  city: Joi.string().required(),
  locality: Joi.string().optional(),
  state: Joi.string().required(),
  addressLocation: Joi.object({
    lantitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  currentLocation: Joi.object({
    lantitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
});
