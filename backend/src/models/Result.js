import mongoose from "mongoose";
const { Schema } = mongoose;

const ResultSchema = new Schema({
  username: { type: String, required: true },
  result: { type: Number, required: true, default: [] },
  attempts: { type: Number, required: true, default: 0 },
  points: { type: Number, required: true, default: 0 },
  achived: { type: String, required: true, default: "" },
  createAt: { type: Date, default: Date.now },
});

export default mongoose.model("Result", ResultSchema);
