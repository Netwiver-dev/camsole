import db from "../../../../lib/mongodb";
import { Exam, Attempt, Result } from "../../../../lib/models";
import { studentAuth } from "../../../../lib/auth";

// Start an exam attempt
export async function GET(req) {
    await db;

    try {
        // Authenticate student
        const authResult = await studentAuth(req);

        if (!authResult.authenticated) {
            return new Response(JSON.stringify({ error: authResult.error }), {
                status: authResult.status,
            });
        }

        const userId = authResult.user._id;
        const { searchParams } = new URL(req.url);
        const examId = searchParams.get("examId");

        if (!examId) {
            return new Response(JSON.stringify({ error: "Exam ID is required" }), {
                status: 400,
            });
        }

        // Check if exam exists and is published
        const exam = await Exam.findOne({ _id: examId, status: "published" });

        if (!exam) {
            return new Response(
                JSON.stringify({ error: "Exam not found or not published" }), { status: 404 }
            );
        }

        // Check if student is in an assigned class
        if (!exam.assignedTo.includes(authResult.user.class)) {
            return new Response(
                JSON.stringify({ error: "You are not authorized to take this exam" }), { status: 403 }
            );
        }

        // Check if student has a completed result already
        const existingResult = await Result.findOne({
            userId,
            examId,
            completed: true,
        });

        if (existingResult) {
            return new Response(
                JSON.stringify({ error: "You have already completed this exam" }), { status: 400 }
            );
        }

        // Check for an existing attempt
        let attempt = await Attempt.findOne({ userId, examId });

        if (!attempt) {
            // Parse duration (HH:MM) to calculate timeRemaining
            const [hours, minutes] = exam.duration.split(":").map(Number);

            // Create new attempt
            attempt = await Attempt.create({
                userId,
                examId,
                startTime: new Date(),
                timeRemaining: exam.duration,
                answers: new Array(exam.questions.length).fill(null),
                flaggedQuestions: [],
            });
        }

        // Send only necessary exam data to minimize payload size
        const examData = {
            _id: exam._id,
            title: exam.title,
            description: exam.description,
            duration: exam.duration,
            questions: exam.questions.map((q) => ({
                text: q.text,
                image: q.image,
                options: q.options,
                // Don't send correct answers to client
            })),
        };

        return new Response(
            JSON.stringify({
                exam: examData,
                attempt,
            }), { status: 200 }
        );
    } catch (error) {
        console.error("Error starting exam:", error);
        return new Response(JSON.stringify({ error: "Failed to start exam" }), {
            status: 500,
        });
    }
}