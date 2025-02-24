import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

export async function addToRoster(req, res) {
  console.log(req.query);
  if (req.user.role == "employee") {
    return res.sendStatus(401); // Employees cannot add to roster
  }
  const { role, first_name, last_name } = req.query;
  if (req.user.role == "manager" && role == "manager") {
    return res.sendStatus(401); // Managers cannot create managers
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
