const Joi = require("joi");

exports.createNotesContract = Joi.object({
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  unitsData: Joi.array().items({
    unitTitle: Joi.string().required(),
    unitDescription: Joi.string().required(),
    pdfData: Joi.object({
      format: Joi.string().required(),
      original_filename: Joi.string().required(),
      folder: Joi.string().optional(),
      location: Joi.string().required(),
    }).required(),
  }),
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
  tags: Joi.array().items(Joi.string()).optional(),

  unitsData: Joi.array().items({
    unitTitle: Joi.string().optional(),
    unitDescription: Joi.string().optional(),
    pdfData: Joi.object({
      format: Joi.string().required(),
      original_filename: Joi.string().required(),
      folder: Joi.string().optional(),
      location: Joi.string().required(),
    }).optional(),
  }),
  thumbnailImages: Joi.array()
    .items(
      Joi.object({
        format: Joi.string().required(),
        original_filename: Joi.string().required(),
        folder: Joi.string().optional(),
        location: Joi.string().required(),
      })
    )
    .optional(),
});
