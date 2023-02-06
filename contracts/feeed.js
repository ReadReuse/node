const Joi = require("joi");

exports.createFeedContract = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string(),
  moreDetails: Joi.array().items(Joi.string()),
  city: Joi.string().required(),
  locality: Joi.string(),
  state: Joi.string().required(),
  avatar: Joi.array()
    .items(
      Joi.object({
        format: Joi.string().required(),
        original_filename: Joi.string().required(),
        folder: Joi.string(),
        location: Joi.string().required(),
      })
    )
    .required(),
  tags: Joi.array().items(Joi.string()),
  user: Joi.string().max(24).required(),
});
