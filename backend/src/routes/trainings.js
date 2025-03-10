import express from "express";
import { body } from "express-validator";
// Gather middleware & controllers
import {
  getTrainings,
  addTraining,
  getPage,
  submitQuiz,
} from "../controllers/trainings.js";
import Verify from "../middleware/verify.js";

const router = express.Router(); // Initalize router
// Perfrom serialization, then final validation, then finally send to registration
router.get("/get_trainings", Verify, getTrainings);
router.post(
  "/create_training",
  Verify,
  body("title")
    .exists()
    .notEmpty()
    .isEmail()
    .withMessage("Training needs a title!")
    .normalizeEmail(),
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
  addTraining
);
router.post(
  "/get_page",
  Verify,
  body("training").exists().notEmpty().withMessage("A training is required!"),
  body("page").exists().notEmpty().isDecimal(),
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
  submitQuiz
);

export default router;
