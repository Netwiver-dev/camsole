import db from "../../lib/mongodb";
import { Exam } from "../../lib/models";

export async function POST(req) {
	await db;
	const data = await req.json();
	const exam = await Exam.create(data);
	return new Response(JSON.stringify(exam), { status: 201 });
}

export async function GET(req) {
	await db;
	const { searchParams } = new URL(req.url);
	const examId = searchParams.get("examId");
	if (examId) {
		const exam = await Exam.findById(examId);
		if (!exam) return new Response("Exam not found", { status: 404 });
		return new Response(JSON.stringify(exam), { status: 200 });
	}
	const exams = await Exam.find();
	return new Response(JSON.stringify(exams), { status: 200 });
}
