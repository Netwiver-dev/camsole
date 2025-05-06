import mongoose from "mongoose";

// User schema to support both teachers and students
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["teacher", "student"], required: true },
  class: { type: String }, // For students: "Jss1a", "Jss2b", etc.
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

// Class schema for managing different classes
const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Jss1a", "SS3b"
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

// Question schema for exam questions
const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String }, // optional base64 or URL of question image
  options: [
    {
      text: { type: String, required: true },
      image: { type: String }, // optional image per option
    },
  ],
  correctAnswer: { type: Number, required: true }, // index of correct option
});

// Exam schema for test creation and management
const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  duration: { type: String, required: true }, // Format: "HH:MM"
  questions: [QuestionSchema],
  totalMarks: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: [{ type: String }], // List of class names
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Exam attempt schema to track student progress
const AttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  timeRemaining: String,
  answers: [{ type: Number }], // Array of selected option indexes
  flaggedQuestions: [{ type: Number }], // Array of flagged question indexes
  completed: { type: Boolean, default: false },
  submittedAutomatically: { type: Boolean, default: false } 
});

// Result schema for storing test results
const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  answers: [{ type: Number }],
  score: Number,
  percentage: Number,
  startTime: Date,
  endTime: Date,
  completed: { type: Boolean, default: true },
  submittedAutomatically: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Certificate schema for verification
const CertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  resultId: { type: mongoose.Schema.Types.ObjectId, ref: "Result", required: true },
  certificateId: { type: String, required: true, unique: true }, // Unique ID for verification
  issueDate: { type: Date, default: Date.now },
  expiryDate: Date,
  verified: { type: Boolean, default: true }
});

// Define models
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);
export const Exam = mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
export const Attempt = mongoose.models.Attempt || mongoose.model("Attempt", AttemptSchema);
export const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);
export const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);
