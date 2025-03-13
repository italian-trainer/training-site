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

export async function deleteTraining(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot delete trainings
  }
  const { training } = req.body;
  try {
    var status = await Training.findOneAndDelete({ title: training });
    if (status == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Training not found!",
      });
    } else {
      res.status(200).json({
        status: "success",
        code: 200,
        data: [],
        message: "Successfully deleted training!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Error deleting training!",
    });
  }
}

export async function getPage(req, res) {
  const { training, page } = req.body;
  try {
    const current_training = await Training.findOne({ title: training });
    if (current_training == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Training does not exist!",
      });
      return;
    }
    var out = {};

    if (page < 0 || page > current_training.total_pages) {
      return res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Page is out of bounds!",
      });
    }

    if (page == current_training.total_pages) {
      out = { type: "quiz", body: current_training.quiz };
    } else {
      out = { type: "html", body: current_training.pages[page] };
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, "assigned_trainings.training": training },
      {
        $set: {
          "assigned_trainings.$": {
            training: training,
            current_page: page,
            total_pages: current_training.total_pages,
            complete: false,
            quiz: current_training.quiz,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({
        status: "error",
        code: 500,
        message: "Error in current page update...",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Page retrieved successfully",
      data: out,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during training access: ${err}`,
    });
  }
}

export async function submitQuiz(req, res) {
  const { training, quiz, filled_form } = req.body;
  try {
    const target_quiz = await Quiz.findOne({ title: quiz });
    if (target_quiz == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Quiz does not exist!",
      });
      return;
    }
    const target_training = await Training.findOne({ title: training });
    if (target_training == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Training does not exist!",
      });
      return;
    } else if (target_training.get("quiz") != quiz) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Quiz does not match with training!",
      });
      return;
    }
    var incorrect_questions = [];
    for (const i in target_quiz.questions) {
      if (filled_form[i] != target_quiz.questions[i].answer) {
        incorrect_questions.push(target_quiz.questions[i].question);
      }
    }
    if (incorrect_questions.length == 0) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id, "assigned_trainings.training": training },
        {
          $set: {
            "assigned_trainings.$": {
              training: training,
              current_page: target_training.total_pages + 1,
              total_pages: target_training.total_pages,
              complete: true,
              quiz: target_training.quiz,
            },
          },
        },
        { new: true }
      );
      const updatedTraining = await Training.findOneAndUpdate(
        { title: training, "assigned_users.email": req.user.email },
        {
          $set: {
            "assigned_users.$": {
              display_name: req.user.first_name + " " + req.user.last_name,
              email: req.user.email,
              complete: true,
            },
          },
        },
        { new: true }
      );

      if (!updatedUser || !updatedTraining) {
        return res.status(500).json({
          status: "error",
          code: 500,
          message: "Error in quiz submission...",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Passed quiz!",
        data: incorrect_questions,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Failed quiz!",
        data: incorrect_questions,
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
