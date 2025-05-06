import db from "../../../../../lib/mongodb";
import { Result, Exam, User } from "../../../../../lib/models";
import { authenticate } from "../../../../../lib/auth";
import { generateResultPdf } from "../../../../../lib/pdf-generator";

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

        // Get user data
        const user = await User.findById(result.userId);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        // Generate PDF
        const pdfBuffer = await generateResultPdf(result, exam, user);

        // Return PDF as downloadable file
        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="result-${resultId}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
            status: 500,
        });
    }
}