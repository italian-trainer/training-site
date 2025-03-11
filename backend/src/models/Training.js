import mongoose from "mongoose";

const TrainingSchema = new mongoose.Schema({
  title: { type: String, unique: true, require: true },
  description: { type: String, require: true },
  pages: { type: [String], require: true },
  total_pages: { type: Number, require: true },
  assigned_users: { type: [Map], require: true, unique: false },
  quiz: { type: String, require: true },
  // {
  // display_name: "dsdsdsd",
  // "user_id": "sdjasdkj",
  // }
});
export default mongoose.model("training", TrainingSchema); // Construct schema
