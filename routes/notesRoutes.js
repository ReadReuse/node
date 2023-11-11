const { Router } = require("express");
const {
  createNotesContract,
  updateNotesContract,
} = require("../contracts/notes");
const { searchQueryContract } = require("../contracts/feeed");
const {
  createNotes,
  updateNotes,
  listAllNotes,
  blockNotes,
  verifyNotes,
  getUnverifiedNotesList,
  deleteNoteByAdmin,
  noteBasedOnGraduationContract,
  bookmarkNote,
  searchNotesController,
} = require("../controller/notesController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const notesRoute = Router();

notesRoute.post(
  "/",
  isAuthenticatedUser,
  validate("body", createNotesContract),
  createNotes
);

notesRoute.put(
  "/:noteId",
  isAuthenticatedUser,
  validate("body", updateNotesContract),
  updateNotes
);

notesRoute.get("/", isAuthenticatedUser, listAllNotes);

notesRoute.get("/bookmark/:noteId", isAuthenticatedUser, bookmarkNote);

notesRoute.get(
  "/search",
  isAuthenticatedUser,
  validate("query", searchQueryContract),
  searchNotesController
);

notesRoute.get(
  "/getNoteBasedOnGraduation",
  isAuthenticatedUser,
  validate("query", noteBasedOnGraduationContract),
  searchNotesController
);

// admin acccess routes
notesRoute.get(
  "/block/:noteId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  blockNotes
);

notesRoute.post(
  "/verify/:noteId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  verifyNotes
);

notesRoute.get(
  "/unverifiedList",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  getUnverifiedNotesList
);

notesRoute.delete(
  "/noteDelete/:noteId",
  isAuthenticatedUser,
  authorizeRole("ADMIN"),
  deleteNoteByAdmin
);

module.exports = notesRoute;
