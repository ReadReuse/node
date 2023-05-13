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
  avatar: Joi.object({
    format: Joi.string().optional(),
    original_filename: Joi.string().optional(),
    folder: Joi.string().optional(),
    location: Joi.string().optional(),
  }).optional(),
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  dob: Joi.date().required(),
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
  city: Joi.string().optional(),
  locality: Joi.string().optional(),
  state: Joi.string().optional(),
  addressLocation: Joi.object({
    lantitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
});
