import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function Register(req, res) {
  const { first_name, last_name, user_id, email, password } = req.body;
  try {
    // Check for user existence first
    const activeUser = await User.findOne({ user_id }); // IDs are unique
    if (!activeUser) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "This user is not in the roster!",
      });
    }
    // Update user info for potential edits
    if (first_name) activeUser.first_name = first_name;
    if (last_name) activeUser.last_name = last_name;
    if (email) activeUser.email = email;
    if (password) activeUser.password = password;
    await activeUser.save();
    res.status(200).json({
      status: "success",
      message: "Registration successful",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error during registration: ${err}`,
    });
  }
}

export async function Login(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({
        status: "failed",
        data: [],
        message: "Account does not exist!",
      });

    // Check password
    const passwordCorrect = await bcrypt.compare(
      `${req.body.password}`,
      user.password
    );
    if (!passwordCorrect)
      return res.status(401).json({
        status: "failed",
        data: [],
        message: "Invalid login. Please try again.",
      });
    let options = {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    const token = user.generateAcessJWT();
    res.cookie("SessionID", token, options);
    res.status(200).json({
      status: "success",
      message: "Successful login.",
      body: { role: user.role },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error in login: ${err}`,
    });
  }
}

export async function getInfo(req, res) {
  res.status(200).json({
    status: "success",
    code: 200,
    data: req.user,
    message: "Retrieved user info!",
  });
}
