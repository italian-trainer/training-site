import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { server_key } from "../config/index.js";

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
    },
    first_name: {
      type: String,
      required: "First name is required",
    },
    last_name: {
      type: String,
      required: "Last name is required",
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: "Please enter a valid role",
      validate: RegExp("(manager|employee|admin)"),
    },
    password: {
      type: String,
      select: false,
    },
    messages: {
      type: [String],
    },
    assigned_trainings: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  // Store pass securely
  const user = this;

  if (!user.isModified("password")) return next(); // If pass was not modified, we can continue
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err); // Stop if salting error
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err); // Stop if hashing error
      user.password = hash; // Save password as hashed and salted password
      next(); // Success!
    });
  });
});

UserSchema.methods.generateAcessJWT = function () {
  let payload = {
    id: this.id,
  };
  return jwt.sign(payload, server_key, {
    expiresIn: "24h",
  });
};

export default mongoose.model("users", UserSchema); // Construct schema
