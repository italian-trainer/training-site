import express from "express";
import { body } from "express-validator";
import Validate from "../middleware/validate.js";
// Gather middleware & controllers
import {
  getTrainings,
  addTraining,
  getPage,
  submitQuiz,
  listTrainings,
  deleteTraining,
} from "../controllers/trainings.js";
import Verify from "../middleware/verify.js";

const router = express.Router(); // Initalize router
// Perfrom serialization, then final validation, then finally send to registration
router.get("/list_trainings", Verify, listTrainings);
router.get("/get_trainings", Verify, getTrainings);
router.post(
  "/create_training",
  Verify,
  body("title").exists().notEmpty().withMessage("Training needs a title!"),
  body("description")
    .exists()
    .notEmpty()
    .withMessage("Training needs a description!")
    .trim()
    .escape(),
  body("pages")
    .exists()
    .notEmpty()
    .isArray()
    .withMessage("Pages are required!"),
  body("quiz").exists().notEmpty().withMessage("Final quiz is required!"),
  Validate,
  addTraining
);
router.post(
  "/delete_training",
  Verify,
  body("training")
    .exists()
    .notEmpty()
    .withMessage("A training name is required!"),
  Validate,
  deleteTraining
);
router.post(
  "/get_page",
  Verify,
  body("training").exists().notEmpty().withMessage("A training is required!"),
  body("page")
    .exists()
    .notEmpty()
    .isDecimal()
    .withMessage("Page number is required!"),
  Validate,
  getPage
);
router.post(
  "/submit_quiz",
  Verify,
  body("training").exists().notEmpty().withMessage("A training is required!"),
  body("quiz").exists().notEmpty().withMessage("Quiz is required!"),
  body("filled_form")
    .exists()
    .notEmpty()
    .isArray()
    .withMessage("Form must be an array of answers!"),
  Validate,
  submitQuiz
);

export default router;
