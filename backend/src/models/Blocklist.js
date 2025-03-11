import mongoose from "mongoose";
const BlocklistSchema = new mongoose.Schema({
  cookie: {
    type: String,
    required: true,
    ref: "User",
  },
});
export default mongoose.model("blocklist", BlocklistSchema);
