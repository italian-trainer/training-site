import auth from "./auth.js";
import roster from "./roster.js";
import verify from "../middleware/verify.js";
import quiz from "./quiz.js"; // Import the quiz router
import trainings from "./trainings.js";
import messages from "./message.js";

const Router = (server) => {
  server.get("/", (req, res) => {
    try {
      res.status(200).json({
        status: "success",
        data: [],
        message: "Server is active!",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });

  server.use("/roster", roster);
  server.use("/auth", auth);
  server.use("/quiz", quiz); // Use the quiz router
  server.use("/messages", messages);
  server.use("/trainings", trainings); // Use the quiz router
};

export default Router;
