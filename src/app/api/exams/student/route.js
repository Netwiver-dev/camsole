import db from "../../../lib/mongodb";
import { Exam, Attempt, Result, User } from "../../../lib/models";
import { studentAuth } from "../../../lib/auth";

// Get exams for student dashboard
export async function GET(req) {
    await db;

    try {
        // Check if the user is authenticated as a student
        const authResult = await studentAuth(req);

        if (!authResult.authenticated) {
            return new Response(JSON.stringify({ error: authResult.error }), {
                status: authResult.status,
            });
        }

        const userId = authResult.user._id;
        const studentClass = authResult.user.class;

        // Get all published exams assigned to student's class
        const exams = await Exam.find({
            status: "published",
            assignedTo: studentClass,
        }).sort({ date: 1 });

        // Get attempts and results for these exams
        const examResults = await Promise.all(
            exams.map(async(exam) => {
                // Check for attempt
                const attempt = await Attempt.findOne({
                    userId,
                    examId: exam._id,
                });

                // Check for result
                const result = await Result.findOne({
                    userId,
                    examId: exam._id,
                });

                return {
                    _id: exam._id,
                    title: exam.title,
                    description: exam.description,
                    date: exam.date,
                    duration: exam.duration,
                    status: result ? .completed ?
                        "completed" :
                        attempt ?
                        "in-progress" :
                        "upcoming",
                    questions: exam.questions.length,
                    result: result ? {
                        _id: result._id,
                        score: result.score,
                        percentage: result.percentage,
                        completed: result.completed,
                    } : null,
                    attempt: attempt ? {
                        _id: attempt._id,
                        timeRemaining: attempt.timeRemaining,
                        completed: attempt.completed,
                    } : null,
                };
            })
        );

        return new Response(JSON.stringify(examResults), { status: 200 });
    } catch (error) {
        console.error("Error getting student exams:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch exams" }), {
            status: 500,
        });
    }
}