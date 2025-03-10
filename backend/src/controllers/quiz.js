import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
//import questions, { answers } from "../data/quiz-data.js";

//Question API route
export async function listQuizzes(req, res) {
  const quizzes = await Quiz.find();
  res.status(200).json({
    status: "success",
    code: 200,
    data: quizzes,
    message: "Quiz retrieved successfully",
  });
}

export async function getQuiz(req, res) {
  try {
    const { quizID } = req.params;
    const quiz = await Quiz.findById(quizID);
    res.status(200).json({
      status: "success",
      code: 200,
      data: quiz,
      message: "Quiz retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error fetching data: ${err}`,
    });
  }
}

export async function insertQuiz(req, res) {
  try {
    const { title, description, questions } = req.body;
    const newQuiz = new Quiz({
      title,
      description,
      questions,
    });
    const savedQuiz = await newQuiz.save();
    res.status(200).json({
      status: "success",
      code: 200,
      data: savedQuiz,
      message: "Quiz has been added successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error inserting data: ${err}`,
    });
  }
}
//Add questions to a quiz
export async function addQuestions(req, res) {
  const quizID = req.params.quizID;
  const { question, options, answer } = req.body;
  try {
    const quiz = await Quiz.findById(quizID);
    //Check if the quiz exists
    if (!quiz) {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: [],
        message: "Quiz is not found!",
      });
    }
    //Add new question to the quiz
    quiz.questions.push({ question, options, answer });

    //save updated quiz
    const updatedQuiz = await quiz.save();
    res.status(200).json({
      status: "successful",
      code: 200,
      data: updatedQuiz,
      message: "Update quiz successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: " Error adding question!",
    });
  }
}
//Delete quiz
export async function deleteQuiz(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot read roster
  }
  const id = req.params.quizID;
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: [],
        message: "Question not found",
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      data: deletedQuiz,
      message: "Quiz has been deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error deleting data: ${err}`,
    });
  }
}
//Delete question in a quiz
export async function deleteQuestions(req, res) {
  const { quizID, questionID } = req.params;
  try {
    const quiz = await Quiz.findById(quizID);
    if (!quiz) {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Quiz is not fouond!",
      });
    }
    //Find and delete question from a quiz's questions array
    //findIndex returns index if the condition is true and returns -1 if false
    const questionIndex = quiz.questions.findIndex(
      (q) => q._id.toString() === questionID
    );
    if (questionIndex === -1) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Question is not found!",
      });
    }
    //splice used to delete array (start,count)
    quiz.questions.splice(questionIndex, 1);
    const updatedQuiz = await quiz.save();
    res.status(200).json({
      status: "success",
      code: 200,
      data: updatedQuiz,
      message: "Question has been deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error deleting data: ${err}`,
    });
  }
}

//Drafted
//answer API route
export async function getResult(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot read roster
  }
  try {
    const results = await Result.find();
    res.status(200).json({
      status: "success",
      code: 200,
      data: results,
      message: "Results retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error fetching data: ${err}`,
    });
  }
}

export async function insertResult(req, res) {
  try {
    const { userId, quizId, score } = req.body;
    const newResult = new Result({
      userId,
      quizId,
      score,
    });
    const savedResult = await newResult.save();
    res.status(200).json({
      status: "success",
      code: 200,
      data: savedResult,
      message: "Result has been added successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error inserting data: ${err}`,
    });
  }
}

export async function deleteResult(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot delete results
  }
  const { id } = req.params;
  try {
    const deletedResult = await Result.findByIdAndDelete(id);
    if (!deletedResult) {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: [],
        message: "Result not found",
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      data: deletedResult,
      message: "Result has been deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error deleting data: ${err}`,
    });
  }
}
