import express from "express";
import { check } from "express-validator";
// Gather middleware & controllers
import {
  getTrainings,
  getUserTrainings,
  addTraining,
} from "../controllers/trainings.js";
import Verify from "../middleware/verify.js";

const router = express.Router(); // Initalize router
// Perfrom serialization, then final validation, then finally send to registration
router.post("/get_trainings", Verify, getTrainings);
router.post(
  "/get_user_trainings",
  Verify,
  check("email")
    .isEmail()
    .withMessage("Email address is invalid")
    .normalizeEmail(),
  getUserTrainings
);
router.post(
  "/create_training",
  Verify,
  check("title")
    .isEmail()
    .withMessage("Training needs a title!")
    .normalizeEmail(),
  check("description")
    .notEmpty()
    .withMessage("Training needs a description!")
    .trim()
    .escape(),
  check("pages").isJSON().withMessage("Pages must be valid JSON!"),
  addTraining
);

export default router;
