import express from "express";
import * as controller from "../controllers/quiz.js";
import Verify from "../middleware/verify.js";
import { validateQuiz } from "../middleware/quiz_validation.js";

const router = express.Router();

//Question api end point
router.get("/list_quizzes", controller.listQuizzes);
router
  .route("/:quizID/")
  .get(controller.getQuiz)
  .delete(Verify, controller.deleteQuiz);

router.post("/add_quiz", Verify, validateQuiz, controller.insertQuiz); //add a new quiz

//Add questions to a quiz
router.post("/:quizID/add-questions", Verify, controller.addQuestions);
router.delete(
  "/:quizID/:questionID/delete-question",
  Verify,
  controller.deleteQuestions
);
//API result
router
  .route("/result")
  .get(Verify, controller.getResult)
  .delete(Verify, controller.deleteResult);

export default router;
