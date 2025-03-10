import express from "express";
import * as controller from "../controllers/message.js";
const router = express.Router();

//Endpoint for sending messages
router.post("/send_message", controller.sendMessage);
//Endpoint for users to get the messages
router.get("/:userId", controller.readMessages);
//Endpoint for users to get a single message
router.get("/:messageId", controller.getSingleMessage);
//Mark as read
router.put("/:messageId/read", controller.markAsRead);

//Endpoint for quiz results
//router.get("/quiz-results", controller.sendQuizResult);
export default router;
