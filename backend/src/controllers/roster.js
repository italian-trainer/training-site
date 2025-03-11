import User from "../models/User.js";
import Training from "../models/Training.js";
import { v4 as uuidv4 } from "uuid";

export async function addToRoster(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot add to roster
  }
  const { role, first_name, last_name } = req.body;
  if (req.user.role == "manager" && (role == "manager" || role == "admin")) {
    return res.sendStatus(401); // Managers cannot create managers or admins
  }
  try {
    const user_id = uuidv4(); // Generate random UUID for user
    const newUser = new User({
      first_name,
      last_name,
      user_id,
      role,
      email: user_id,
    });
    await newUser.save();
    res.status(200).json({
      status: "success",
      message: "User added to roster successfully",
      data: newUser._doc,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during roster addition: ${err}`,
    });
  }
}

export async function readRoster(req, res) {
  try {
    const users = await User.find();
    if (users == null) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: {},
        message: "No users!",
      });
      return;
    }
    var out = [];
    for (const i in users) {
      if (req.user.role == "employee") {
        const { user_id, assigned_trainings, messages, __v, ...user_info } =
          users[i]._doc;
        out.push(user_info);
      } else {
        const { __v, messages, ...user_info } = users[i]._doc; // Managers can see user_ids and trainings
        out.push(user_info);
      }
    }
    res.status(200).json({
      status: "success",
      message: "Users successfully retrieved",
      data: out,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during roster retrieval: ${err}`,
    });
  }
}

export async function getUserTrainings(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot read roster
  }
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Could not find user!",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "User training successfully retrieved",
      data: user.assigned_trainings,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during retrieval of user trainings: ${err}`,
    });
  }
}

export async function assignmentsForTraining(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot read roster
  }
  const { training } = req.body;
  try {
    const training_obj = await Training.findOne({ title: training });
    if (training_obj == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Could not find user!",
      });
      return;
    }
    var out = [];
    for (const i in training_obj.assigned_users) {
      out.push(training_obj.assigned_users[i].get("display_name"));
    }
    res.status(200).json({
      status: "success",
      message: "Users assigned to training successfully retrieved",
      data: out,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during retrieval of training assignments: ${err}`,
    });
  }
}

export async function assignTraining(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot read roster
  }
  const { training, email } = req.body;
  try {
    const assigned_training = await Training.findOne({ title: training });
    const assigned_user = await User.findOne({ email });
    if (assigned_training == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Assigned training does not exist!",
      });
    }
    if (assigned_user == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Assigned user does not exist!",
      });
    }
    for (var i in assigned_training.assigned_users) {
      if (assigned_training.assigned_users[i].get("email") == email) {
        res.status(500).json({
          status: "error",
          code: 500,
          data: [],
          message: "Already assigned to user!",
        });
        return;
      }
    }
    assigned_training.assigned_users.push({
      display_name: assigned_user.first_name + " " + assigned_user.last_name,
      email: email,
    });
    if (assigned_user.assigned_trainings == null) {
      assigned_user.assigned_trainings = {};
    }
    assigned_user.assigned_trainings.push({
      training,
      current_page: 0, // Start at page 0
      total_pages: assigned_training.total_pages,
      complete: false,
    });
    await assigned_training.save();
    await assigned_user.save();
    res.status(200).json({
      status: "success",
      message: "Successfully assigned training",
      data: [],
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during training assignment: ${err}`,
    });
  }
}
