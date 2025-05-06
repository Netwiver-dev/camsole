import db from "../../../../../lib/mongodb";
import { authenticate } from "../../../../../lib/auth";
import {
    User,
    Exam,
    Result,
    Attempt,
    Certificate,
} from "../../../../../lib/models";

export async function GET(req) {
    await db;

    try {
        // Authenticate user
        const authResult = await authenticate(req);

        if (!authResult.authenticated || authResult.user.role !== "teacher") {
            return new Response(
                JSON.stringify({ error: "Unauthorized. Teachers only." }), { status: 401 }
            );
        }

        // Get statistics for teacher dashboard

        // Count total students
        const totalStudents = await User.countDocuments({ role: "student" });

        // Get exams created by this teacher
        const exams = await Exam.find({ createdBy: authResult.user._id });
        const totalExams = exams.length;

        // Get exam IDs
        const examIds = exams.map((exam) => exam._id);

        // Count completed exams
        const examsCompleted = await Attempt.countDocuments({
            examId: { $in: examIds },
            completed: true,
        });

        // Count certificates issued
        const certificatesIssued = await Certificate.countDocuments({
            examId: { $in: examIds },
        });

        // Get recent exams (last 5)
        const recentExams = await Exam.find({ createdBy: authResult.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent results (last 5)
        const recentResults = await Result.find({ examId: { $in: examIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("userId", "name email")
            .populate("examId", "title");

        const dashboardData = {
            totalStudents,
            totalExams,
            examsCompleted,
            certificatesIssued,
            recentExams,
            recentResults,
        };

        return new Response(JSON.stringify(dashboardData), { status: 200 });
    } catch (error) {
        console.error("Error fetching teacher dashboard data:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch dashboard data" }), { status: 500 }
        );
    }
}