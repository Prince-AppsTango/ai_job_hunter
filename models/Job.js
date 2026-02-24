import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  link: {
    type: String,
    unique: true,
    required: true,
    index: true
  },

  description: {
    type: String,
    trim: true
  },

  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  matchedSkills: {
    type: [String],
    default: []
  },

  missingSkills: {
    type: [String],
    default: []
  },

  sent: {
    type: Boolean,
    default: false
  },

  applied: {
    type: Boolean,
    default: false
  },

  source: {
    type: String,
  },

  appliedAt: {
    type: Date
  }

}, {
  timestamps: true 
});

export default mongoose.model("Job", jobSchema);