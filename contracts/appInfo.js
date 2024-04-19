const Joi = require("joi");

exports.appInfoContract = Joi.object({
  versionName: Joi.string().required(),
  forceDownload: Joi.boolean().required(),
});
