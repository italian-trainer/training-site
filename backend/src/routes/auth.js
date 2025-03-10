import express from "express";
import { body } from "express-validator";
// Gather middleware & controllers
import { Register, Login, getInfo } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import Verify from "../middleware/verify.js";

const router = express.Router(); // Initialize router
// Perform serialization, then final validation, then finally send to registration
router.post(
  "/register",
  body("email")
    .isEmail()
    .withMessage("Email address is invalid")
    .normalizeEmail(),
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
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
  body("user_id").notEmpty().withMessage("Please enter a user ID"),
  Validate,
  Register
);
router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Email address is invalid")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
  Login
);
router.get("/get_info", Verify, getInfo);

export default router;
