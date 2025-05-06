import db from "../../../../lib/mongodb";
import { Result, Exam, Certificate, User } from "../../../../lib/models";
import { authenticate } from "../../../../lib/auth";

export async function GET(req, { params }) {
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
        const resultId = params.resultId;

        if (!resultId) {
            return new Response(JSON.stringify({ error: "Result ID is required" }), {
                status: 400,
            });
        }

        // Find result by ID
        const result = await Result.findById(resultId);

        if (!result) {
            return new Response(JSON.stringify({ error: "Result not found" }), {
                status: 404,
            });
        }

        // Check authorization (user owns result or teacher created exam)
        const isOwner = result.userId.toString() === userId.toString();

        if (!isOwner && authResult.user.role !== "teacher") {
            return new Response(
                JSON.stringify({ error: "Unauthorized access to this result" }), { status: 403 }
            );
        }

        // Get exam data
        const exam = await Exam.findById(result.examId);

        if (!exam) {
            return new Response(JSON.stringify({ error: "Exam not found" }), {
                status: 404,
            });
        }

        // If teacher, check if they created the exam
        if (authResult.user.role === "teacher" && !exam.createdBy.equals(userId)) {
            return new Response(
                JSON.stringify({ error: "Unauthorized access to this result" }), { status: 403 }
            );
        }

        // Check for certificate (only for student viewing their own result)
        const certificate = isOwner ?
            await Certificate.findOne({
                userId,
                examId: result.examId,
            }) :
            null;

        return new Response(
            JSON.stringify({
                result,
                exam,
                certificate: certificate ? {
                    certificateId: certificate.certificateId,
                    issueDate: certificate.issueDate,
                } : null,
            }), { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching result:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch result" }), {
            status: 500,
        });
    }
}