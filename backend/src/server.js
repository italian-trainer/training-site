// Basic dependencies
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Import config
import { PORT, m_URI } from "./config/index.js";

// Import routes
import router from "./routes/index.js";

// Initalize Server
const server = express();

server.use(cors());
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Connect to MongoDB
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
  .connect(m_URI, {})
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Setup routes
router(server);

// Initalize Server
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
