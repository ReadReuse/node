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
  avatar: Joi.string(),
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  address: Joi.string().required(),
  collegeName: Joi.string().required(),
  currentLocation: Joi.object({
    lantitude: Joi.number(),
    longitude: Joi.number(),
  }).optional(),
  graduationYear: Joi.number().required(),
  graduationSemester: Joi.number().required(),
  course: Joi.string().required(),
  branch: Joi.string().required(),
  city: Joi.string().optional(),
  locality: Joi.string().optional(),
  state: Joi.string().optional(),
});
