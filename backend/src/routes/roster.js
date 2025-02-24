import express from "express";
import { check } from "express-validator";
// Gather middleware & controllers
import { addToRoster } from "../controllers/roster.js";
import Validate from "../middleware/validate.js";
import Verify from "../middleware/verify.js";

const router = express.Router(); // Initalize router
// Perfrom serialization, then final validation, then finally send to registration
router.post(
  "/add_user",
  Verify,
  check("first_name")
    .notEmpty()
    .withMessage("First name is required!")
    .trim()
    .escape(),
  check("last_name")
    .notEmpty()
    .withMessage("Last name is required!")
    .trim()
    .escape(),
  check("role")
    .notEmpty()
    .matches("(employee|manager)")
    .withMessage("Role is required"),
  Validate,
  addToRoster
);

export default router;
