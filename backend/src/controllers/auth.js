import User from "../models/User.js";

export async function Register(req, res) {
  const { first_name, last_name, email, password, role } = req.query;
  console.log(req.query);
  try {
    // Check for user existence first
    const activeUser = await User.findOne({ email }); // Emails are unique
    if (activeUser) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "This user already has an account!",
      });
    }
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      role,
    });
    await newUser.save();
    const { ...user_data } = newUser._doc;
    res.status(200).json({
      status: "success",
      data: [user_data], // Return user data
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
  const { email } = req.query;
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
      `${req.query.password}`,
      user.password
    );
    if (!passwordCorrect)
      return res.status(401).json({
        status: "failed",
        data: [],
        message: "Invalid login. Please try again.",
      });
    let options = {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    const token = user.generateAcessJWT();
    res.cookie("SessionID", token, options);
    res.status(200).json({
      status: "success",
      message: "Successful login.",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error in login: ${error}`,
    });
  }
}
