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
  graduationYear: Joi.string().required(),
  graduationSemester: Joi.string().required(),
  course: Joi.string().required(),
  branch: Joi.string().required(),
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
  graduationYear: Joi.string().optional(),
  graduationSemester: Joi.string().optional(),
  course: Joi.string().optional(),
  branch: Joi.string().optional(),
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

exports.noteBasedOnGraduationContract = Joi.object({
  graduationYear: Joi.string().optional(),
  graduationSemester: Joi.string().optional(),
  course: Joi.string().optional(),
  branch: Joi.string().optional(),
});

exports.searchQueryContract = Joi.object({
  searchString: Joi.string().required(),
});
