import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { server_key } from "../config/index.js";

export async function Verify(req, res, next) {
  console.log("Verification executed");
  try {
    const loginCookie = req.headers["cookie"];
    if (!loginCookie) return res.sendStatus(401); // If cookie DNE, unauthorzied
    const cookie = loginCookie.split("=")[1].split(";")[0]; // Ignore metadata, grab cookie contents, must be updated if new cookies are added
    // Verify cookie
    jwt.verify(cookie, server_key, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res
          .status(401)
          .json({ message: "This session is expired. Please log back in." });
      }
      const { id } = decoded; // Get the user id and role
      const user = await User.findById(id);
      const { password, ...user_data } = user._doc; // Don't return password
      req.user = user_data;
      next();
    });
  } catch (err) {
    console.log(err);
    res.catch(500).json({
      status: "error",
      code: 500,
      data: [],
      message: `Error in verification: ${error}`,
    });
  }
}
export default Verify;
