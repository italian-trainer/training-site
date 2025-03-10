import Training from "../models/Training.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

export async function listTrainings(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot read trainings
  }
  const trainings = await Training.find();
  res.status(200).json({
    status: "success",
    code: 200,
    data: trainings,
    message: "Trainings retrieved from database!",
  });
}

export async function getTrainings(req, res) {
  res.status(200).json({
    status: "success",
    message: "Successfully retrieved assigned trainings!",
    data: req.user.assigned_trainings,
  });
}
export async function addTraining(req, res) {
  const { title, description, pages, quiz } = req.body;
  try {
    if ((await Quiz.findOne({ title: quiz })) == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Quiz given does not exist!",
      });
      return;
    }
    const newTraining = new Training({
      title,
      description,
      pages,
      total_pages: pages.length,
      assigned_users: [],
      quiz,
    });
    await newTraining.save();
    res.status(200).json({
      status: "success",
      message: "Training added successfully",
      data: newTraining._doc,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during training addition: ${err}`,
    });
  }
}

export async function getPage(req, res) {
  const { training, page } = req.body;
  try {
    const current_training = Training.findOne({ title: training });
    if (current_training == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Training does not exist!",
      });
      return;
    }
    console.log(current_training);
    var out = {};
    const current_user = User.findById(req.user._id);
    if (page >= 0 && page <= current_training.total_pages) {
      current_user.assigned_trainings.current_page.find(item => item.training == training) = page;
      if (page == current_training.total_pages) {
        out = { type: "quiz", body: current_training.quiz };
      } else {
        out = { type: "html", body: current_training.pages[page] };
      }
      res.status(200).json({
        status: "success",
        message: "Page retrieved successfully",
        data: out,
      });
    }
 res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Page is out of bounds!",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during training addition: ${err}`,
    });
  }
}

export async function submitQuiz(req, res) {
  const { training, quiz, filled_form } = req.body;
  try {
    const target_quiz = Quiz.findOne({ title: quiz });
    if (target_quiz == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Quiz does not exist!",
      });
      return;
    }
    var incorrect_questions = [];
    for (i in target_quiz.questions) {
      if (filled_form[i] != target_quiz.questions[i].answer) {
        incorrect_questions.push(target_quiz.questions[i].question);
      }
    }
    if (incorrect_questions.length == 0) {
      const current_user = User.findById(req.user._id);
      if (training in current_user.assigned_trainings) {
        current_user.assigned_trainings[training].complete = true;
        await current_user.update();
        res.status(200).json({
          status: "success",
          message: "Passed quiz!",
          data: [],
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Training name invalid!",
          data: [],
        });
      }
    } else {
      res.status(200).json({
        status: "success",
        message: "Failed quiz!",
        data: out,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during quiz submission: ${err}`,
    });
  }
}
