import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must have at least 6 characters"],
    maxlength: 100,
  },
  phone: { type: String, required: true, unique: true },
  accountVerified: { type: Boolean, default: false },
  verificationMethod: {
    type: String,
    enum: ["email", "phone", "call"],
    required: true,
  },
  verificationCode: Number,
  verificationCodeExpire: Date,
  resetPassword: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate a 5-digit verification code (1xxxxx)
UserSchema.methods.generateVerificationCode = function () {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const randomDigit = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const code = parseInt(firstDigit + randomDigit);

  this.verificationCode = code;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 min
  return code;
};

const User = mongoose.model("User", UserSchema);
export default User;
