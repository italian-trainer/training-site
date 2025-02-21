import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { server_key } from "../config/index.js";

const UserSchema = new mongoose.Schema(
  {
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
      required: "Email is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: "Password is required",
      select: false,
    },
    role: {
      type: String,
      required: "Please enter a valid role",
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
