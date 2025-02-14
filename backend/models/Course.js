const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, require: true },
  desciption: { type: String, require: true },
  videoURL: { type: String, require: true },
  quiz: [{ question: String, options: [String], answer: String }],
});

module.export = mongoose.models("Course", CourseSchema);
