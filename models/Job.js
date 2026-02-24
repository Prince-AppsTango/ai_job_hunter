import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  link: { type: String, unique: true },
  description: String,
  matchScore: Number,
  sent: { type: Boolean, default: false },
  applied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Job", jobSchema);