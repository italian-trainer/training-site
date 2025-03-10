import express from "express";
import { body } from "express-validator";
// Gather middleware & controllers
import {
  addToRoster,
  readRoster,
  getUserTrainings,
  assignTraining,
  assignmentsForTraining,
} from "../controllers/roster.js";
import Validate from "../middleware/validate.js";
import Verify from "../middleware/verify.js";

const router = express.Router(); // Initalize router
// Perfrom serialization, then final validation, then finally send to registration
router.post(
  "/add_user",
  Verify,
  body("first_name")
    .notEmpty()
    .withMessage("First name is required!")
    .trim()
    .escape(),
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required!")
    .trim()
    .escape(),
  body("role")
    .notEmpty()
    .matches("(employee|manager|admin)")
    .withMessage("Role is required"),
  Validate,
  addToRoster
);
router.post("/get_all_users", Verify, readRoster);
router.post(
  "/get_user_trainings",
  Verify,
  body("email")
    .isEmail()
    .withMessage("Email address is invalid!")
    .normalizeEmail(),
  Validate,
  getUserTrainings
);
router.post(
  "/assign_training",
  Verify,
  body("email")
    .isEmail()
    .withMessage("Email address is invalid!")
    .normalizeEmail(),
  body("training").notEmpty().withMessage("A training is required!"),
  Validate,
  assignTraining
);
router.post(
  "/training_assignments",
  Verify,
  body("training").notEmpty().withMessage("A training is required!"),
  Validate,
  assignmentsForTraining
);

export default router;
