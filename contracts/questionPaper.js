const Joi = require("joi");

exports.createQuestionPaperContract = Joi.object({
  title: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),

  graduationYear: Joi.string().required(),
  graduationSemester: Joi.string().required(),
  course: Joi.string().required(),
  branch: Joi.string().required(),
  paperData: Joi.array().items(
    Joi.object({
      subjectCode: Joi.string().required(),
      paperYear: Joi.string().required(),
      pdfData: Joi.object({
        format: Joi.string().required(),
        original_filename: Joi.string().required(),
        folder: Joi.string().optional(),
        location: Joi.string().required(),
      }).required(),
    })
  ),
  // thumbnailImages: Joi.array()
  //   .items(
  //     Joi.object({
  //       format: Joi.string().required(),
  //       original_filename: Joi.string().required(),
  //       folder: Joi.string().optional(),
  //       location: Joi.string().required(),
  //     })
  //   )
  //   .required(),
});

exports.updateQuestionPaperContract = Joi.object({
  title: Joi.string(),
  tags: Joi.array().items(Joi.string()).optional(),
  paperData: Joi.array()
    .items(
      Joi.object({
        subjectCode: Joi.string().optional(),
        paperYear: Joi.string().optional(),
        pdfData: Joi.object({
          format: Joi.string().required(),
          original_filename: Joi.string().required(),
          folder: Joi.string().optional(),
          location: Joi.string().required(),
        }).optional(),
      })
    )
    .optional(),
  graduationYear: Joi.string().optional(),
  graduationSemester: Joi.string().optional(),
  course: Joi.string().optional(),
  branch: Joi.string().optional(),
  // thumbnailImages: Joi.array()
  //   .items(
  //     Joi.object({
  //       format: Joi.string().required(),
  //       original_filename: Joi.string().required(),
  //       folder: Joi.string().optional(),
  //       location: Joi.string().required(),
  //     })
  //   )
  //   .optional(),
});

exports.QuestionPaperBasedOnGraduationContract = Joi.object({
  graduationYear: Joi.string().optional(),
  graduationSemester: Joi.string().optional(),
  course: Joi.string().optional(),
  branch: Joi.string().optional(),
});

exports.searchQueryContract = Joi.object({
  searchString: Joi.string().required(),
});
