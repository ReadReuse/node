const { Router } = require("express");

const {
  createQuestionPaper,
  updateQuestionPaper,
  listAllQuestionPaper,
  searchQuestionPaperController,
  getQuestionPaperBasedOnGraduation,
  deleteQuestionPaperByAdmin,
} = require("../controller/questionPaperController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  createQuestionPaperContract,
  updateQuestionPaperContract,
  searchQueryContract,
  QuestionPaperBasedOnGraduationContract,
} = require("../contracts/questionPaper");
const questionPaperRoute = Router();

questionPaperRoute.post(
  "/",
  isAuthenticatedUser,
  validate("body", createQuestionPaperContract),
  createQuestionPaper
);

questionPaperRoute.put(
  "/:questionPaperId",
  isAuthenticatedUser,
  validate("body", updateQuestionPaperContract),
  updateQuestionPaper
);

questionPaperRoute.get("/", isAuthenticatedUser, listAllQuestionPaper);

questionPaperRoute.get(
  "/search",
  isAuthenticatedUser,
  validate("query", searchQueryContract),
  searchQuestionPaperController
);

questionPaperRoute.get(
  "/getNoteBasedOnGraduation",
  isAuthenticatedUser,
  validate("query", QuestionPaperBasedOnGraduationContract),
  getQuestionPaperBasedOnGraduation
);

questionPaperRoute.delete(
  "/noteDelete/:questionPaperId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  deleteQuestionPaperByAdmin
);

module.exports = questionPaperRoute;
