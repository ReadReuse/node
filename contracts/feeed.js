const Joi = require("joi");

exports.createFeedContract = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().optional(),
  moreDetails: Joi.array().items(Joi.string()).optional(),
  address: Joi.string().required(),
  locality: Joi.string().optional(),
  state: Joi.string().optional(),
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
  locationCoords: Joi.object({
    lantitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  tags: Joi.array().items(Joi.string()).optional(),
});

exports.updateFeedContract = Joi.object({
  title: Joi.string(),
  price: Joi.number(),
  description: Joi.string(),
  moreDetails: Joi.array().items(Joi.string()),
  address: Joi.string(),
  locality: Joi.string(),
  state: Joi.string(),
  avatar: Joi.array().items(
    Joi.object({
      format: Joi.string(),
      original_filename: Joi.string(),
      folder: Joi.string(),
      location: Joi.string(),
    })
  ),
  locationCoords: Joi.object({
    lantitude: Joi.number(),
    longitude: Joi.number(),
  }),
  tags: Joi.array().items(Joi.string()),
});

exports.searchQueryContract = Joi.object({
  searchString: Joi.string().required(),
});
