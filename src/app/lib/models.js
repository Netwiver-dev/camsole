import mongoose from "mongoose";

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

const ExamSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: String,
	date: Date,
	duration: String,
	questions: [QuestionSchema],
});

const ResultSchema = new mongoose.Schema({
	examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
	studentName: String,
	answers: [{ type: Number }],
	score: Number,
	percentage: Number,
	createdAt: { type: Date, default: Date.now },
});

export const Exam = mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
export const Result =
	mongoose.models.Result || mongoose.model("Result", ResultSchema);
