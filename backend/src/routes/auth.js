import express from "express";
import { check } from "express-validator";
// Gather middleware & controllers
import { Register } from "../controllers/auth.js";
import { Login } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";

const router = express.Router(); // Initalize router
// Perfrom serialization, then final validation, then finally send to registration
router.post(
  "/register",
  check("email")
    .isEmail()
    .withMessage("Email address is invalid")
    .normalizeEmail(),
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
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
  Validate,
  Register
);
router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Email address is invalid")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
  Login
);

export default router;
