import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String }, // optional if you want to get from user
  phone: { type: String },
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference logged-in user
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", ContactSchema);

export default Contact;
