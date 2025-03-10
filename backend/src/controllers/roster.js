import User from "../models/User.js";
import Training from "../models/Training.js";
import { v4 as uuidv4 } from "uuid";

export async function addToRoster(req, res) {
  console.log(req.query);
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot add to roster
  }
  const { role, first_name, last_name } = req.query;
  if (req.user.role == "manager" && (role == "manager" || role == "admin")) {
    return res.sendStatus(401); // Managers cannot create managers or admins
  }
  try {
    const user_id = uuidv4(); // Generate random UUID for user
    console.log(user_id);
    const newUser = new User({
      first_name,
      last_name,
      user_id,
      role,
    });
    await newUser.save();
    res.status(200).json({
      status: "success",
      message: "User added to roster successfully",
      data: [newUser._doc],
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
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot read roster
  }
  try {
    const users = await User.find();
    var out = {};
    console.log(users);
    for (const i in users) {
      const { user_id, __v, _id, ...user_data } = users[i]._doc;
      out[user_id] = user_data;
    }
    res.status(200).json({
      status: "success",
      message: "Users successfully retrieved",
      data: [out],
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
  const { email } = req.query;
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
      data: [user.assigned_trainings],
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
  const { training } = req.query;
  try {
    const training_obj = await Training.findOne({ title: train });
    if (training_obj == null) {
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Could not find user!",
      });
      return;
    }
    out = [];
    for (const i in training_obj.assigned_users) {
      out.append(training.assigned_users[i].display_name);
    }
    res.status(200).json({
      status: "success",
      message: "Users assigned to training successfully retrieved",
      data: [out],
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

export async function assignTraining(req, res) {
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot read roster
  }
  const { training, email } = req.query;
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
    assigned_training.assigned_users.append({
      display_name: assigned_user.first_name + " " + assigned_user.last_name,
      email: email,
    });
    assigned_user.assigned_trainings[training_name] = {
      current_page: 0, // Start at page 0
      total_pages: assigned_training.total_pages,
      complete: false,
    };
    await assigned_training.save();
    await assigned_user.save();
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during training assignment: ${err}`,
    });
  }
}
