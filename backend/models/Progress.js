const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Scehema({
  courseID: {
    type: mongoose.Scehema.Types.ObjectId,
    ref: "Course",
    require: true,
  },
  userID: { type: mongoose.Scehema.Types.ObjectId, ref: "User", require: true },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.models("Progress", ProgressSchema);
