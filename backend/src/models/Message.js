import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "users" }, //Sender should be a manager or an admin. should be ID or username?
    receiver: { type: Schema.Types.ObjectId, ref: "users" },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["notification", "task", "quiz", "system"],
      required: true,
    },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
