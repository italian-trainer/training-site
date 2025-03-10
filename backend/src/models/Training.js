import mongoose from "mongoose";

const TrainingSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  pages: { type: [Map] },
  // {
  // type: "html"
  // body: "HTML Page"
  // }
  total_pages: { type: Number },
  assigned_users: { type: [Map] },
  // {
  // display_name: "dsdsdsd",
  // "user_id": "sdjasdkj",
  // }
});
export default mongoose.model("training", TrainingSchema); // Construct schema
