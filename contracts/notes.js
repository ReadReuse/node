const Joi = require("joi");

exports.createNotesContract = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  keyPoint: Joi.array().items(Joi.string()).optional(),
  pdfData: Joi.object({
    format: Joi.string().required(),
    original_filename: Joi.string().required(),
    folder: Joi.string().optional(),
    location: Joi.string().required(),
  }).required(),
  thumbnailImages: Joi.array()
    .items(
      Joi.object({
        format: Joi.string().required(),
        original_filename: Joi.string().required(),
        folder: Joi.string().optional(),
        location: Joi.string().required(),
      })
    )
    .required(),
});

exports.updateNotesContract = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  tags: Joi.array().items(Joi.string()).optional(),
  keyPoint: Joi.array().items(Joi.string()).optional(),
  pdfData: Joi.object({
    format: Joi.string().required(),
    original_filename: Joi.string().required(),
    folder: Joi.string().optional(),
    location: Joi.string().required(),
  }),
  thumbnailImages: Joi.array().items(
    Joi.object({
      format: Joi.string().required(),
      original_filename: Joi.string().required(),
      folder: Joi.string().optional(),
      location: Joi.string().required(),
    })
  ),
});
