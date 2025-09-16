import mongoose from "mongoose";

<<<<<<< HEAD
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (v) {
          return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (v) {
          return !v || /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
    },
    googleId: { type: String, unique: true, sparse: true },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true,
    // Ensure at least one auth method exists
    validate: {
      validator: function () {
        return this.email || this.phone || this.googleId;
      },
      message:
        "User must have at least one authentication method (email, phone, or Google)",
    },
  }
);
=======
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: { 
    type: String, 
    unique: true, 
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  password: { 
    type: String,
    minlength: [6, 'Password must be at least 6 characters']
  },
  googleId: { type: String, unique: true, sparse: true },
  otp: String,
  otpExpiry: Date,
  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String, default: null },
  resetToken: String, 
  resetTokenExpiry: Date, 
}, { 
  timestamps: true,
  // Ensure at least one auth method exists
  validate: {
    validator: function() {
      return this.email || this.phone || this.googleId;
    },
    message: 'User must have at least one authentication method (email, phone, or Google)'
  }
});
>>>>>>> 04d5531 (first)

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ googleId: 1 });
<<<<<<< HEAD
UserSchema.index({ resetToken: 1 });
UserSchema.index({ resetTokenExpiry: 1 });

const User = mongoose.model("User", UserSchema);
<<<<<<< HEAD
export default User;
=======
export default User;
>>>>>>> c8c5b41e68847d95016426445812822212b27e0d
=======
UserSchema.index({ resetToken: 1 }); 
UserSchema.index({ resetTokenExpiry: 1 }); 

const User = mongoose.model('User', UserSchema);
export default User;
>>>>>>> 04d5531 (first)
