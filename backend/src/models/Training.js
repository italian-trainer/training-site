import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  display_name: { type: String, unique: false, require: true },
  email: { type: String, unique: false, require: true },
  complete: { type: Boolean, require: true, default: false },
});

const TrainingSchema = new mongoose.Schema({
  title: { type: String, unique: true, require: true },
  description: { type: String, require: true },
  pages: { type: [String], require: true },
  total_pages: { type: Number, require: true },
  assigned_users: { type: [AssignmentSchema], require: true, unique: false },
  quiz: { type: String, require: true },
  // {
  // display_name: "dsdsdsd",
  // "user_id": "sdjasdkj",
  // }
});
export default mongoose.model("training", TrainingSchema); // Construct schema
