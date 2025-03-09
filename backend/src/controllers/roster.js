import User from "../models/User.js";
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
