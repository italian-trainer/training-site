import mongoose from "mongoose";
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], default: [], required: true }, //type is array of strings
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const QuizSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
});

// {
// title: "title of quiz",
// description: "description of quiz"
// questions : [
// {
// question: "what is the answer?"
// options: ["a", "b", "c"],
// answer: "b"
//}
// ]
// }
//

export default mongoose.model("Quiz", QuizSchema);
