import db from "../../../../lib/mongodb";
import {
    Exam,
    Attempt,
    Result,
    User,
    Certificate,
} from "../../../../lib/models";
import { authenticate, teacherAuth } from "../../../../lib/auth";

export async function GET(req) {
    await db;

    try {
        // Check if the user is authenticated as a teacher
        const authResult = await teacherAuth(req);

        if (!authResult.authenticated) {
            return new Response(JSON.stringify({ error: authResult.error }), {
                status: authResult.status,
            });
        }

        const teacherId = authResult.user._id;

        // Get all exams created by this teacher
        const exams = await Exam.find({ createdBy: teacherId }).sort({
            createdAt: -1,
        });

        // For each exam, get detailed statistics
        const examsWithStats = await Promise.all(
            exams.map(async(exam) => {
                // Get attempts, results, and certificates
                const [attempts, results, certificates] = await Promise.all([
                    Attempt.countDocuments({
                        examId: exam._id,
                        completed: true,
                    }),
                    Result.find({ examId: exam._id }),
                    Certificate.countDocuments({ examId: exam._id }),
                ]);
                // Calculate statistics
                let averageScore = 0;
                let passRate = 0;
                let topScore = 0;

                if (results.length > 0) {
                    // Average score
                    const totalScore = results.reduce(
                        (sum, result) => sum + result.percentage,
                        0
                    );
                    averageScore = (totalScore / results.length).toFixed(1);

                    // Pass rate
                    const passedCount = results.filter((result) => result.passed).length;
                    passRate = ((passedCount / results.length) * 100).toFixed(1);

                    // Top score
                    topScore = Math.max(
                        ...results.map((result) => result.percentage)
                    ).toFixed(1);
                }

                return {
                    ...exam.toObject(),
                    stats: {
                        attempts,
                        completedCount: results.length,
                        averageScore,
                        passRate,
                        topScore,
                        certificatesIssued: certificates,
                    },
                };
            })
        );

        return new Response(JSON.stringify(examsWithStats), { status: 200 });
    } catch (error) {
        console.error("Error fetching teacher exams:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch exams" }), {
            status: 500,
        });
    }
}