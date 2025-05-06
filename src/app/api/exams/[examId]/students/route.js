import db from "../../../../lib/mongodb";
import { Attempt, Result, User } from "../../../../lib/models";
import { authenticate, teacherAuth } from "../../../../lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
    await db;

    try {
        // Check if the user is authenticated as a teacher
        const authResult = await teacherAuth(req);

        if (!authResult.authenticated) {
            return new Response(JSON.stringify({ error: authResult.error }), {
                status: authResult.status,
            });
        }

        const examId = params.examId;

        // Validate the examId
        if (!ObjectId.isValid(examId)) {
            return new Response(JSON.stringify({ error: "Invalid exam ID" }), {
                status: 400,
            });
        }

        // Find completed attempts for this exam
        const attempts = await Attempt.find({
            examId: new ObjectId(examId),
            completed: true,
        });

        // Extract unique user IDs
        const userIds = [...new Set(attempts.map((attempt) => attempt.userId))];

        // Find results for these students
        const results = await Result.find({
            examId: examId,
            userId: { $in: userIds },
        });

        // Create a map of results by user ID for easy lookup
        const resultsByUser = results.reduce((acc, result) => {
            acc[result.userId.toString()] = result;
            return acc;
        }, {});

        // Find all users
        const users = await User.find({
            _id: { $in: userIds },
            role: "student",
        }).select("_id name email");

        // Add result data to each user
        const studentsWithResults = users.map((user) => {
            const result = resultsByUser[user._id.toString()];
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                result: result ?
                    {
                        _id: result._id,
                        score: result.score,
                        percentage: result.percentage,
                        passed: result.passed,
                        createdAt: result.createdAt,
                    } :
                    null,
            };
        });

        // Sort by performance (highest score first)
        studentsWithResults.sort((a, b) => {
            if (!a.result) return 1;
            if (!b.result) return -1;
            return b.result.percentage - a.result.percentage;
        });

        return new Response(JSON.stringify(studentsWithResults), { status: 200 });
    } catch (error) {
        console.error(`Error fetching students for exam ${params.examId}:`, error);
        return new Response(JSON.stringify({ error: "Failed to fetch students" }), {
            status: 500,
        });
    }
}