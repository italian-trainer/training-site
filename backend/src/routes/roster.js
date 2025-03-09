import express from "express";
import { check } from "express-validator";
// Gather middleware & controllers
import { addToRoster, readRoster } from "../controllers/roster.js";
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
    .matches("(employee|manager|admin)")
    .withMessage("Role is required"),
  Validate,
  addToRoster
);
router.post("/get_all_users", Verify, readRoster);

export default router;
