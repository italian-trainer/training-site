import express from "express";
import * as controller from "../controllers/message.js";
import Verify from "../middleware/verify.js";
import Validate from "../middleware/validate.js";
import { body } from "express-validator";
const router = express.Router();

//Endpoint for sending messages
router.post(
  "/send_message",
  Verify,
  body("receiver")
    .notEmpty()
    .withMessage("Reciever is required!")
    .trim()
    .escape(),
  body("subject")
    .notEmpty()
    .withMessage("Subject is required!")
    .trim()
    .escape(),
  body("content")
    .notEmpty()
    .withMessage("Content is required!")
    .trim()
    .escape(),
  body("type").notEmpty().withMessage("Type is required!").trim().escape(),
  Validate,
  controller.sendMessage
);
//Endpoint for users to get the messages
router.get("/get_messages", Verify, controller.readMessages);
//Endpoint for users to get a single message
router.get("/:messageId", Verify, controller.getSingleMessage);
//Mark as read
router.put("/:messageId/read", Verify, controller.markAsRead);

export default router;
