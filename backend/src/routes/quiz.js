import express from "express";
import * as controller from "../controllers/quiz.js";
import { validateQuiz } from "../middleware/quiz_validation.js";

const router = express.Router();

//Question api end point
router.route("/:quizID/").get(controller.getQuiz).delete(controller.deleteQuiz);

router.post("/add-quiz", validateQuiz, controller.insertQuiz); //add a new quiz

//Add questions to a quiz
router.post("/:quizID/add-questions", controller.addQuestions);
router.delete(
  "/:quizID/:questionID/delete-question",
  controller.deleteQuestions
);
//API result
router
  .route("/result")
  .get(controller.getResult)
  .post(controller.insertResult)
  .delete(controller.deleteResult);

export default router;
