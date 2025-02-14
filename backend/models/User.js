const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, enum: ["Employee, Manager"], default: "Employee" },
  },
  { timestamps: true }
);

module.exports = mongoose.models("User", UserSchema);
