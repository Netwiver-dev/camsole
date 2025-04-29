import db from "../../lib/mongodb";
import { Exam, Result } from "../../lib/models";

export async function POST(req) {
	await db;
	const { examId, studentName, answers } = await req.json();
	const exam = await Exam.findById(examId);
	if (!exam) return new Response("Exam not found", { status: 404 });

	let correct = 0;
	exam.questions.forEach((q, i) => {
		if (answers[i] === q.correctAnswer) correct++;
	});
	const percentage = Math.round((correct / exam.questions.length) * 100);
	const score = correct;

	const result = await Result.create({
		examId,
		studentName,
		answers,
		score,
		percentage,
	});
	return new Response(JSON.stringify(result), { status: 201 });
}

export async function GET(req) {
	await db;
	const { searchParams } = new URL(req.url);
	const examId = searchParams.get("examId");
	const studentName = searchParams.get("studentName");
	const result = await Result.findOne({ examId, studentName });
	if (!result) return new Response("Result not found", { status: 404 });
	return new Response(JSON.stringify(result), { status: 200 });
}
