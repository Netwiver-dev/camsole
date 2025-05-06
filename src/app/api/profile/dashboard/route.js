import db from "../../../lib/mongodb";
import { authenticate } from "../../../lib/auth";
import { Exam, Attempt, Result } from "../../../lib/models";

export async function GET(req) {
    await db;

    try {
        // Authenticate user
        const authResult = await authenticate(req);

        if (!authResult.authenticated) {
            return new Response(JSON.stringify({ error: authResult.error }), {
                status: authResult.status,
            });
        }

        const userId = authResult.user._id;

        // Get all attempts for this user
        const attempts = await Attempt.find({ userId });

        // Get all results for this user
        const results = await Result.find({ userId });

        // Get all exams for this user's class
        const exams = await Exam.find({
            status: "published",
            assignedTo: authResult.user.class,
        });

        // Calculate statistics
        const examIds = exams.map((exam) => exam._id.toString());

        // Upcoming exams
        const upcomingExams = exams
            .filter((exam) => {
                // Check if user has not started or completed the exam
                const hasAttempted = attempts.some(
                    (attempt) => attempt.examId.toString() === exam._id.toString()
                );
                return !hasAttempted;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Completed exams
        const completedExams = [];
        for (const result of results) {
            const exam = exams.find(
                (e) => e._id.toString() === result.examId.toString()
            );
            if (exam) {
                completedExams.push({
                    ...exam.toObject(),
                    result: result.toObject(),
                });
            }
        }

        // Calculate statistics
        let totalScore = 0;
        let highestScore = 0;

        results.forEach((result) => {
            totalScore += result.percentage || 0;
            if ((result.percentage || 0) > highestScore) {
                highestScore = result.percentage || 0;
            }
        });

        const averageScore = results.length > 0 ? totalScore / results.length : 0;

        const dashboardData = {
            totalExams: exams.length,
            examsTaken: results.length,
            averageScore: averageScore,
            highestScore: highestScore,
            upcomingExams: upcomingExams.slice(0, 3),
            recentResults: completedExams
                .sort(
                    (a, b) =>
                    new Date(b.result.createdAt || b.date) -
                    new Date(a.result.createdAt || a.date)
                )
                .slice(0, 5),
        };

        return new Response(JSON.stringify(dashboardData), { status: 200 });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch dashboard data" }), { status: 500 }
        );
    }
}