import express from "express";
import * as controller from "../controllers/quiz.js";
import Verify from "../middleware/verify.js";
import { validateQuiz } from "../middleware/quiz_validation.js";

const router = express.Router();

//Question api end point
router
  .route("/:quizID/", Verify)
  .get(controller.getQuiz)
  .delete(controller.deleteQuiz);

router.post("/add-quiz", Verify, validateQuiz, controller.insertQuiz); //add a new quiz

//Add questions to a quiz
router.post("/:quizID/add-questions", Verify, controller.addQuestions);
router.delete(
  "/:quizID/:questionID/delete-question",
  controller.deleteQuestions
);
//API result
router
  .route("/result", Verify)
  .get(controller.getResult)
  .post(controller.insertResult)
  .delete(controller.deleteResult);

export default router;
