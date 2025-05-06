import connectToDatabase from "@/lib/mongodb";
import { Certificate, User, Exam, Result } from "@/lib/models";
import { getCurrentUser } from "@/lib/auth";
import { generateCertificatePDF } from "@/app/lib/pdf-generator";

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
        const certificateId = params.certificateId;

        if (!certificateId) {
            return new Response(
                JSON.stringify({ error: "Certificate ID is required" }), { status: 400 }
            );
        }

        // Find certificate by ID
        const certificate = await Certificate.findOne({ certificateId });

        if (!certificate) {
            return new Response(JSON.stringify({ error: "Certificate not found" }), {
                status: 404,
            });
        }

        // Check authorization (user owns certificate or teacher created exam)
        const isOwner = certificate.userId.toString() === userId.toString();

        // Get result data
        const result = await Result.findById(certificate.resultId);

        if (!result) {
            return new Response(JSON.stringify({ error: "Result not found" }), {
                status: 404,
            });
        }

        // Get exam data
        const exam = await Exam.findById(certificate.examId);

        if (!exam) {
            return new Response(JSON.stringify({ error: "Exam not found" }), {
                status: 404,
            });
        }

        // If teacher, check if they created the exam
        if (!isOwner &&
            (authResult.user.role !== "teacher" || !exam.createdBy.equals(userId))
        ) {
            return new Response(
                JSON.stringify({ error: "Unauthorized access to this certificate" }), { status: 403 }
            );
        }

        // Get user data
        const user = await User.findById(certificate.userId);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        // Generate PDF
        const pdfBuffer = await generateCertificatePDF(
            certificate,
            result,
            exam,
            user
        );

        // Return PDF as downloadable file
        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="certificate-${certificateId}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generating certificate PDF:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate certificate PDF" }), { status: 500 }
        );
    }
}